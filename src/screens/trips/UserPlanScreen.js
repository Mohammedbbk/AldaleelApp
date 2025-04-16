import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  // Image, // Image seems unused now
  ActivityIndicator, // Keep for potential future loading states
  // Animated, // Animated seems unused now
  Platform, // Keep for Platform checks
  StyleSheet, // Add StyleSheet
  Alert, // Use Alert for better error display
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AI_RESPONSE } from '../../config/AiResponse'; // Keep for fallback/comparison if needed

// Import components
import { VisaRequirements } from '../../components/trips/VisaRequirements';
import { CultureInsights } from '../../components/trips/CultureInsights';
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

// --- Helper Function for PDF Generation ---
// (generatePdfContent remains the same as you provided, including defensive checks)
function generatePdfContent(plan) {
    // Ensure plan and plan.details exist
    const details = plan?.details || [];
    const destination = details.find((d) => d.name === 'Destination')?.value || 'N/A';
    const duration = details.find((d) => d.name === 'Duration')?.value || 'N/A';
    const expenses = details.find((d) => d.name === 'Expenses')?.value || 'N/A';
    const days = Array.isArray(plan?.days) ? plan.days : []; // Ensure days is an array

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
          ${days.map((day) => {
            // Ensure day and its properties exist
            const dayNumber = day?.day || '?';
            const dayActivities = Array.isArray(day?.activities) ? day.activities : [];
            const dayPlan = Array.isArray(day?.plan) ? day.plan : [];
            const dayTitle = dayActivities[0]?.name || 'Activities'; // Use first activity name or default

            return `
              <div class="day-section">
                <h2>Day ${dayNumber}: ${dayTitle}</h2>
                ${dayPlan.map((item) => {
                  // Ensure item and its properties exist
                  const itemTime = item?.time || 'N/A';
                  const itemEvent = item?.event || 'No details';
                  return `
                    <div class="plan-item">
                      <span class="time">${itemTime}</span>
                      <span class="event">${itemEvent}</span>
                    </div>`;
                }).join('')}
              </div>`;
          }).join('')}
        </div>
      </body>
    </html>`;
    return htmlContent;
}


// --- Component ---
export function UserPlanScreen() {
  const { t } = useTranslation(); // Hook called at top level - OK
  const navigation = useNavigation(); // Hook called at top level - OK
  const route = useRoute(); // Hook called at top level - OK

  // State for features potentially loaded separately
  // You might fetch these using useQuery if they aren't part of tripData
  const [isLoadingCulture, setIsLoadingCulture] = useState(false);
  const [cultureError, setCultureError] = useState(null);
  const [isLoadingVisa, setIsLoadingVisa] = useState(false); // Added for consistency
  const [visaError, setVisaError] = useState(null); // Added for consistency


  // --- Process route params directly using useMemo ---
  // This replaces useQuery and usePlanData for transforming route params
  const plan = useMemo(() => { // Hook called at top level - OK
    const tripData = route.params?.tripData;

    // Handle case where tripData is missing entirely
    if (!tripData) {
      console.warn('UserPlanScreen: No tripData found in route params.');
      // Return a default structure or potentially the last known AI_RESPONSE as fallback
      return AI_RESPONSE.UserPlan || { details: [], days: [], visaRequirements: null, nearbyEvents: [], recommendations: {} };
    }

    console.log("UserPlanScreen received tripData:", tripData);

    // Base plan data structure from tripData
    const basePlan = {
      details: [
        // Use more robust checks for potentially missing fields in tripData
        { name: 'Destination', value: tripData.destinationCity || tripData.destination || 'N/A' },
        { name: 'Duration', value: tripData.month && tripData.year ? `${tripData.month} ${tripData.year}` : (tripData.duration ? `${tripData.duration} days` : 'N/A') },
        { name: 'Expenses', value: tripData.budgetLevel || tripData.budget || 'N/A' },
      ],
      days: [], // Default empty days, will be populated below
      visaRequirements: tripData.visaRequirements || null, // Default to null
      cultureInsights: tripData.cultureInsights || null, // Default to null
      nearbyEvents: Array.isArray(tripData.nearbyEvents) ? tripData.nearbyEvents : [], // Default to empty array
      // Ensure recommendations structure exists
      recommendations: {
        places: Array.isArray(tripData.recommendations?.places) ? tripData.recommendations.places : [],
        tips: Array.isArray(tripData.recommendations?.tips) ? tripData.recommendations.tips : [],
        culturalNotes: Array.isArray(tripData.recommendations?.culturalNotes) ? tripData.recommendations.culturalNotes : [],
        safetyTips: Array.isArray(tripData.recommendations?.safetyTips) ? tripData.recommendations.safetyTips : []
      }
    };

    // Handle AI generation failure case
    if (tripData.aiGenerationFailed) {
      console.log("AI Generation failed, using placeholder itinerary.");
      basePlan.days = [
        {
          day: 1,
          activities: [{ time: 'All day', name: 'Custom Itinerary Pending' }],
          plan: [{ time: 'Note', event: 'Your custom itinerary experienced an issue during generation. You can try editing or check back later.' }]
        }
      ];
    } else if (tripData.aiRecommendations) {
        // *** IMPORTANT: Use the actual AI data if generation succeeded ***
        // Assuming tripData.aiRecommendations has the same structure as AI_RESPONSE.UserPlan expected before
        // Make sure the structure from your /generate endpoint matches this expectation
        const aiPlanData = tripData.aiRecommendations;
        console.log("Using successful AI Recommendations:", aiPlanData);

        // Ensure aiPlanData and its nested properties exist and are arrays
        basePlan.days = Array.isArray(aiPlanData?.itinerary)
         ? aiPlanData.itinerary.map((day, index) => {
             const safeDay = day && typeof day === 'object' ? day : {};
             const activitiesArray = Array.isArray(safeDay.activities) ? safeDay.activities : [];
             return {
                day: index + 1, // Or use day.day if provided by AI
                activities: [{ // Adjust if AI provides different structure
                    time: safeDay.startTime || 'N/A',
                    name: safeDay.title || 'N/A'
                }],
                plan: activitiesArray.map(activity => {
                    const safeActivity = activity && typeof activity === 'object' ? activity : {};
                    return {
                        time: safeActivity.time || 'N/A',
                        event: safeActivity.description || 'N/A'
                    };
                })
            };
          })
         : []; // Default to empty array if aiPlanData.itinerary is not an array

         // Optionally merge/update details from aiPlanData if needed
         // basePlan.details = ... merge logic ...

    } else {
       console.log("No AI recommendations data found, showing empty itinerary.");
       // No AI data and not failed, keep days as empty array or show different placeholder
       basePlan.days = [
           {
             day: 1,
             activities: [{ time: 'N/A', name: 'No Itinerary Data' }],
             plan: [{ time: 'Note', event: 'No itinerary data was generated for this trip.' }]
           }
       ];
    }

    return basePlan;

  }, [route.params?.tripData]); // Depend on tripData object


  // --- Event Handlers ---
  // (Keep the same handlers: handleBack, handleHome, handleEditPlan, handleNext, handleShare)
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Home'); // Use actual home route name from App.js
  }, [navigation]);

  const handleHome = useCallback(() => navigation.navigate('Home'), [navigation]); // Use actual home route name
  const handleEditPlan = useCallback(() => navigation.navigate('AssistantScreen'), [navigation]); // Ensure route exists
  const handleNext = useCallback(() => navigation.navigate('InformationScreen'), [navigation]); // Ensure route exists

  const handleShare = useCallback(async () => {
     if (!plan) {
        Alert.alert("Error", "Plan data is not available to share.");
        return;
     };

    const htmlContent = generatePdfContent(plan);
    try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });

        const details = plan?.details || [];
        const destinationName = details.find(d => d.name === 'Destination')?.value || 'TravelPlan';
        const safeFilename = destinationName.replace(/[^a-zA-Z0-9]/g, '_');
        const newPath = `${FileSystem.documentDirectory}AlDaleel_${safeFilename}.pdf`;

        // Ensure directory exists (optional, usually handled by FileSystem)
        // await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory, { intermediates: true });

        await FileSystem.moveAsync({ from: uri, to: newPath });

        if (!(await Sharing.isAvailableAsync())) {
          Alert.alert("Sharing Error", "Sharing isn't available on this platform.");
          return;
        }

        await Sharing.shareAsync(newPath, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share your Travel Plan',
            UTI: 'com.adobe.pdf' // UTI for better iOS compatibility
        });
    } catch (error) {
        console.error("Error sharing PDF:", error);
        Alert.alert("Sharing Failed", "Failed to generate or share PDF. Please try again."); // User-friendly error
    }
  }, [plan]); // Dependency: re-create if plan changes

  // --- Render Logic ---

  // Removed the top-level isLoading/error check related to useQuery

  // Check if plan data (derived from route.params) is available.
  // This check happens after useMemo runs.
  if (!plan) {
      // This case might be hit if route.params.tripData was initially undefined
      // and the fallback in useMemo was also nullish.
      return (
        <SafeAreaView style={styles.centeredScreen}>
            <Text style={styles.errorText}>Trip plan data is not available.</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>{t('common.goBack', 'Go Back')}</Text>
            </TouchableOpacity>
        </SafeAreaView>
      );
  }

  // --- Main Render ---
  // Uses the 'plan' object derived directly from route.params via useMemo
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
         {/* Header Left Buttons */}
         <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={handleBack}
              hitSlop={styles.hitSlop} // Use defined hitSlop
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.backButton', 'Go Back')}
            >
                <Ionicons name="chevron-back" size={24} style={styles.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleHome}
              hitSlop={styles.hitSlop}
              accessibilityRole="button"
              accessibilityLabel={t('accessibility.homeButton', 'Go Home')}
            >
                <Ionicons name="home-outline" size={24} style={styles.iconColor} />
            </TouchableOpacity>
        </View>

        {/* Header Title (Centered) */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {t('plan.title', 'Your Plan')}
          </Text>
        </View>

         {/* Header Right Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleShare}
            hitSlop={styles.hitSlop}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.shareButton', 'Share Plan')}
          >
            <Ionicons name="share-outline" size={24} style={styles.iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleEditPlan}
            hitSlop={styles.hitSlop}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.editButton', 'Edit Plan')}
          >
            <Ionicons name="pencil-outline" size={24} style={styles.iconColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Details */}
        <View style={styles.detailsContainer}>
            <View style={styles.detailsColumn}>
                {plan.details.map((detail, index) => (
                  <DetailItem key={`${index}-label`} label={detail.name} value={null} />
                ))}
            </View>
            <View style={styles.detailsEmojiColumn}>
                {plan.details.map((detail, index) => (
                  <View key={`${index}-emoji`} style={styles.emojiWrapper}>
                      <Text style={styles.emojiText}>{detailEmojis[detail.name] || ''}</Text>
                  </View>
                ))}
            </View>
            <View style={styles.detailsColumn}>
                {plan.details.map((detail, index) => (
                  <DetailItem key={`${index}-value`} label={null} value={detail.value} />
                ))}
            </View>
        </View>


        {/* --- Dynamic Sections --- */}
        {/* Only render sections if data exists */}

        {/* Render VisaRequirements if data is available */}
        {plan.visaRequirements != null && (
            <VisaRequirements
              visaData={plan.visaRequirements}
              isLoading={isLoadingVisa} // Use state if fetched separately
              error={visaError} // Use state if fetched separately
            />
        )}

        {/* Render CultureInsights if data is available */}
        {plan.cultureInsights != null && (
            <CultureInsights
              cultureData={plan.cultureInsights}
              isLoading={isLoadingCulture} // Use state if fetched separately
              error={cultureError} // Use state if fetched separately
            />
        )}

         {/* Render TravelRecommendations if data is available */}
         {plan.recommendations && (plan.recommendations.places?.length > 0 || plan.recommendations.tips?.length > 0 || plan.recommendations.culturalNotes?.length > 0 || plan.recommendations.safetyTips?.length > 0) && (
            <TravelRecommendations
              recommendations={plan.recommendations}
              // Assuming recommendations data loading is part of the main plan data now
              isLoading={false}
              error={null}
            />
        )}

        {/* Render NearbyEvents if data is available */}
        {plan.nearbyEvents?.length > 0 && (
            <NearbyEvents
              eventsData={plan.nearbyEvents}
               // Assuming events data loading is part of the main plan data now
              isLoading={false}
              error={null}
            />
        )}


        {/* Itinerary Days */}
        {/* Map over plan.days (which is guaranteed to be an array by useMemo) */}
        {plan.days.map((day, index) => (
          <View key={`day-${index}`} style={styles.dayContainer}>
            <Text style={styles.dayLabel}>
              {t('plan.day', 'Day {{number}}', { number: day.day })}
            </Text>
            {/* Ensure day.activities is an array before mapping */}
            {(Array.isArray(day.activities) && day.activities.length > 0) ? (
                <View style={styles.activitiesContainer}>
                {day.activities.map((activity, idx) => (
                    <Accordion
                      key={`activity-${idx}`}
                      title={<ActivityItem time={activity.time} name={activity.name} />}
                    >
                      {/* Accordion Content: Map over day.plan */}
                      {(Array.isArray(day.plan) && day.plan.length > 0) ? (
                         day.plan.map((item, i) => (
                            <View key={`plan-${i}`} style={styles.planItem}>
                              <Text style={styles.planTime}>{item.time}</Text>
                              <Text style={styles.planEvent}>{item.event}</Text>
                            </View>
                          ))
                        ) : (
                           <Text style={styles.noPlanText}>No detailed plan for this activity.</Text>
                        )
                      }
                    </Accordion>
                ))}
                </View>
              ) : (
                 <Text style={styles.noActivityText}>No activities scheduled for this day.</Text>
              )
            }
          </View>
        ))}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.nextButton', 'Next Step')}
          >
            <Text style={styles.nextButtonText}>
              {t('common.next', 'Next')}
            </Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Styles --- (Using StyleSheet for better organization)
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F4F5' }, // bg-neutral-100
    centeredScreen: { flex: 1, backgroundColor: '#F4F4F5', justifyContent: 'center', alignItems: 'center', padding: 16 },
    errorText: { color: '#EF4444', marginBottom: 16, textAlign: 'center' }, // text-red-500 mb-4 text-center
    backButton: { backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }, // bg-blue-500 px-4 py-2 rounded-lg
    backButtonText: { color: '#FFFFFF' }, // text-white
    header: { backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }, // bg-white flex-row items-center justify-between py-2 px-4 border-b border-neutral-200
    headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 16 }, // flex-row items-center gap-4
    iconColor: { color: '#2563EB'}, // text-blue-600 (Applied via style prop)
    headerTitleContainer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#000000' }, // text-lg font-semibold text-black
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
    scrollView: { flex: 1 },
    scrollViewContent: { padding: 16, paddingBottom: 96 }, // p-4 pb-32 (Adjust paddingBottom as needed)
    detailsContainer: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', padding: 12, marginVertical: 12, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 }, // flex-row justify-center bg-white p-3 my-3 rounded-lg shadow-md
    detailsColumn: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' },
    detailsEmojiColumn: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 },
    emojiWrapper: { padding: 10, alignItems: 'center', justifyContent: 'center', height: 44 }, // p-2.5 items-center justify-center h-[44px] (Approximation)
    emojiText: { fontSize: 16 }, // text-base
    dayContainer: { marginBottom: 20 }, // mb-5
    dayLabel: { fontSize: 14, fontWeight: '400', color: '#3F3F46', marginBottom: 6, marginLeft: 4 }, // text-sm font-normal text-neutral-700 mb-1.5 ml-1
    activitiesContainer: { backgroundColor: '#06B6D4', borderRadius: 8, overflow: 'hidden', shadowColor: "#000", shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 }, // bg-cyan-500 rounded-lg overflow-hidden shadow-md
    planItem: { flexDirection: 'row', gap: 8, justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }, // flex-row gap-2 justify-between p-3 border-b border-neutral-200 last:border-b-0
    planTime: { color: '#71717A', width: 64, paddingRight: 8, borderRightWidth: 1, borderRightColor: '#D4D4D8' }, // text-neutral-500 w-16 pr-2 border-r border-neutral-300
    planEvent: { flex: 1, color: '#27272A' }, // flex-1 text-neutral-800
    noPlanText: { padding: 12, color: '#71717A', fontStyle: 'italic' },
    noActivityText: { padding: 12, color: '#71717A', fontStyle: 'italic', textAlign: 'center' },
    nextButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 32, backgroundColor: 'transparent', pointerEvents: 'box-none' }, // absolute bottom-0 left-0 right-0 p-5 pb-8 bg-transparent pointer-events-box
    nextButton: { backgroundColor: '#0EA5E9', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 }, // bg-sky-500 py-4 px-5 rounded-lg shadow
    nextButtonText: { color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontWeight: '600' }, // text-white text-center text-base font-semibold
});


// Default export for the screen
export default UserPlanScreen;