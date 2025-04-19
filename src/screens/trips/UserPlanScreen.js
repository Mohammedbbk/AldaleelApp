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
  Linking, // Import Linking for URLs
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
import { DetailItem } from '../../components/shared/DetailItem';
import { ActivityItem } from '../../components/shared/ActivityItem';
import { Accordion } from '../../components/shared/Accordion';

// --- Static Content / Maps ---
const detailEmojis = {
  Destination: '✈️',
  Duration: '⏳',
  Expenses: '💵',
};

const sectionIcons = {
    currencyInfo: 'cash-outline',
    healthAndSafety: 'medkit-outline',
    transportation: 'car-sport-outline',
    languageBasics: 'language-outline',
    weatherInfo: 'partly-sunny-outline',
    localCustoms: 'earth-outline', // Reuse for consistency if needed elsewhere
    visaRequirements: 'document-text-outline', // Reuse for consistency
    nearbyEvents: 'calendar-outline',
    dailyItinerary: 'map-outline',
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
          /* Add styles for new sections */
          .section-block { margin-bottom: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 5px solid #6A0DAD; } /* Example purple accent */
          .section-block h2 { font-size: 20px; color: #333; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .section-block p, .section-block li { color: #555; line-height: 1.6; }
          .section-block ul { padding-left: 20px; list-style-type: disc; }
          .section-block .key-value { margin-bottom: 10px; }
          .section-block .key-value strong { color: #007aff; margin-right: 5px; }
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

          <!-- Visa Requirements -->
          ${plan.visaRequirements ? `
            <div class="section-block">
              <h2>Visa Requirements</h2>
              <p>${typeof plan.visaRequirements === 'string' ? plan.visaRequirements : (plan.visaRequirements.content || plan.visaRequirements.notes || 'See app for details')}</p>
            </div>
          ` : ''}

          <!-- Culture Insights -->
          ${plan.cultureInsights ? `
            <div class="section-block">
              <h2>Culture Insights</h2>
              <p>${typeof plan.cultureInsights === 'string' ? plan.cultureInsights : (plan.cultureInsights.content || 'See app for details')}</p>
            </div>
          ` : ''}

          <!-- Currency Info -->
          ${plan.currencyInfo ? `
            <div class="section-block">
              <h2>Currency & Payments</h2>
              ${plan.currencyInfo.currency ? `<div class="key-value"><strong>Currency:</strong> ${plan.currencyInfo.currency}</div>` : ''}
              ${plan.currencyInfo.exchangeRate ? `<div class="key-value"><strong>Exchange Rate:</strong> ${plan.currencyInfo.exchangeRate}</div>` : ''}
              ${plan.currencyInfo.paymentMethods ? `<div class="key-value"><strong>Payment Methods:</strong> ${plan.currencyInfo.paymentMethods}</div>` : ''}
              ${plan.currencyInfo.tipping ? `<div class="key-value"><strong>Tipping:</strong> ${plan.currencyInfo.tipping}</div>` : ''}
            </div>
          ` : ''}

          <!-- Health & Safety -->
          ${plan.healthAndSafety ? `
            <div class="section-block">
              <h2>Health & Safety</h2>
              ${plan.healthAndSafety.vaccinations ? `<div class="key-value"><strong>Vaccinations:</strong> ${plan.healthAndSafety.vaccinations}</div>` : ''}
              ${plan.healthAndSafety.precautions ? `<p><strong>Precautions:</strong> ${plan.healthAndSafety.precautions}</p>` : ''}
              ${Array.isArray(plan.healthAndSafety.safetyTips) ? `<h3>Safety Tips:</h3><ul>${plan.healthAndSafety.safetyTips.map(tip => `<li>${tip}</li>`).join('')}</ul>` : ''}
              ${plan.healthAndSafety.emergencyContacts ? `<h3>Emergency Contacts:</h3><ul>${Object.entries(plan.healthAndSafety.emergencyContacts).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}</ul>` : ''}
            </div>
          ` : ''}

          <!-- Transportation -->
          ${plan.transportation ? `
            <div class="section-block">
              <h2>Transportation</h2>
              ${plan.transportation.gettingAround ? `<p>${plan.transportation.gettingAround}</p>` : ''}
              ${Array.isArray(plan.transportation.options) ? `<h3>Options:</h3><ul>${plan.transportation.options.map(opt => `<li>${opt}</li>`).join('')}</ul>` : ''}
            </div>
          ` : ''}

          <!-- Language Basics -->
          ${plan.languageBasics ? `
            <div class="section-block">
              <h2>Language Basics</h2>
              ${plan.languageBasics.officialLanguage ? `<div class="key-value"><strong>Official Language:</strong> ${plan.languageBasics.officialLanguage}</div>` : ''}
              ${Array.isArray(plan.languageBasics.phrases) ? `<h3>Common Phrases:</h3><ul>${plan.languageBasics.phrases.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
              ${plan.languageBasics.communicationTips ? `<p><strong>Tips:</strong> ${plan.languageBasics.communicationTips}</p>` : ''}
            </div>
          ` : ''}

           <!-- Weather Info -->
          ${plan.weatherInfo ? `
            <div class="section-block">
                <h2>Weather Info</h2>
                ${plan.weatherInfo.climate ? `<div class="key-value"><strong>Climate:</strong> ${plan.weatherInfo.climate}</div>` : ''}
                ${plan.weatherInfo.packingTips ? `<p><strong>Packing Tips:</strong> ${plan.weatherInfo.packingTips}</p>` : ''}
            </div>
          ` : ''}

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

    // 1) Try to parse the AI JSON (string inside additionalInfo)
    let ai = null;
    const raw = tripData.aiRecommendations?.additionalInfo;
    if (raw && typeof raw === 'string') {
      try {
        ai = JSON.parse(raw);
        console.log('[UserPlanScreen] Successfully PARSED ai object:', JSON.stringify(ai, null, 2));
        console.log('[UserPlanScreen] Parsed dailyItinerary:', JSON.stringify(ai.dailyItinerary, null, 2));
        console.log('[UserPlanScreen] Parsed currencyInfo:', JSON.stringify(ai.currencyInfo ?? ai.currency ?? null, null, 2));
      } catch (err) {
        console.warn('[UserPlanScreen] FAILED to parse AI recommendations JSON:', err);
        console.error('[UserPlanScreen] Raw additionalInfo JSON:', raw);
      }
    } else if (tripData.aiRecommendations?.additionalInfo) {
      ai = tripData.aiRecommendations.additionalInfo;
      console.log('[UserPlanScreen] aiRecommendations.additionalInfo is already an object:', JSON.stringify(ai, null, 2));
    }
    if (!ai) {
      console.error('[UserPlanScreen] FAILED to parse or find AI data.');
    }
    if (ai) {
      console.log('[UserPlanScreen] AI object keys:', Object.keys(ai));
    } else {
      console.error('[UserPlanScreen] AI object is null or undefined after parsing.');
    }

    // 2) Build base details
    const details = [
      {
        name: 'Destination',
        value: tripData.destinationCity || tripData.destination || 'N/A',
      },
      {
        name: 'Duration',
        value: tripData.duration ? `${tripData.duration} days` : 'N/A',
      },
      {
        name: 'Expenses',
        value: tripData.budgetLevel || tripData.budget || 'N/A',
      },
    ];

    // 3) AI-provided Visa and Culture Insights
    const visaRequirements = ai?.visaRequirements ?? tripData.visaRequirements ?? null;
    console.log('[UserPlanScreen] Parsed visaRequirements:', JSON.stringify(visaRequirements, null, 2));
    const cultureInsights = ai?.cultureInsights ?? tripData.cultureInsights ?? null;
    console.log('[UserPlanScreen] Parsed cultureInsights:', JSON.stringify(cultureInsights, null, 2));

    // 4) Normalize itinerary into days array
    // Ensure the structure matches what the render logic expects:
    // [{ day: N, activities: [{ time: T, name: E, plan: [] }] }]
    const rawItinerary = ai?.dailyItinerary ?? ai?.itinerary ?? [];
    // Handle multiple itinerary structures: flat list (Structure B) or nested segments per day (Structure A)
    let days = [];
    if (Array.isArray(rawItinerary) && rawItinerary.length > 0 && typeof rawItinerary[0]?.activities === 'string') {
      // Flat activity list (Structure B)
      const flatActivities = rawItinerary.map((item, idx) => {
        const { timing, activities, estimatedCosts, estimatedCost, transportationOptions, mealRecommendations, ...otherDetails } = item;
        return {
          time: timing || 'N/A',
          name: activities || 'Unnamed Event',
          estimatedCosts: estimatedCosts ?? estimatedCost,
          transportationOptions,
          mealRecommendations,
          ...otherDetails,
          plan: [],
        };
      });
      console.log('[UserPlanScreen] Detected flat dailyItinerary structure. Mapped activities:', JSON.stringify(flatActivities, null, 2));
      days = [{ day: 1, activities: flatActivities }];
    } else if (Array.isArray(rawItinerary)) {
      // Nested by day segments (Structure A)
      days = rawItinerary.map((dayObj, idx) => {
        const dayNumber = dayObj.day ?? idx + 1;
        const dayActivities = [];
        ['morning', 'afternoon', 'evening'].forEach(period => {
          const segment = dayObj.activities?.[period];
          if (segment && typeof segment.activity === 'string' && segment.activity.trim() !== '') {
            const { timing, activity, ...otherDetails } = segment;
            dayActivities.push({
              time: timing || 'N/A',
              name: activity,
              ...otherDetails,
              plan: [],
            });
          }
        });
        // Fallback to flat plan for this day
        if (dayActivities.length === 0 && Array.isArray(dayObj.plan)) {
          dayObj.plan.forEach(item => {
            dayActivities.push({
              time: item.time ?? 'N/A',
              name: item.event ?? 'Unnamed Event',
              plan: [],
            });
          });
        }
        console.log(`[UserPlanScreen] Day ${dayNumber} mapped activities:`, JSON.stringify(dayActivities, null, 2));
        return { day: dayNumber, activities: dayActivities };
      });
      console.log('[UserPlanScreen] Mapped nested days structure:', JSON.stringify(days, null, 2));
    } else {
      days = [];
    }

    // 5) Other AI sections simplified (using direct keys from parsed 'ai' object)
    const currencyInfo = ai?.currencyInfo ?? null; // Prefer primary key
    console.log('[UserPlanScreen] Parsed currencyInfo:', JSON.stringify(currencyInfo, null, 2));
    const healthAndSafety = ai?.healthAndSafety ?? null;
    console.log('[UserPlanScreen] Parsed healthAndSafety:', JSON.stringify(healthAndSafety, null, 2));
    const transportation = ai?.transportation ?? null;
    console.log('[UserPlanScreen] Parsed transportation:', JSON.stringify(transportation, null, 2));
    const languageBasics = ai?.languageBasics ?? null;
    console.log('[UserPlanScreen] Parsed languageBasics:', JSON.stringify(languageBasics, null, 2));
    const weatherInfo = ai?.weatherInfo ?? null;
    console.log('[UserPlanScreen] Parsed weatherInfo:', JSON.stringify(weatherInfo, null, 2));

    // 6) Nearby events (from tripData)
    const nearbyEvents = Array.isArray(tripData.nearbyEvents) ? tripData.nearbyEvents : [];
    console.log('[UserPlanScreen] Parsed nearbyEvents:', JSON.stringify(nearbyEvents, null, 2));

    // Build final plan object
    const finalPlan = {
      details,
      visaRequirements,
      cultureInsights,
      days,
      currencyInfo,
      healthAndSafety,
      transportation,
      languageBasics,
      weatherInfo,
      nearbyEvents,
    };
    console.log('[UserPlanScreen] FINAL plan object being returned:', JSON.stringify(finalPlan, null, 2));
    return finalPlan;

  }, [route.params?.tripData]); // Depend on tripData object


  // --- Event Handlers ---
  // (Keep the same handlers: handleBack, handleHome, handleEditPlan, handleNext, handleShare)
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Home'); // Use actual home route name from App.js
  }, [navigation]);

  const handleHome = useCallback(() => navigation.navigate('Home'), [navigation]); // Use actual home route name
  const handleEditPlan = useCallback(() => navigation.navigate('AssistantScreen'), [navigation]); // Ensure route exists
  const handleNext = useCallback(() => {
    const tripData = route.params?.tripData;
    navigation.navigate('InformationScreen', {
        nationality: tripData?.nationality, // Pass nationality
        destination: tripData?.destination || plan?.details?.find(d => d.name === 'Destination')?.value // Pass destination
    });
  }, [navigation, route.params?.tripData, plan?.details]); // Add dependencies

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

        {/* Render NearbyEvents if data is available */}
        {console.log('[UserPlanScreen] Rendering NearbyEvents with data:', plan.nearbyEvents)}
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
        {plan.days.map((day, index) => {
          console.log('[UserPlanScreen] Rendering Day:', JSON.stringify(day, null, 2));
          return (
            <View key={`day-${index}`} style={styles.dayContainer}>
              <Text style={styles.dayLabel}>
                {t('plan.day', 'Day {{number}}', { number: day.day })}
              </Text>
              {(Array.isArray(day.activities) && day.activities.length > 0) ? (
                <View style={styles.activitiesContainer}>
                  {day.activities.map((activity, idx) => (
                    <Accordion
                      key={`activity-${idx}`}
                      title={<ActivityItem time={activity.time} name={activity.name} />}
                    >
                      {/* Render activity details directly from the activity object */}
                      <View style={styles.accordionContent}> {/* Add a container with padding */}
                        {
                          (activity.estimatedCosts || activity.transportationOptions || activity.mealRecommendations || activity.accommodationSuggestions) ? (
                            <>
                              {activity.estimatedCosts && (
                                <Text style={styles.detailText}>
                                  <Text style={styles.detailLabel}>Costs: </Text>{activity.estimatedCosts}
                                </Text>
                              )}
                              {activity.transportationOptions && (
                                <Text style={styles.detailText}>
                                  <Text style={styles.detailLabel}>Transport: </Text>{activity.transportationOptions}
                                </Text>
                              )}
                              {activity.mealRecommendations && (
                                <Text style={styles.detailText}>
                                  <Text style={styles.detailLabel}>Meals: </Text>{activity.mealRecommendations}
                                </Text>
                              )}
                              {activity.accommodationSuggestions && (
                                <Text style={styles.detailText}>
                                  <Text style={styles.detailLabel}>Accommodation: </Text>{activity.accommodationSuggestions}
                                </Text>
                              )}
                              {/* Optionally render other ...otherDetails fields here */}
                            </>
                          ) : (
                            <Text style={styles.noPlanText}>No specific details available.</Text>
                          )
                        }
                      </View>
                    </Accordion>
                  ))}
                </View>
              ) : (
                <Text style={styles.noActivityText}>No activities scheduled for this day.</Text>
              )}
            </View>
          );
        })}
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
    planItem: { flexDirection: 'row', gap: 8, justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#E5E5E5' }, // flex-row gap-2 justify-between p-3 border-b border-neutral-200
    planTime: { color: '#71717A', width: 64, paddingRight: 8, borderRightWidth: 1, borderRightColor: '#D4D4D8' }, // text-neutral-500 w-16 pr-2 border-r border-neutral-300
    planEvent: { flex: 1, color: '#27272A' }, // flex-1 text-neutral-800
    noPlanText: { padding: 12, color: '#71717A', fontStyle: 'italic' },
    noActivityText: { padding: 12, color: '#71717A', fontStyle: 'italic', textAlign: 'center' },
    nextButtonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 32, backgroundColor: 'transparent', pointerEvents: 'box-none' }, // absolute bottom-0 left-0 right-0 p-5 pb-8 bg-transparent pointer-events-box
    // Styles for Accordion Content
    accordionContent: { padding: 12, backgroundColor: '#FFFFFF' }, // bg-white for contrast inside accordion
    detailText: { color: '#3F3F46', marginBottom: 4 }, // text-neutral-700
    detailLabel: { fontWeight: '600' }, // font-semibold
    nextButton: { backgroundColor: '#0EA5E9', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1, }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 }, // bg-sky-500 py-4 px-5 rounded-lg shadow
    nextButtonText: { color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontWeight: '600' }, // text-white text-center text-base font-semibold
});


// Default export for the screen
export default UserPlanScreen;