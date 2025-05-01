import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Alert,
  Linking,
  
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useNavigation, useRoute } from "@react-navigation/native";

// Import components
import { VisaRequirements } from "../../components/trips/VisaRequirements";
import { CultureInsights } from "../../components/trips/CultureInsights";
import { NearbyEvents } from "../../components/trips/NearbyEvents";
import { DetailItem } from "../../components/shared/DetailItem";
import { Accordion } from "../../components/shared/Accordion";
// Removed ActivityItem as it wasn't directly used here
// Removed TravelRecommendations as its content is now in accordions

// --- Static Content / Maps ---
// Restore detailEmojis as it's used in renderDetailItem
const detailEmojis = {
  Destination: "✈️",
  Duration: "⏳",
  Expenses: "💵",
};

// Updated icons map for consistency
const sectionIcons = {
  dailyItinerary: "map-outline",
  currencyInfo: "cash-outline",
  healthAndSafety: "medkit-outline",
  transportation: "car-sport-outline",
  languageBasics: "language-outline",
  weatherInfo: "partly-sunny-outline",
  visaRequirements: "document-text-outline",
  cultureInsights: "earth-outline",
  nearbyEvents: "calendar-outline",
};

// --- Helper Function for PDF Generation (Accepts t function for i18n) ---
function generatePdfContent(plan, t) {
  const details = plan?.details || [];
  const destination =
    details.find((d) => d.name === "Destination")?.value || "N/A";
  const duration = details.find((d) => d.name === "Duration")?.value || "N/A";
  const expenses = details.find((d) => d.name === "Expenses")?.value || "N/A";
  const days = Array.isArray(plan?.days) ? plan.days : [];

  // Use t function for titles and static text
  const pdfMainTitle = t('userPlan.pdf.mainTitle', { destination });
  const pdfSubtitle = t('userPlan.pdf.subtitle', { destination });
  const detailDestinationLabel = t('userPlan.details.destination');
  const detailDurationLabel = t('userPlan.details.duration');
  const detailExpensesLabel = t('userPlan.details.expenses');
  const noPlanItemsText = t('userPlan.pdf.noPlanItems');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${pdfMainTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; background-color: #f8f8f8; color: #333; }
          .container { margin: 30px auto; max-width: 800px; background: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08); }
          .header { text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #0EA5E9; /* Primary Blue */ }
          .header h1 { margin: 0; font-size: 28px; color: #0EA5E9; }
          .header p { margin: 5px 0 0; font-size: 16px; color: #555; }
          .details { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .detail { text-align: center; }
          .detail h3 { margin: 0 0 5px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail p { margin: 0; font-size: 18px; font-weight: 500; color: #333; }
          .section-block { margin-bottom: 25px; background: #f9f9f9; padding: 15px 20px; border-radius: 6px; border-left: 4px solid #0EA5E9; /* Accent */ }
          .section-block h2 { font-size: 20px; color: #333; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #eee; }
          .section-block p, .section-block li { color: #555; line-height: 1.6; font-size: 14px; }
          .section-block ul { padding-left: 20px; margin-top: 5px; list-style-type: disc; }
          .section-block .key-value { margin-bottom: 8px; font-size: 14px; }
          .section-block .key-value strong { color: #1F2937; /* Darker text */ margin-right: 5px; }
          .day-section { margin-bottom: 30px; }
          .day-section h2 { font-size: 22px; color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed #0EA5E9; }
          .plan-item { margin-bottom: 12px; padding: 12px; background: #f9f9f9; border-left: 4px solid #0EA5E9; border-radius: 6px; display: flex; align-items: flex-start; }
          .plan-item span.time { font-weight: 700; color: #0EA5E9; margin-right: 12px; display: inline-block; width: 80px; font-size: 14px; flex-shrink: 0; }
          .plan-item span.event { color: #333; font-size: 14px; flex-grow: 1; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${pdfMainTitle}</h1>
            <p>${pdfSubtitle}</p>
          </div>
          <div class="details">
            <div class="detail"><h3>${detailDestinationLabel}</h3><p>${destination}</p></div>
            <div class="detail"><h3>${detailDurationLabel}</h3><p>${duration}</p></div>
            <div class="detail"><h3>${detailExpensesLabel}</h3><p>${expenses}</p></div>
          </div>

          ${days
            .map((day) => {
              const dayNumber = day?.day || "?";
              const dayActivities = Array.isArray(day?.activities) ? day.activities : [];
              const dayPlan = Array.isArray(day?.plan) ? day.plan : [];
              const dayTitle = day?.title || dayActivities[0]?.name || t('userPlan.itinerary.dayTitleFallback', { dayNumber });

              return `
              <div class="day-section">
                <h2>${dayTitle}</h2>
                ${dayPlan.length > 0
                  ? dayPlan.map((item) => {
                      const itemTime = item?.time || "";
                      const itemEvent = item?.event || t('userPlan.itinerary.noDetails');
                      return `
                      <div class="plan-item">
                        ${itemTime ? `<span class="time">${itemTime}</span>` : ''}
                        <span class="event">${itemEvent}</span>
                      </div>`;
                    }).join("")
                  : `<p>${noPlanItemsText}</p>`
                }
              </div>`;
            })
            .join("")}

          ${Object.entries({
            visaRequirements: plan.visaRequirements,
            cultureInsights: plan.cultureInsights,
            currencyInfo: plan.currencyInfo,
            healthAndSafety: plan.healthAndSafety,
            transportation: plan.transportation,
            languageBasics: plan.languageBasics,
            weatherInfo: plan.weatherInfo,
           }).map(([key, data]) => {
               if (!data) return "";
               let contentHtml = "";
               let title = "";

               switch (key) {
                   case 'visaRequirements':
                       contentHtml = `<p>${typeof data === 'string' ? data : data.content || data.notes || t('userPlan.pdf.seeAppDetails')}</p>`;
                       title = t('userPlan.pdf.visaTitle');
                       break;
                   case 'cultureInsights':
                       contentHtml = `<p>${typeof data === 'string' ? data : data.content || t('userPlan.pdf.seeAppDetails')}</p>`;
                        title = t('userPlan.pdf.cultureTitle');
                       break;
                   case 'currencyInfo':
                        title = t('userPlan.pdf.currencyTitle');
                       contentHtml = `
                           ${data.currency ? `<div class="key-value"><strong>${t('userPlan.pdf.currencyLabel')}</strong> ${data.currency}</div>` : ''}
                           ${data.exchangeRate ? `<div class="key-value"><strong>${t('userPlan.pdf.exchangeRateLabel')}</strong> ${data.exchangeRate}</div>` : ''}
                           ${data.paymentMethods ? `<div class="key-value"><strong>${t('userPlan.pdf.paymentMethodsLabel')}</strong> ${data.paymentMethods}</div>` : ''}
                           ${data.tipping ? `<div class="key-value"><strong>${t('userPlan.pdf.tippingLabel')}</strong> ${data.tipping}</div>` : ''}
                       `;
                       break;
                   case 'healthAndSafety':
                        title = t('userPlan.pdf.healthTitle');
                       const safetyTipsTitle = t('userPlan.pdf.safetyTipsLabel');
                       const emergencyContactsTitle = t('userPlan.pdf.emergencyContactsLabel');
                       contentHtml = `
                           ${data.vaccinations ? `<div class="key-value"><strong>${t('userPlan.pdf.vaccinationsLabel')}</strong> ${data.vaccinations}</div>` : ''}
                           ${data.precautions ? `<p><strong>${t('userPlan.pdf.precautionsLabel')}</strong> ${data.precautions}</p>` : ''}
                           ${Array.isArray(data.safetyTips) && data.safetyTips.length > 0 ? `<h3>${safetyTipsTitle}</h3><ul>${data.safetyTips.map(tip => `<li>${tip}</li>`).join('')}</ul>` : ''}
                           ${data.emergencyContacts ? `<h3>${emergencyContactsTitle}</h3><ul>${Object.entries(data.emergencyContacts).map(([k, v]) => `<li><strong>${k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${v}</li>`).join('')}</ul>` : ''}
                       `;
                       break;
                   case 'transportation':
                        title = t('userPlan.pdf.transportationTitle');
                       const optionsTitle = t('userPlan.pdf.optionsLabel');
                       contentHtml = `
                           ${data.gettingAround ? `<p>${data.gettingAround}</p>` : ''}
                           ${Array.isArray(data.options) && data.options.length > 0 ? `<h3>${optionsTitle}</h3><ul>${data.options.map(opt => `<li>${opt}</li>`).join('')}</ul>` : ''}
                       `;
                       break;
                   case 'languageBasics':
                        title = t('userPlan.pdf.languageTitle');
                       const phrasesTitle = t('userPlan.pdf.commonPhrasesLabel');
                       const tipsTitle = t('userPlan.pdf.tipsLabel');
                       contentHtml = `
                           ${data.officialLanguage ? `<div class="key-value"><strong>${t('userPlan.pdf.officialLanguageLabel')}</strong> ${data.officialLanguage}</div>` : ''}
                           ${Array.isArray(data.phrases) && data.phrases.length > 0 ? `<h3>${phrasesTitle}</h3><ul>${data.phrases.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
                           ${data.communicationTips ? `<p><strong>${tipsTitle}</strong> ${data.communicationTips}</p>` : ''}
                       `;
                       break;
                   case 'weatherInfo':
                        title = t('userPlan.pdf.weatherTitle');
                       contentHtml = `
                           ${data.climate ? `<div class="key-value"><strong>${t('userPlan.pdf.climateLabel')}</strong> ${data.climate}</div>` : ''}
                           ${data.packingTips ? `<p><strong>${t('userPlan.pdf.packingTipsLabel')}</strong> ${data.packingTips}</p>` : ''}
                       `;
                       break;
                   default:
                       title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                       contentHtml = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
               }

               return `
                   <div class="section-block">
                       <h2>${title}</h2>
                       ${contentHtml}
                   </div>
               `;
           }).join("")}

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

  // Process route params using useMemo for efficiency
  const plan = useMemo(() => {
    const tripData = route.params?.tripData;

    if (!tripData) {
      console.warn("UserPlanScreen: No tripData found.");
      return null; // Return null if no data, handled by loading state
    }
    // console.log("UserPlanScreen received tripData:", tripData); // Keep for debugging if needed

    // Prioritize pre-processed data
    if (tripData.dataProcessed) {
        // console.log("[UserPlanScreen] Using pre-processed data.");
      const details = [
        { name: "Destination", value: tripData.destination || "N/A" },
        { name: "Duration", value: tripData.duration ? `${tripData.duration} days` : "N/A" },
        { name: "Expenses", value: tripData.budgetLevel || tripData.budget || "N/A" },
      ];
      return {
        tripId: tripData.tripId,
        destination: tripData.destination,
        nationality: tripData.nationality,
        details: details,
        days: Array.isArray(tripData.days) ? tripData.days : [],
        visaRequirements: tripData.visaRequirements,
        cultureInsights: tripData.cultureInsights,
        currencyInfo: tripData.currencyInfo,
        healthAndSafety: tripData.healthAndSafety,
        transportation: tripData.transportation,
        languageBasics: tripData.languageBasics,
        weatherInfo: tripData.weatherInfo,
        nearbyEvents: Array.isArray(tripData.nearbyEvents) ? tripData.nearbyEvents : [],
      };
    }

    // Fallback: Process data if not pre-processed
    console.warn("[UserPlanScreen] Data not pre-processed, attempting fallback parsing.");
    let ai = null;
    const rawAiInfo = tripData.aiRecommendations?.additionalInfo;
    if (rawAiInfo && typeof rawAiInfo === 'string') {
      try {
        ai = JSON.parse(rawAiInfo);
      } catch (err) {
        console.error("[UserPlanScreen] Fallback: FAILED to parse AI recommendations JSON:", err);
      }
    } else if (tripData.aiRecommendations?.additionalInfo) {
      ai = tripData.aiRecommendations.additionalInfo;
    }

    const details = [
      { name: "Destination", value: tripData.destination || "N/A" },
      { name: "Duration", value: tripData.duration ? `${tripData.duration} days` : "N/A" },
      { name: "Expenses", value: tripData.budgetLevel || tripData.budget || "N/A" },
    ];

    let days = [];
    if (ai?.dailyItinerary && Array.isArray(ai.dailyItinerary)) {
        days = ai.dailyItinerary.map((daySource, index) => ({
            day: daySource.day || (index + 1),
            title: daySource.title || `Day ${daySource.day || (index + 1)}`, // Use provided title or generate one
            plan: daySource.plan || [], // Ensure plan is an array
            // Keep other potential fields like activities if they exist
            ...(daySource.activities && { activities: daySource.activities }),
            ...(daySource.morning && { morning: daySource.morning }),
            ...(daySource.afternoon && { afternoon: daySource.afternoon }),
            ...(daySource.evening && { evening: daySource.evening }),
          }));
    } else if (tripData.itinerary && Array.isArray(tripData.itinerary)) {
      days = tripData.itinerary; // Assuming this has the correct structure
    } else {
      const duration = parseInt(tripData.duration, 10) || 1;
      days = Array.from({ length: duration }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}`,
        plan: []
      }));
    }

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

  }, [route.params?.tripData]);

  // --- Event Handlers ---
  const handleShare = async () => {
    if (!plan) return; // Don't share if plan isn't ready
    try {
      const htmlContent = generatePdfContent(plan, t);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfName = `${FileSystem.cacheDirectory || FileSystem.documentDirectory}TripPlan_${plan.destination?.replace(/ /g, '_') || 'Shared'}.pdf`;

      await FileSystem.moveAsync({ from: uri, to: pdfName });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(t('userPlan.alerts.sharingNotAvailableTitle'), t('userPlan.alerts.sharingNotAvailableMessage'));
        return;
      }
      await Sharing.shareAsync(pdfName, { mimeType: 'application/pdf', dialogTitle: t('userPlan.alerts.shareDialogTitle', 'Share your Trip Plan') });
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert(t('userPlan.alerts.errorTitle'), t('userPlan.alerts.pdfError'));
    }
  };

  const handleNext = () => {
    if (!plan || !plan.destination || !plan.nationality) {
      Alert.alert(t('userPlan.alerts.missingDataTitle'), t('userPlan.alerts.missingDataMessage'));
      return;
    }
    // Pass the full processed plan data
    navigation.navigate("InformationScreen", {
      nationality: plan.nationality,
      destination: plan.destination,
      tripData: plan
    });
  };

  // --- Render Helper Functions ---
  const renderDetailItem = (item, index) => {
    if (!item || !item.name || !item.value) return null;
    // The label is already handled by t(`userPlan.details.${item.name.toLowerCase()}`)
    return (
      <DetailItem
        key={`${item.name}-${index}`}
        iconName={detailEmojis[item.name] || "information-circle"}
        label={t(`userPlan.details.${item.name.toLowerCase()}`, item.name)}
        value={item.value}
      />
    );
  };

  const renderAccordionSection = (titleKey, iconName, data, renderContent) => {
    // More robust check for "empty" data
    const isEmpty = !data ||
                      (typeof data === 'object' && Object.keys(data).length === 0) ||
                      (Array.isArray(data) && data.length === 0);

    if (isEmpty) return null;

    return (
        <View style={styles.card} key={titleKey}>
            <Accordion
            title={
                <View style={styles.accordionHeader}>
                <Ionicons name={iconName} size={22} color="#4B5563" style={styles.accordionIcon} />
                <Text style={styles.accordionTitle}>{t(titleKey)}</Text>
                </View>
            }
            >
            <View style={styles.accordionContent}>
                {renderContent(data)}
            </View>
            </Accordion>
      </View>
    );
  };

  // Specific render functions for accordion content
  const renderItineraryContent = (days) => {
    if (!Array.isArray(days) || days.length === 0) {
        return <Text style={styles.emptyText}>{t('userPlan.itinerary.empty')}</Text>;
    }
    return days.map((day, index) => (
      <View key={`day-${day.day || index}`} style={styles.dayContainer}>
        <Text style={styles.dayTitle}>{day.title || `Day ${day.day}`}</Text>
        {Array.isArray(day.plan) && day.plan.length > 0 ? (
          day.plan.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.planItem}>
              {item.time && <Text style={styles.planTime}>{item.time}</Text>}
              <Text style={styles.planEvent}>{item.event || t('userPlan.itinerary.noDetails')}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.planEvent}>{t('userPlan.itinerary.noActivities')}</Text>
        )}
      </View>
    ));
  };

  const renderKeyValueContent = (data) => {
    if (!data || typeof data !== 'object') return null;
    return Object.entries(data).map(([key, value]) => {
      if (!value) return null; // Don't render if value is null/empty
      // Simple formatting for key names (e.g., officialLanguage -> Official Language)
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      return (
        <View key={key} style={styles.keyValueItem}>
          <Text style={styles.keyText}>{formattedKey}:</Text>
          <Text style={styles.valueText}>{value.toString()}</Text>
        </View>
      );
    });
  };

  const renderHealthSafetyContent = (data) => {
    return (
      <View>
        {data.vaccinations && <View style={styles.keyValueItem}><Text style={styles.keyText}>{t('userPlan.health.vaccinationsLabel')}</Text><Text style={styles.valueText}>{data.vaccinations}</Text></View>}
        {data.precautions && <View style={styles.keyValueItem}><Text style={styles.keyText}>{t('userPlan.health.precautionsLabel')}</Text><Text style={styles.valueText}>{data.precautions}</Text></View>}
        {Array.isArray(data.safetyTips) && data.safetyTips.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{t('userPlan.health.safetyTipsLabel')}</Text>
            {data.safetyTips.map((tip, index) => <Text key={index} style={styles.listItem}>• {tip}</Text>)}
          </View>
        )}
        {data.emergencyContacts && typeof data.emergencyContacts === 'object' && Object.keys(data.emergencyContacts).length > 0 && (
           <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{t('userPlan.health.emergencyContactsLabel')}</Text>
            {Object.entries(data.emergencyContacts).map(([key, value]) => (
              <View key={key} style={styles.keyValueItem}>
                <Text style={styles.keyText}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</Text>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

   const renderTransportationContent = (data) => {
    return (
      <View>
        {data.gettingAround && <Text style={styles.paragraphText}>{data.gettingAround}</Text>}
        {Array.isArray(data.options) && data.options.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{t('userPlan.transportation.optionsLabel')}</Text>
            {data.options.map((opt, index) => <Text key={index} style={styles.listItem}>• {opt}</Text>)}
          </View>
        )}
      </View>
    );
  };

  const renderLanguageBasicsContent = (data) => {
     return (
      <View>
        {data.officialLanguage && <View style={styles.keyValueItem}><Text style={styles.keyText}>{t('userPlan.language.officialLanguageLabel')}</Text><Text style={styles.valueText}>{data.officialLanguage}</Text></View>}
        {Array.isArray(data.phrases) && data.phrases.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>{t('userPlan.language.commonPhrasesLabel')}</Text>
            {data.phrases.map((phrase, index) => <Text key={index} style={styles.listItem}>• {phrase}</Text>)}
          </View>
        )}
        {data.communicationTips && <View style={styles.sectionBlock}><Text style={styles.sectionTitle}>{t('userPlan.language.communicationTipsLabel')}</Text><Text style={styles.paragraphText}>{data.communicationTips}</Text></View>}
      </View>
    );
  };

   const renderWeatherContent = (data) => {
     return (
       <View>
         {data.climate && <View style={styles.keyValueItem}><Text style={styles.keyText}>{t('userPlan.weather.climateLabel')}</Text><Text style={styles.valueText}>{data.climate}</Text></View>}
         {data.packingTips && <View style={styles.sectionBlock}><Text style={styles.sectionTitle}>{t('userPlan.weather.packingTipsLabel')}</Text><Text style={styles.paragraphText}>{data.packingTips}</Text></View>}
       </View>
     );
   };


  // --- Main Render ---
  if (!plan) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>{t('userPlan.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={28} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('userPlan.title')}</Text>
        <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
          <Ionicons name="share-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Trip Details */}
        <View style={[styles.card, styles.detailsContainer]}>
          {plan.details.map(renderDetailItem)}
        </View>

        {/* Itinerary Section */}
        {renderAccordionSection(
          'userPlan.sections.itinerary',
          sectionIcons.dailyItinerary,
          plan.days,
          renderItineraryContent
        )}

        {/* Currency Section */}
        {renderAccordionSection(
          'userPlan.sections.currency',
          sectionIcons.currencyInfo,
          plan.currencyInfo,
          renderKeyValueContent
        )}

        {/* Health & Safety Section */}
        {renderAccordionSection(
          'userPlan.sections.health',
          sectionIcons.healthAndSafety,
          plan.healthAndSafety,
          renderHealthSafetyContent
        )}

        {/* Transportation Section */}
        {renderAccordionSection(
          'userPlan.sections.transportation',
          sectionIcons.transportation,
          plan.transportation,
          renderTransportationContent
        )}

        {/* Language Basics Section */}
        {renderAccordionSection(
          'userPlan.sections.language',
          sectionIcons.languageBasics,
          plan.languageBasics,
          renderLanguageBasicsContent
        )}

        {/* Weather Info Section */}
         {renderAccordionSection(
          'userPlan.sections.weather',
          sectionIcons.weatherInfo,
          plan.weatherInfo,
          renderWeatherContent
        )}

        {/* Visa Requirements Section */}
        {renderAccordionSection(
          'userPlan.sections.visa',
          sectionIcons.visaRequirements,
          plan.visaRequirements,
          (data) => <VisaRequirements data={data} />
        )}

        {/* Culture Insights Section */}
        {renderAccordionSection(
          'userPlan.sections.culture',
          sectionIcons.cultureInsights,
          plan.cultureInsights,
          (data) => <CultureInsights data={data} />
        )}

        {/* Nearby Events Section */}
        {renderAccordionSection(
          'userPlan.sections.events',
          sectionIcons.nearbyEvents,
          plan.nearbyEvents,
          (data) => <NearbyEvents events={data} />
        )}

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

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light Gray
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6B7280', // Medium Gray
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12, // Reduced horizontal padding slightly
    paddingVertical: 10,
    backgroundColor: '#FFF', // White
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Light Gray border
  },
  iconButton: {
    padding: 8, // Hit area for icons
  },
  headerTitle: {
    fontSize: 18, // Slightly smaller title
    fontWeight: '600',
    color: '#1F2937', // Dark Gray
    textAlign: 'center',
    flex: 1, // Allow title to take space but center
    marginHorizontal: 10, // Add margin around title
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 90, // Increased padding for footer button clearance
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Ensures accordion content stays within card bounds
  },
  detailsContainer: {
     paddingVertical: 8, // Adjust padding inside details card
     paddingHorizontal: 16,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16, // Consistent padding
  },
  accordionIcon: {
    marginRight: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937', // Dark Gray
    flex: 1,
  },
   accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8, // Add a bit of space above content
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', // Very light separator line
  },
  // Styles for Itinerary content
  dayContainer: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    '&:last-child': { // Target last child if possible (might need specific logic in RN)
        borderBottomWidth: 0,
        marginBottom: 0,
        paddingBottom: 0,
    }
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827', // Slightly darker heading
    marginBottom: 8,
  },
  planItem: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
  },
  planTime: {
    width: 70, // Fixed width for time alignment
    fontSize: 14,
    color: '#0EA5E9', // Blue accent
    fontWeight: '500',
    marginRight: 10,
  },
  planEvent: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563', // Medium Gray
    lineHeight: 20, // Improved readability
  },
  // Styles for Key-Value pairs
  keyValueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    alignItems: 'flex-start',
  },
  keyText: {
    fontSize: 14,
    color: '#374151', // Darker Gray
    fontWeight: '500',
    marginRight: 8,
  },
  valueText: {
    fontSize: 14,
    color: '#4B5563', // Medium Gray
    textAlign: 'right',
    flexShrink: 1, // Allow text to wrap if needed
  },
  // Styles for Lists and Paragraphs within accordions
  sectionBlock: {
      marginTop: 10,
  },
  sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#111827',
      marginBottom: 5,
  },
  listItem: {
      fontSize: 14,
      color: '#4B5563',
      marginBottom: 4,
      lineHeight: 20,
  },
   paragraphText: {
      fontSize: 14,
      color: '#4B5563',
      lineHeight: 20,
      marginBottom: 8,
  },
  emptyText: {
      fontSize: 14,
      color: '#6B7280',
      textAlign: 'center',
      paddingVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Adjusted bottom padding
    backgroundColor: '#FFF', // White background
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // Light Gray border
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9', // Primary Blue
    paddingVertical: 12,
    borderRadius: 8, // Slightly less rounded corners
    height: 50,
  },
  nextButtonText: {
    color: '#FFF', // White text
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default UserPlanScreen;