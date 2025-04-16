import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AI_RESPONSE } from '../../config/AiResponse';
// Make sure QueryClient and QueryClientProvider are imported in App.js
import { useQuery } from '@tanstack/react-query';

// Import components
import { VisaRequirements } from '../../components/trips/VisaRequirements';
import { CultureInsights } from '../../components/trips/CultureInsights'; // Import the new component
import { NearbyEvents } from '../../components/trips/NearbyEvents';
import { TravelRecommendations } from '../../components/trips/TravelRecommendations';
import { DetailItem } from '../../components/shared/DetailItem';
import { ActivityItem } from '../../components/shared/ActivityItem';
import { Accordion } from '../../components/shared/Accordion';

// --- Static Content / Maps ---

const detailEmojis = {
  Destination: '✈️',
  Duration: '⏳',
  Expenses: '💵',
};

// --- Helper Functions ---

// Assuming the structure inside the aiGenerationFailed block is corrected
function usePlanData(route) {
  return useMemo(() => {
    if (route.params?.tripData) {
      const tripData = route.params.tripData;
      // Base plan data structure
      const planData = {
        details: [
          { name: 'Destination', value: tripData.destinationCity },
          { name: 'Duration', value: `${tripData.month} ${tripData.year}` },
          { name: 'Expenses', value: tripData.budgetLevel || 'Moderate' },
        ],
        days: [], // Default empty days
        visaRequirements: tripData.visaRequirements,
        nearbyEvents: tripData.nearbyEvents,
        recommendations: {
          places: tripData.recommendations?.places || [],
          tips: tripData.recommendations?.tips || [],
          culturalNotes: tripData.recommendations?.culturalNotes || [],
          safetyTips: tripData.recommendations?.safetyTips || []
        }
      };

      // Handle AI generation failure case
      if (tripData.aiGenerationFailed) {
        planData.days = [
          { // Corrected structure for Day 1 placeholder
            day: 1,
            activities: [
              {
                time: 'All day',
                name: 'Custom itinerary will be generated',
              }
            ],
            plan: [
              {
                time: 'Note',
                event:
                  'Your custom itinerary will be generated soon. Check back later!',
              }
            ]
          }
        ];
        // Return the planData with placeholder days
        return planData;
      } else {
        // Handle successful AI generation (using AI_RESPONSE for now)
        // In a real scenario, tripData itself might contain the aiPlan days/plan
        const aiPlan = AI_RESPONSE.UserPlan; // Assuming AI_RESPONSE.UserPlan has { details, days, ... }
        // Merge the dynamic data (like visa/events) with the potentially static AI plan structure
        return {
          ...aiPlan, // Takes details, days, etc. from AI_RESPONSE
          // Overwrite/add dynamic data received from the API/previous steps
          details: planData.details, // Use details derived from tripData
          visaRequirements: tripData.visaRequirements,
          nearbyEvents: tripData.nearbyEvents,
          recommendations: planData.recommendations, // Use recommendations derived from tripData
        };
      }
      // This return statement might be unreachable depending on the else block logic,
      // but included for completeness if the else block didn't return.
      // return planData;
    }
    // Fallback if no route.params.tripData
    return AI_RESPONSE.UserPlan;
  }, [route.params]);
}


