import React, { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator, // Keep for potential future loading states
  // Animated, // Animated seems unused now
  Platform, // Keep for Platform checks
  StyleSheet, // Add StyleSheet
  Alert, // Use Alert for better error display
  Linking, // Import Linking for URLs
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { AI_RESPONSE } from "../../config/AiResponse"; // Keep for fallback/comparison if needed

// Import components
import { VisaRequirements } from "../../components/trips/VisaRequirements";
import { CultureInsights } from "../../components/trips/CultureInsights";
import { NearbyEvents } from "../../components/trips/NearbyEvents";
import { DetailItem } from "../../components/shared/DetailItem";
import { ActivityItem } from "../../components/shared/ActivityItem";
import { Accordion } from "../../components/shared/Accordion";
import { TravelRecommendations } from "../../components/trips/TravelRecommendations";

// --- Static Content / Maps ---
const detailEmojis = {
  Destination: "✈️",
  Duration: "⏳",
  Expenses: "💵",
};

const sectionIcons = {
  currencyInfo: "cash-outline",
  healthAndSafety: "medkit-outline",
  transportation: "car-sport-outline",
  languageBasics: "language-outline",
  weatherInfo: "partly-sunny-outline",
  localCustoms: "earth-outline", // Reuse for consistency if needed elsewhere
  visaRequirements: "document-text-outline", // Reuse for consistency
  nearbyEvents: "calendar-outline",
  dailyItinerary: "map-outline",
};

// --- Helper Function for PDF Generation ---
function generatePdfContent(plan) {
  // Ensure plan and plan.details exist
  const details = plan?.details || [];
  const destination =
    details.find((d) => d.name === "Destination")?.value || "N/A";
  const duration = details.find((d) => d.name === "Duration")?.value || "N/A";
  const expenses = details.find((d) => d.name === "Expenses")?.value || "N/A";
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
          ${days
            .map((day) => {
              // Ensure day and its properties exist
              const dayNumber = day?.day || "?";
              const dayActivities = Array.isArray(day?.activities)
                ? day.activities
                : [];
              const dayPlan = Array.isArray(day?.plan) ? day.plan : [];
              const dayTitle = dayActivities[0]?.name || "Activities"; // Use first activity name or default

              return `
              <div class="day-section">
                <h2>Day ${dayNumber}: ${dayTitle}</h2>
                ${dayPlan
                  .map((item) => {
                    // Ensure item and its properties exist
                    const itemTime = item?.time || "N/A";
                    const itemEvent = item?.event || "No details";
                    return `
                    <div class="plan-item">
                      <span class="time">${itemTime}</span>
                      <span class="event">${itemEvent}</span>
                    </div>`;
                  })
                  .join("")}
              </div>`;
            })
            .join("")}

          <!-- Visa Requirements -->
          ${
            plan.visaRequirements
              ? `
            <div class="section-block">
              <h2>Visa Requirements</h2>
              <p>${
                typeof plan.visaRequirements === "string"
                  ? plan.visaRequirements
                  : plan.visaRequirements.content ||
                    plan.visaRequirements.notes ||
                    "See app for details"
              }</p>
            </div>
          `
              : ""
          }

          <!-- Culture Insights -->
          ${
            plan.cultureInsights
              ? `
            <div class="section-block">
              <h2>Culture Insights</h2>
              <p>${
                typeof plan.cultureInsights === "string"
                  ? plan.cultureInsights
                  : plan.cultureInsights.content || "See app for details"
              }</p>
            </div>
          `
              : ""
          }

          <!-- Currency Info -->
          ${
            plan.currencyInfo
              ? `
            <div class="section-block">
              <h2>Currency & Payments</h2>
              ${
                plan.currencyInfo.currency
                  ? `<div class="key-value"><strong>Currency:</strong> ${plan.currencyInfo.currency}</div>`
                  : ""
              }
              ${
                plan.currencyInfo.exchangeRate
                  ? `<div class="key-value"><strong>Exchange Rate:</strong> ${plan.currencyInfo.exchangeRate}</div>`
                  : ""
              }
              ${
                plan.currencyInfo.paymentMethods
                  ? `<div class="key-value"><strong>Payment Methods:</strong> ${plan.currencyInfo.paymentMethods}</div>`
                  : ""
              }
              ${
                plan.currencyInfo.tipping
                  ? `<div class="key-value"><strong>Tipping:</strong> ${plan.currencyInfo.tipping}</div>`
                  : ""
              }
            </div>
          `
              : ""
          }

          <!-- Health & Safety -->
          ${
            plan.healthAndSafety
              ? `
            <div class="section-block">
              <h2>Health & Safety</h2>
              ${
                plan.healthAndSafety.vaccinations
                  ? `<div class="key-value"><strong>Vaccinations:</strong> ${plan.healthAndSafety.vaccinations}</div>`
                  : ""
              }
              ${
                plan.healthAndSafety.precautions
                  ? `<p><strong>Precautions:</strong> ${plan.healthAndSafety.precautions}</p>`
                  : ""
              }
              ${
                Array.isArray(plan.healthAndSafety.safetyTips)
                  ? `<h3>Safety Tips:</h3><ul>${plan.healthAndSafety.safetyTips
                      .map((tip) => `<li>${tip}</li>`)
                      .join("")}</ul>`
                  : ""
              }
              ${
                plan.healthAndSafety.emergencyContacts
                  ? `<h3>Emergency Contacts:</h3><ul>${Object.entries(
                      plan.healthAndSafety.emergencyContacts
                    )
                      .map(
                        ([key, value]) =>
                          `<li><strong>${key}:</strong> ${value}</li>`
                      )
                      .join("")}</ul>`
                  : ""
              }
            </div>
          `
              : ""
          }

          <!-- Transportation -->
          ${
            plan.transportation
              ? `
            <div class="section-block">
              <h2>Transportation</h2>
              ${
                plan.transportation.gettingAround
                  ? `<p>${plan.transportation.gettingAround}</p>`
                  : ""
              }
              ${
                Array.isArray(plan.transportation.options)
                  ? `<h3>Options:</h3><ul>${plan.transportation.options
                      .map((opt) => `<li>${opt}</li>`)
                      .join("")}</ul>`
                  : ""
              }
            </div>
          `
              : ""
          }

          <!-- Language Basics -->
          ${
            plan.languageBasics
              ? `
            <div class="section-block">
              <h2>Language Basics</h2>
              ${
                plan.languageBasics.officialLanguage
                  ? `<div class="key-value"><strong>Official Language:</strong> ${plan.languageBasics.officialLanguage}</div>`
                  : ""
              }
              ${
                Array.isArray(plan.languageBasics.phrases)
                  ? `<h3>Common Phrases:</h3><ul>${plan.languageBasics.phrases
                      .map((p) => `<li>${p}</li>`)
                      .join("")}</ul>`
                  : ""
              }
              ${
                plan.languageBasics.communicationTips
                  ? `<p><strong>Tips:</strong> ${plan.languageBasics.communicationTips}</p>`
                  : ""
              }
            </div>
          `
              : ""
          }

           <!-- Weather Info -->
          ${
            plan.weatherInfo
              ? `
            <div class="section-block">
                <h2>Weather Info</h2>
                ${
                  plan.weatherInfo.climate
                    ? `<div class="key-value"><strong>Climate:</strong> ${plan.weatherInfo.climate}</div>`
                    : ""
                }
                ${
                  plan.weatherInfo.packingTips
                    ? `<p><strong>Packing Tips:</strong> ${plan.weatherInfo.packingTips}</p>`
                    : ""
                }
            </div>
          `
              : ""
          }

        </div>
      </body>
    </html>`;
  return htmlContent;
}

// --- Component ---
export function UserPlanScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  // State for features potentially loaded separately (if needed in future)
  // const [isLoadingCulture, setIsLoadingCulture] = useState(false);
  // const [cultureError, setCultureError] = useState(null);
  // const [isLoadingVisa, setIsLoadingVisa] = useState(false);
  // const [visaError, setVisaError] = useState(null);

  // --- Process route params using useMemo for efficiency ---
  const plan = useMemo(() => {
    const tripData = route.params?.tripData;

    // Handle case where tripData is missing entirely
    if (!tripData) {
      console.warn("UserPlanScreen: No tripData found in route params.");
      // Return a default empty structure
      return {
        details: [],
        days: [],
        visaRequirements: null,
        cultureInsights: null,
        currencyInfo: null,
        healthAndSafety: null,
        transportation: null,
        languageBasics: null,
        weatherInfo: null,
        nearbyEvents: [],
      };
    }

    console.log("UserPlanScreen received tripData:", tripData);

    // --- Prioritize pre-processed data if available ---
    if (tripData.dataProcessed) {
      console.log("[UserPlanScreen] Using pre-processed data from TripDetailsScreen");
      
      const details = [
        { name: "Destination", value: tripData.destination || "N/A" },
        { name: "Duration", value: tripData.duration ? `${tripData.duration} days` : "N/A" },
        { name: "Expenses", value: tripData.budgetLevel || tripData.budget || "N/A" },
      ];
      
      return {
        // Basic trip info
        tripId: tripData.tripId,
        destination: tripData.destination,
        nationality: tripData.nationality, // Needed for subsequent API calls like visa
        details: details,
        
        // Directly use the processed data passed in props
        days: tripData.days || [], // Ensure it's an array
        visaRequirements: tripData.visaRequirements,
        cultureInsights: tripData.cultureInsights,
        currencyInfo: tripData.currencyInfo,
        healthAndSafety: tripData.healthAndSafety,
        transportation: tripData.transportation,
        languageBasics: tripData.languageBasics,
        weatherInfo: tripData.weatherInfo,
        nearbyEvents: tripData.nearbyEvents || [], // Ensure it's an array
      };
    }
    
    // --- Fallback: Process data if not pre-processed (less ideal) ---
    console.warn("[UserPlanScreen] Data not pre-processed, attempting fallback parsing.");
    
    // 1) Parse AI recommendations if they exist
    let ai = null;
    const rawAiInfo = tripData.aiRecommendations?.additionalInfo;
    if (rawAiInfo && typeof rawAiInfo === 'string') {
      try {
        ai = JSON.parse(rawAiInfo);
        console.log("[UserPlanScreen] Fallback: Successfully PARSED ai object:", JSON.stringify(ai, null, 2));
      } catch (err) {
        console.error("[UserPlanScreen] Fallback: FAILED to parse AI recommendations JSON:", err);
        console.error("[UserPlanScreen] Raw additionalInfo JSON:", rawAiInfo);
      }
    } else if (tripData.aiRecommendations?.additionalInfo) {
      ai = tripData.aiRecommendations.additionalInfo;
      console.log("[UserPlanScreen] Fallback: aiRecommendations.additionalInfo is already an object:", JSON.stringify(ai, null, 2));
    }
    
    // 2) Build base details
    const details = [
      { name: "Destination", value: tripData.destination || "N/A" },
      { name: "Duration", value: tripData.duration ? `${tripData.duration} days` : "N/A" },
      { name: "Expenses", value: tripData.budgetLevel || tripData.budget || "N/A" },
    ];
    
    // 3) Extract itinerary (minimal transformation)
    let days = [];
    if (ai?.dailyItinerary && Array.isArray(ai.dailyItinerary)) {
      days = ai.dailyItinerary.map((daySource, index) => ({ 
        ...daySource, // Keep original structure
        day: daySource.day || (index + 1), // Ensure day number exists
        title: `Day ${daySource.day || (index + 1)}` // Add title for consistency
      }));
    } else if (tripData.itinerary && Array.isArray(tripData.itinerary)) {
      // Use itinerary array directly if dailyItinerary isn't found
      days = tripData.itinerary;
    } else {
       // Create placeholder if no itinerary data
      const duration = tripData.duration || 1;
      for (let i = 1; i <= duration; i++) {
        days.push({ day: i, title: `Day ${i}`, activities: [], morning: null, afternoon: null, evening: null });
      }
    }
    console.log("[UserPlanScreen] Fallback: Processed days:", JSON.stringify(days, null, 2));

    // 4) Extract other sections
    return {
      tripId: tripData.tripId,
      destination: tripData.destination,
      nationality: tripData.nationality,
      details: details,
      days: days,
      visaRequirements: ai?.visaRequirements || tripData.visaRequirements || null,
      cultureInsights: ai?.localCustoms || ai?.cultureInsights || tripData.cultureInsights || null,
      currencyInfo: ai?.currencyInfo || tripData.currencyInfo || null,
      healthAndSafety: ai?.healthAndSafety || tripData.healthAndSafety || null,
      transportation: ai?.transportation || tripData.transportation || null,
      languageBasics: ai?.languageBasics || tripData.languageBasics || null,
      weatherInfo: ai?.weatherInfo || tripData.weatherInfo || null,
      nearbyEvents: ai?.nearbyEvents || tripData.nearbyEvents || [],
    };

  }, [route.params?.tripData]); // Dependency array ensures recalculation only when tripData changes
  
  console.log("PLAN STRUCTURE:", JSON.stringify(plan, null, 2));
  console.log("DAYS STRUCTURE:", JSON.stringify(plan.days, null, 2));

  // --- Event Handlers ---
  const handleShare = async () => {
    try {
      const htmlContent = generatePdfContent(plan);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfName = `${uri.slice(0, uri.lastIndexOf('/') + 1)}TripPlan_${plan?.details?.find(d => d.name === 'Destination')?.value || 'Details'}.pdf`;
      
      await FileSystem.moveAsync({
        from: uri,
        to: pdfName,
      });
      
      await Sharing.shareAsync(pdfName, { mimeType: 'application/pdf', dialogTitle: 'Share your Trip Plan' });
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert("Error", "Could not generate or share the PDF plan.");
    }
  };

  const handleNext = () => {
    // Navigate to the InformationScreen, passing necessary IDs
    console.log("[UserPlanScreen] Next button pressed - Attempting to navigate to InformationScreen");
    if (!plan || !plan.destination) {
      Alert.alert("Missing Data", "Cannot proceed without trip destination.");
      return;
    }
    console.log("[UserPlanScreen] handleNext called with tripData:", plan);
    console.log("[UserPlanScreen] Navigating to InformationScreen with:", 
                { nationality: plan.nationality, destination: plan.destination });
    navigation.navigate("InformationScreen", {
      nationality: plan.nationality, 
      destination: plan.destination,
      // Pass the whole plan data so InformationScreen can use pre-fetched info
      tripData: plan 
    });
  };
  
  // --- Render Functions ---
  // Helper to render detail items safely
  const renderDetailItem = (item, index) => {
    if (!item || !item.name || !item.value) return null;
    return (
      <DetailItem
        key={index}
        iconName={detailEmojis[item.name] || "information-circle-outline"}
        label={t(`userPlan.details.${item.name.toLowerCase()}`, item.name)}
        value={item.value}
      />
    );
  };
  
  // Helper to render accordion sections safely
  const renderAccordionSection = (titleKey, iconName, data, renderContent) => {
    if (!data) return null; // Don't render if data is null/undefined
    // Check if data object is empty (considering nested objects/arrays)
    if (typeof data === 'object' && Object.keys(data).length === 0) return null;
    if (Array.isArray(data) && data.length === 0) return null;
    
    return (
      <Accordion
        title={
          <View style={styles.accordionHeader}>
            <Ionicons name={iconName} size={22} color="#4B5563" style={styles.accordionIcon} />
            <Text style={styles.accordionTitle}>{t(titleKey)}</Text>
          </View>
        }
      >
        {renderContent(data)}
      </Accordion>
    );
  };

  // --- Main Render ---
  if (!plan) {
    // Handle the case where plan is still loading or failed to load
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>Loading Trip Plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('userPlan.title')}</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Trip Details */}
        <View style={styles.detailsCard}>
          {plan.details.map(renderDetailItem)}
        </View>

        {/* Travel Recommendations Component */}
        {/* Pass individual sections directly */}
        <TravelRecommendations
          itinerary={plan.days || []} // Pass the processed days array
          currencyInfo={plan.currencyInfo}
          healthAndSafety={plan.healthAndSafety}
          transportation={plan.transportation}
          languageBasics={plan.languageBasics}
          weatherInfo={plan.weatherInfo}
        />
        
        {/* Other Sections (Visa, Culture, Events) - Can be separate components or Accordions */}
        
        {/* Visa Requirements Section - Render directly or use a component */}
        {renderAccordionSection(
          'userPlan.sections.visa', 
          sectionIcons.visaRequirements || 'document-text-outline',
          plan.visaRequirements, 
          (data) => <VisaRequirements data={data} /> // Pass data to VisaRequirements component
        )}

        {/* Culture Insights Section - Render directly or use a component */}
        {renderAccordionSection(
          'userPlan.sections.culture', 
          sectionIcons.localCustoms || 'earth-outline',
          plan.cultureInsights, 
          (data) => <CultureInsights data={data} /> // Pass data to CultureInsights component
        )}

        {/* Nearby Events Section */}
        {renderAccordionSection(
          'userPlan.sections.events', 
          sectionIcons.nearbyEvents || 'calendar-outline',
          plan.nearbyEvents, 
          (data) => <NearbyEvents events={data} /> // Pass data to NearbyEvents component
        )}

        {/* Optional: Raw AI Response (for debugging) */}
        {/* 
        {__DEV__ && plan.apiResponse && (
          <Accordion title="Raw API Response (Debug)">
            <Text style={{ fontFamily: 'monospace', fontSize: 10 }}>
              {JSON.stringify(plan.apiResponse, null, 2)}
            </Text>
          </Accordion>
        )}
        */}
        
      </ScrollView>
      
      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{t('userPlan.buttons.next')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Styles --- (Keep existing styles, ensure keys match used styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16, 
    paddingBottom: 80, // Ensure space for footer button
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8, // Add padding for better spacing
  },
  accordionIcon: {
    marginRight: 10,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1, // Allow title to take remaining space
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16, // Adjust padding for iOS bottom safe area
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9', // Blue color
    paddingVertical: 14,
    borderRadius: 999, // Fully rounded
    height: 50,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

// Default export IS needed for React Navigation if it's registered this way
export default UserPlanScreen;