function generatePdfContent(plan) {
    const destination = plan.details.find((d) => d.name === 'Destination')?.value || 'N/A';
    const duration = plan.details.find((d) => d.name === 'Duration')?.value || 'N/A';
    const expenses = plan.details.find((d) => d.name === 'Expenses')?.value || 'N/A';

    // (Keep the same HTML/CSS structure)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${destination} Travel Plan</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #f5f5f5, #e8e8e8); }
           .container { margin: 40px auto; max-width: 800px; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #00adef; }
          .header h1 { margin: 0; font-size: 32px; color: #007aff; }
          .header p { margin: 5px 0 0; font-size: 18px; color: #555; }
          .details { display: flex; justify-content: space-around; margin-bottom: 30px; border-bottom: 1px solid #e5e5ea; padding-bottom: 20px; }
          .detail { text-align: center; }
          .detail h3 { margin: 0; font-size: 16px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail p { margin: 5px 0 0; font-size: 20px; font-weight: 500; color: #333; }
          .day-section { margin-bottom: 40px; }
          .day-section h2 { font-size: 24px; color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed #00adef; }
          .plan-item { margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-left: 5px solid #00adef; border-radius: 8px; transition: background 0.3s ease; }
          .plan-item:hover { background: #f1faff; }
          .plan-item span.time { font-weight: 700; color: #007aff; margin-right: 15px; display: inline-block; width: 90px; }
          .plan-item span.event { color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${destination} Travel Plan</h1>
            <p>Embark on a journey to ${destination}</p>
          </div>
          <div class="details">
            <div class="detail"><h3>Destination</h3><p>${destination}</p></div>
            <div class="detail"><h3>Duration</h3><p>${duration}</p></div>
            <div class="detail"><h3>Expenses</h3><p>${expenses}</p></div>
          </div>
          {/* Check if plan.days exists before mapping */}
          ${plan?.days?.map((day) => `
            <div class="day-section">
              {/* Check if day.activities exists and has elements */}
              <h2>Day ${day.day}: ${day.activities?.[0]?.name || 'Activities'}</h2>
              {/* Check if day.plan exists before mapping */}
              ${day?.plan?.map((item) => `
                <div class="plan-item">
                  <span class="time">${item.time}</span>
                  <span class="event">${item.event}</span>
                </div>`).join('') || ''}
            </div>`).join('') || ''}
        </div>
      </body>
    </html>`;
    return htmlContent;
}


export function UserPlanScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  // Updated useQuery with object signature
  // NOTE: Ensure QueryClientProvider is wrapping your app in App.js or similar
  const { data: plan, isLoading, error } = useQuery({
    queryKey: ['plan', route.params?.tripData?.id],
    queryFn: () => usePlanData(route),
    enabled: !!route.params?.tripData,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Add state for Culture Insights loading/error (assuming not handled by main query)
  const [isLoadingCulture, setIsLoadingCulture] = useState(false); // State for Culture Insights loading
  const [cultureError, setCultureError] = useState(null); // State for Culture Insights error

  // Handlers (remain the same)
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('MainScreen'); // Adjust 'MainScreen' if your home route is different
  }, [navigation]);

  const handleHome = useCallback(() => navigation.navigate('MainScreen'), [navigation]); // Adjust 'MainScreen'
  const handleEditPlan = useCallback(() => navigation.navigate('AssistantScreen'), [navigation]); // Adjust 'AssistantScreen'
  const handleNext = useCallback(() => navigation.navigate('InformationScreen'), [navigation]); // Adjust 'InformationScreen'

  const handleShare = useCallback(async () => {
     if (!plan) return; // Exit if plan data isn't loaded

    const htmlContent = generatePdfContent(plan);
    try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });

        const destinationName = plan.details.find(d => d.name === 'Destination')?.value || 'TravelPlan';
        const safeFilename = destinationName.replace(/[^a-zA-Z0-9]/g, '_'); // Replace non-alphanumeric with underscore
        const newPath = `${FileSystem.documentDirectory}AlDaleel_${safeFilename}.pdf`;

        await FileSystem.moveAsync({ from: uri, to: newPath });

        if (!(await Sharing.isAvailableAsync())) {
          alert(`Sharing isn't available on this platform`);
          return;
        }

        await Sharing.shareAsync(newPath, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share your Travel Plan',
            UTI: 'com.adobe.pdf' // Add UTI for better iOS compatibility
        });
    } catch (error) {
        console.error("Error sharing PDF:", error);
        alert("Failed to share PDF. Please try again."); // User-friendly error
    }
  }, [plan]); // Dependency: re-create if plan changes

  // --- Render Logic ---

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-100 justify-center items-center">
        <ActivityIndicator size="large" color="#0284c7" />
        {/* Use translation keys if available */}
        <Text className="mt-4 text-gray-600">{t('common.loading', 'Loading...')}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    console.error("React Query Error:", error); // Log the actual error
    return (
      <SafeAreaView className="flex-1 bg-neutral-100 justify-center items-center p-4">
         {/* Use translation keys if available */}
        <Text className="text-red-500 mb-4 text-center">{t('errors.failedToLoad', 'Failed to load trip plan. Please try again.')}</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => navigation.goBack()}
        >
           {/* Use translation keys if available */}
          <Text className="text-white">{t('common.goBack', 'Go Back')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Check if plan data is available after loading and no error
  if (!plan) {
      return (
        <SafeAreaView className="flex-1 bg-neutral-100 justify-center items-center p-4">
            <Text className="text-gray-600 mb-4 text-center">Trip plan data is not available.</Text>
            <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => navigation.goBack()}
            >
            <Text className="text-white">{t('common.goBack', 'Go Back')}</Text>
            </TouchableOpacity>
        </SafeAreaView>
      );
  }

  // --- Main Render ---
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="bg-white flex-row items-center justify-between py-2 px-4 border-b border-neutral-200">
         {/* Header Left Buttons */}
         <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.backButton', 'Go Back')}
            >
                <Ionicons name="chevron-back" size={24} className="text-blue-600" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleHome}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.homeButton', 'Go Home')}
            >
                <Ionicons name="home-outline" size={24} className="text-blue-600" />
            </TouchableOpacity>
        </View>

        {/* Header Title (Centered) */}
        <View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center pointer-events-none">
          <Text className="text-lg font-semibold text-black">
            {/* Use translation keys if available */}
            {t('plan.title', 'Your Plan')}
          </Text>
        </View>

         {/* Header Right Buttons */}
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={handleShare}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.shareButton', 'Share Plan')}
          >
            <Ionicons name="share-outline" size={24} className="text-blue-600" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEditPlan}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.editButton', 'Edit Plan')}
          >
            <Ionicons name="pencil-outline" size={24} className="text-blue-600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-32" // Added pb-32 for padding below Next button
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Details */}
        {/* Add checks for plan and plan.details */}
        {plan?.details && (
            <View className="flex-row justify-center bg-white p-3 my-3 rounded-lg shadow-md">
            <View className="flex-col justify-between items-start">
                {plan.details.map((detail, index) => (
                <DetailItem key={`${index}-label`} label={detail.name} value={null} />
                ))}
            </View>
            <View className="flex-col justify-between items-center px-3">
                {plan.details.map((detail, index) => (
                <View key={`${index}-emoji`} className="p-2.5 items-center justify-center h-[44px]">
                    <Text className="text-base">{detailEmojis[detail.name] || ''}</Text>
                </View>
                ))}
            </View>
            <View className="flex-col justify-between items-start">
                {plan.details.map((detail, index) => (
                <DetailItem key={`${index}-value`} label={null} value={detail.value} />
                ))}
            </View>
            </View>
        )}


        {/* --- Dynamic Sections --- */}
        {/* Only render sections if data exists */}

        {plan?.visaRequirements && (
            <VisaRequirements
            visaData={plan.visaRequirements}
            isLoading={isLoadingVisa}
            error={visaError}
          />
        )}

        {/* Culture Insights Section */}
        {(isLoadingCulture || cultureError || plan?.cultureInsights) && (
          <CultureInsights
            cultureData={plan.cultureInsights} // Assuming culture data is fetched and stored similarly
            isLoading={isLoadingCulture}      // Need to add state for this
            error={cultureError}            // Need to add state for this
          />
        )}

        {/* Nearby Events Section */}
        {plan?.recommendations && (
            <TravelRecommendations
            recommendations={plan.recommendations}
            isLoading={false}
            error={null}
            />
        )}


        {plan?.nearbyEvents && (
            <NearbyEvents
            eventsData={plan.nearbyEvents}
            isLoading={false}
            error={null}
            />
        )}


        {/* Itinerary Days */}
        {/* Add check for plan.days */}
        {plan?.days?.map((day, index) => (
          <View key={index} className="mb-5">
             {/* Use translation keys if available */}
            <Text className="text-sm font-normal text-neutral-700 mb-1.5 ml-1">
              {t('plan.day', 'Day {{number}}', { number: day.day })}
            </Text>
            {/* Add check for day.activities */}
            {day.activities && (
                <View className="bg-cyan-500 rounded-lg overflow-hidden shadow-md">
                {day.activities.map((activity, idx) => (
                    <Accordion
                    key={idx}
                    title={
                        <ActivityItem time={activity.time} name={activity.name} />
                    }
                    >
                    {/* Accordion Content */}
                    {/* Add check for day.plan */}
                    {day.plan?.map((item, i) => (
                        <View
                        key={i}
                        className="flex-row gap-2 justify-between p-3 border-b border-neutral-200 last:border-b-0"
                        >
                        <Text className="text-neutral-500 w-16 pr-2 border-r border-neutral-300">
                            {item.time}
                        </Text>
                        <Text className="flex-1 text-neutral-800">
                            {item.event}
                        </Text>
                        </View>
                    ))}
                    </Accordion>
                ))}
                </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Next Button */}
      <View className="absolute bottom-0 left-0 right-0 p-5 pb-8 bg-transparent pointer-events-box">
          {/* Ensure button is pressable */}
          <TouchableOpacity
            className="bg-sky-500 py-4 px-5 rounded-lg shadow"
            onPress={handleNext}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.nextButton', 'Next Step')}
          >
            <Text className="text-white text-center text-base font-semibold">
                {/* Use translation keys if available */}
              {t('common.next', 'Next')}
            </Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Add default export
export default UserPlanScreen;