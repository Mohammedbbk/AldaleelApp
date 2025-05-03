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
import { useTheme } from "../../../ThemeProvider";
import { NearbyEvents } from "../../components/trips/NearbyEvents";
import { DetailItem } from "../../components/shared/DetailItem";
import { Accordion } from "../../components/shared/Accordion";

const detailEmojis = {
  Destination: "✈️",
  Duration: "⏳",
  Expenses: "💵",
};

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

function generatePdfContent(plan, t) {
  const details = plan?.details || [];
  const destination =
    details.find((d) => d.name === "Destination")?.value || "N/A";
  const duration = details.find((d) => d.name === "Duration")?.value || "N/A";
  const expenses = details.find((d) => d.name === "Expenses")?.value || "N/A";
  const days = Array.isArray(plan?.days) ? plan.days : [];

  const pdfMainTitle = t("userPlan.pdf.mainTitle", { destination });
  const pdfSubtitle = t("userPlan.pdf.subtitle", { destination });
  const detailDestinationLabel = t("userPlan.details.destination");
  const detailDurationLabel = t("userPlan.details.duration");
  const detailExpensesLabel = t("userPlan.details.expenses");
  const noPlanItemsText = t("userPlan.pdf.noPlanItems");

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
              const dayActivities = Array.isArray(day?.activities)
                ? day.activities
                : [];
              const dayPlan = Array.isArray(day?.plan) ? day.plan : [];
              const dayTitle =
                day?.title ||
                dayActivities[0]?.name ||
                t("userPlan.itinerary.dayTitleFallback", { dayNumber });

              return `
              <div class="day-section">
                <h2>${dayTitle}</h2>
                ${
                  dayPlan.length > 0
                    ? dayPlan
                        .map((item) => {
                          const itemTime = item?.time || "";
                          const itemEvent =
                            item?.event || t("userPlan.itinerary.noDetails");
                          return `
                      <div class="plan-item">
                        ${
                          itemTime
                            ? `<span class="time">${itemTime}</span>`
                            : ""
                        }
                        <span class="event">${itemEvent}</span>
                      </div>`;
                        })
                        .join("")
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
          })
            .map(([key, data]) => {
              if (!data) return "";
              let contentHtml = "";
              let title = "";

              switch (key) {
                case "visaRequirements":
                  contentHtml = `<p>${
                    typeof data === "string"
                      ? data
                      : data.content ||
                        data.notes ||
                        t("userPlan.pdf.seeAppDetails")
                  }</p>`;
                  title = t("userPlan.pdf.visaTitle");
                  break;
                case "cultureInsights":
                  contentHtml = `<p>${
                    typeof data === "string"
                      ? data
                      : data.content || t("userPlan.pdf.seeAppDetails")
                  }</p>`;
                  title = t("userPlan.pdf.cultureTitle");
                  break;
                case "currencyInfo":
                  title = t("userPlan.pdf.currencyTitle");
                  contentHtml = `
                           ${
                             data.currency
                               ? `<div class="key-value"><strong>${t(
                                   "userPlan.pdf.currencyLabel"
                                 )}</strong> ${data.currency}</div>`
                               : ""
                           }
                           ${
                             data.exchangeRate
                               ? `<div class="key-value"><strong>${t(
                                   "userPlan.pdf.exchangeRateLabel"
                                 )}</strong> ${data.exchangeRate}</div>`
                               : ""
                           }
                           ${
                             data.paymentMethods
                               ? `<div class="key-value"><strong>${t(
                                   "userPlan.pdf.paymentMethodsLabel"
                                 )}</strong> ${data.paymentMethods}</div>`
                               : ""
                           }
                           ${
                             data.tipping
                               ? `<div class="key-value"><strong>${t(
                                   "userPlan.pdf.tippingLabel"
                                 )}</strong> ${data.tipping}</div>`
                               : ""
                           }
                       `;
                  break;
                case "healthAndSafety":
                  title = t("userPlan.pdf.healthTitle");
                  const safetyTipsTitle = t("userPlan.pdf.safetyTipsLabel");
                  const emergencyContactsTitle = t(
                    "userPlan.pdf.emergencyContactsLabel"
                  );
                  contentHtml = `
                           ${
                             data.vaccinations
                               ? `<div class="key-value"><strong>${t(
                                   "userPlan.pdf.vaccinationsLabel"
                                 )}</strong> ${data.vaccinations}</div>`
                               : ""
                           }
                           ${
                             data.precautions
                               ? `<p><strong>${t(
                                   "userPlan.pdf.precautionsLabel"
                                 )}</strong> ${data.precautions}</p>`
                               : ""
                           }
                           ${
                             Array.isArray(data.safetyTips) &&
                             data.safetyTips.length > 0
                               ? `<h3>${safetyTipsTitle}</h3><ul>${data.safetyTips
                                   .map((tip) => `<li>${tip}</li>`)
                                   .join("")}</ul>`
                               : ""
                           }
                           ${
                             data.emergencyContacts
                               ? `<h3>${emergencyContactsTitle}</h3><ul>${Object.entries(
                                   data.emergencyContacts
                                 )
                                   .map(
                                     ([k, v]) =>
                                       `<li><strong>${k
                                         .replace(/([A-Z])/g, " $1")
                                         .replace(/^./, (str) =>
                                           str.toUpperCase()
                                         )}:</strong> ${v}</li>`
                                   )
                                   .join("")}</ul>`
                               : ""
                           }
                       `;
                  break;
                case "transportation":
                  title = t("userPlan.pdf.transportationTitle");
                  const optionsTitle = t("userPlan.pdf.optionsLabel");
                  contentHtml = `
                           ${
                             data.gettingAround
                               ? `<p>${data.gettingAround}</p>`
                               : ""
                           }
                           ${
                             Array.isArray(data.options) &&
                             data.options.length > 0
                               ? `<h3>${optionsTitle}</h3><ul>${data.options
                                   .map((opt) => `<li>${opt}</li>`)
                                   .join("")}</ul>`
                               : ""
                           }
                       `;
                  break;
                case "languageBasics":
                  title = t("userPlan.pdf.languageTitle");
                  const phrasesTitle = t("userPlan.pdf.commonPhrasesLabel");
                  const tipsTitle = t("userPlan.pdf.tipsLabel");
                  contentHtml = `
                           ${
                             data.officialLanguage
                               ? `<div class="key-value"><strong>${t(
                                   "userPlan.pdf.officialLanguageLabel"
                                 )}</strong> ${data.officialLanguage}</div>`
                               : ""
                           }
                           ${
                             Array.isArray(data.phrases) &&
                             data.phrases.length > 0
                               ? `<h3>${phrasesTitle}</h3><ul>${data.phrases
                                   .map((p) => `<li>${p}</li>`)
                                   .join("")}</ul>`
                               : ""
                           }
                           ${
                             data.communicationTips
                               ? `<p><strong>${tipsTitle}</strong> ${data.communicationTips}</p>`
                               : ""
                           }
                       `;
                  break;
                case "weatherInfo":
                  title = t("userPlan.pdf.weatherTitle");
                  contentHtml = `
                           ${
                             data.climate
                               ? `<div class="key-value"><strong>${t(
                                   "userPlan.pdf.climateLabel"
                                 )}</strong> ${data.climate}</div>`
                               : ""
                           }
                           ${
                             data.packingTips
                               ? `<p><strong>${t(
                                   "userPlan.pdf.packingTipsLabel"
                                 )}</strong> ${data.packingTips}</p>`
                               : ""
                           }
                       `;
                  break;
                default:
                  title = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase());
                  contentHtml = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
              }

              return `
                   <div class="section-block">
                       <h2>${title}</h2>
                       ${contentHtml}
                   </div>
               `;
            })
            .join("")}

        </div>
      </body>
    </html>`;
  return htmlContent;
}

const calculateTotalExpenses = (estimatedCosts) => {
  if (!estimatedCosts) return null;

  const costs = {
    food: parseFloat(
      estimatedCosts?.["Food"]?.["Per day"]?.split(" ")[0]?.split("-")[1] || 0
    ),
    accommodation: parseFloat(
      estimatedCosts?.["Accommodation"]?.["Per Night"]
        ?.split(" ")[0]
        ?.split("-")[1] || 0
    ),
    transportation: parseFloat(
      estimatedCosts?.["Local Transportation"]?.["Per Day"]
        ?.split(" ")[0]
        ?.split("-")[1] || 0
    ),
    miscellaneous: parseFloat(
      estimatedCosts?.["Miscellaneous Expenses"]?.["Per day"]
        ?.split(" ")[0]
        ?.split("-")[1] || 0
    ),
  };

  const total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  const currency =
    estimatedCosts?.["Food"]?.["Per day"]?.split(" ")[1] || "AED";

  return total ? `${total} ${currency}` : null;
};

// --- Component ---
export function UserPlanScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode, colors } = useTheme();

  // Process route params using useMemo for efficiency
  const plan = useMemo(() => {
    const tripData = route.params?.tripData;
    console.log("UserPlanScreen received tripData:", tripData);

    if (!tripData) {
      console.warn("UserPlanScreen: No tripData found.");
      return null;
    }

    // Parse the itinerary content
    let parsedItinerary = null;
    try {
      const content = tripData.itinerary?.data?.content;
      if (content) {
        parsedItinerary = JSON.parse(content);
        console.log("Parsed itinerary:", parsedItinerary);
      }
    } catch (error) {
      console.error("Error parsing itinerary:", error);
    }

    // Create details array
    const details = [
      {
        name: "Destination",
        value: tripData.displayDestination || tripData.destination || "N/A",
      },
      {
        name: "Duration",
        value: tripData.duration
          ? `${tripData.duration} ${t("common.days")}`
          : "N/A",
      },
      {
        name: "Expenses",
        value:
          calculateTotalExpenses(parsedItinerary?.["Estimated Costs"]) ||
          tripData.budgetLevel ||
          "N/A",
      },
    ];

    return {
      tripId: tripData.id,
      destination: tripData.displayDestination || tripData.destination,
      nationality: tripData.nationality,
      details: details,
      days: Object.entries(parsedItinerary || {})
        .filter(([key]) => key.startsWith("Day "))
        .map(([dayKey, dayData]) => ({
          day: parseInt(dayKey.split(" ")[1]),
          title: `Day ${parseInt(dayKey.split(" ")[1])}`, // Direct title instead of translation key
          plan: Object.entries(dayData.Itinerary[0]).map(
            ([time, activity]) => ({
              time,
              event: `${activity.Activity} - ${activity.Details}`,
            })
          ),
        })),
      visaRequirements: {
        required: false,
        details: parsedItinerary?.["Visa Requirements"],
      },
      cultureInsights: {
        customs: parsedItinerary?.["Cultural Considerations"],
      },
      weatherInfo: {
        climate: parsedItinerary?.["Weather Info"],
        packingTips: parsedItinerary?.["Weather Info"],
      },
      transportation: {
        gettingAround:
          parsedItinerary?.["Transport Recommendations"]?.[
            "City Transportation"
          ],
        options: Object.values(
          parsedItinerary?.["Transport Recommendations"] || {}
        ).filter(Boolean),
      },
      currencyInfo: {
        costs: {
          food: parsedItinerary?.["Estimated Costs"]?.["Food"]?.["Per day"],
          accommodation:
            parsedItinerary?.["Estimated Costs"]?.["Accommodation"]?.[
              "Per Night"
            ],
          transportation:
            parsedItinerary?.["Estimated Costs"]?.["Local Transportation"]?.[
              "Per Day"
            ],
          miscellaneous:
            parsedItinerary?.["Estimated Costs"]?.["Miscellaneous Expenses"]?.[
              "Per day"
            ],
        },
        currency: Object.values(parsedItinerary?.["Estimated Costs"] || {})
          .find((cost) => cost?.["Per day"])
          ?.["Per day"]?.split(" ")?.[1],
        paymentMethods:
          parsedItinerary?.["Payment Methods"] ||
          parsedItinerary?.["Transport Recommendations"]?.["Payment Methods"] ||
          parsedItinerary?.["Transport Recommendations"]?.["payment_methods"] ||
          parsedItinerary?.["payment_methods"],
      },
    };
  }, [route.params?.tripData, t]);

  // --- Event Handlers ---
  const handleShare = async () => {
    if (!plan) return; // Don't share if plan isn't ready
    try {
      const htmlContent = generatePdfContent(plan, t);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const pdfName = `${
        FileSystem.cacheDirectory || FileSystem.documentDirectory
      }TripPlan_${plan.destination?.replace(/ /g, "_") || "Shared"}.pdf`;

      await FileSystem.moveAsync({ from: uri, to: pdfName });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(
          t("userPlan.alerts.sharingNotAvailableTitle"),
          t("userPlan.alerts.sharingNotAvailableMessage")
        );
        return;
      }
      await Sharing.shareAsync(pdfName, {
        mimeType: "application/pdf",
        dialogTitle: t(
          "userPlan.alerts.shareDialogTitle",
          "Share your Trip Plan"
        ),
      });
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert(
        t("userPlan.alerts.errorTitle"),
        t("userPlan.alerts.pdfError")
      );
    }
  };

  const handleNext = () => {
    navigation.navigate("Home");
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
    const isEmpty =
      !data ||
      (typeof data === "object" && Object.keys(data).length === 0) ||
      (Array.isArray(data) && data.length === 0);

    if (isEmpty) return null;

    return (
      <View style={styles.card} key={titleKey}>
        <Accordion
          title={
            <View style={styles.accordionHeader}>
              <Ionicons
                name={iconName}
                size={22}
                color="#4B5563"
                style={styles.accordionIcon}
              />
              <Text style={styles.accordionTitle}>{t(titleKey)}</Text>
            </View>
          }
        >
          <View style={styles.accordionContent}>{renderContent(data)}</View>
        </Accordion>
      </View>
    );
  };

  // Specific render functions for accordion content
  const renderItineraryContent = (days) => {
    if (!Array.isArray(days) || days.length === 0) {
      return (
        <Text style={styles.emptyText}>{t("userPlan.itinerary.empty")}</Text>
      );
    }

    // Filter out empty days and add debug logging
    const validDays = days.filter((day) => {
      console.log("Day data:", day);
      return day && Array.isArray(day.plan) && day.plan.length > 0;
    });

    console.log("Valid days count:", validDays.length);

    return (
      <View style={styles.daysContainer}>
        {validDays.map((day, index) => (
          <View
            key={`day-${day.day || index}`}
            style={[
              styles.dayContainer,
              index < validDays.length - 1 && { marginBottom: 16 },
            ]}
          >
            <View style={styles.dayTitleContainer}>
              <Text style={styles.dayTitle}>
                {day.title || `Day ${day.day}`}
              </Text>
            </View>
            <View>
              {day.plan.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    styles.planItem,
                    itemIndex < day.plan.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: "#F1F5F9",
                    },
                  ]}
                >
                  {item.time && (
                    <View style={styles.timeContainer}>
                      <Text style={styles.planTime}>{item.time}</Text>
                    </View>
                  )}
                  <View style={styles.eventContainer}>
                    <Text style={styles.planEvent}>
                      {item.event || t("userPlan.itinerary.noDetails")}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderKeyValueContent = (data) => {
    if (!data || typeof data !== "object") return null;

    const costLabels = {
      food: t("userPlan.currency.food", "Food"),
      accommodation: t("userPlan.currency.accommodation", "Accommodation"),
      transportation: t("userPlan.currency.transportation", "Transportation"),
      miscellaneous: t("userPlan.currency.miscellaneous", "Miscellaneous"),
    };

    return (
      <View>
        {data.currency && (
          <View style={styles.keyValueItem}>
            <Text style={styles.keyText}>
              {t("userPlan.currency.currencyLabel", "Currency")}:
            </Text>
            <Text style={styles.valueText}>{data.currency}</Text>
          </View>
        )}
        {data.costs &&
          Object.entries(data.costs).map(([key, value]) => {
            if (!value) return null;
            // Add console.log to debug values
            console.log(`Rendering cost for ${key}:`, value);
            return (
              <View key={key} style={styles.keyValueItem}>
                <Text style={styles.keyText}>{costLabels[key] || key}:</Text>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            );
          })}
        {data.paymentMethods && (
          <View style={styles.keyValueItem}>
            <Text style={styles.keyText}>
              {t("userPlan.currency.paymentMethodsLabel", "Payment Methods")}:
            </Text>
            <Text style={styles.valueText}>{data.paymentMethods}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderHealthSafetyContent = (data) => {
    return (
      <View>
        {data.vaccinations && (
          <View style={styles.keyValueItem}>
            <Text style={styles.keyText}>
              {t("userPlan.health.vaccinationsLabel")}
            </Text>
            <Text style={styles.valueText}>{data.vaccinations}</Text>
          </View>
        )}
        {data.precautions && (
          <View style={styles.keyValueItem}>
            <Text style={styles.keyText}>
              {t("userPlan.health.precautionsLabel")}
            </Text>
            <Text style={styles.valueText}>{data.precautions}</Text>
          </View>
        )}
        {Array.isArray(data.safetyTips) && data.safetyTips.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>
              {t("userPlan.health.safetyTipsLabel")}
            </Text>
            {data.safetyTips.map((tip, index) => (
              <Text key={index} style={styles.listItem}>
                • {tip}
              </Text>
            ))}
          </View>
        )}
        {data.emergencyContacts &&
          typeof data.emergencyContacts === "object" &&
          Object.keys(data.emergencyContacts).length > 0 && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>
                {t("userPlan.health.emergencyContactsLabel")}
              </Text>
              {Object.entries(data.emergencyContacts).map(([key, value]) => (
                <View key={key} style={styles.keyValueItem}>
                  <Text style={styles.keyText}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </Text>
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
        {data.gettingAround && (
          <Text style={styles.paragraphText}>{data.gettingAround}</Text>
        )}
        {Array.isArray(data.options) && data.options.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>
              {t("userPlan.transportation.optionsLabel")}
            </Text>
            {data.options.map((opt, index) => (
              <Text key={index} style={styles.listItem}>
                • {opt}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderLanguageBasicsContent = (data) => {
    return (
      <View>
        {data.officialLanguage && (
          <View style={styles.keyValueItem}>
            <Text style={styles.keyText}>
              {t("userPlan.language.officialLanguageLabel")}
            </Text>
            <Text style={styles.valueText}>{data.officialLanguage}</Text>
          </View>
        )}
        {Array.isArray(data.phrases) && data.phrases.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>
              {t("userPlan.language.commonPhrasesLabel")}
            </Text>
            {data.phrases.map((phrase, index) => (
              <Text key={index} style={styles.listItem}>
                • {phrase}
              </Text>
            ))}
          </View>
        )}
        {data.communicationTips && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>
              {t("userPlan.language.communicationTipsLabel")}
            </Text>
            <Text style={styles.paragraphText}>{data.communicationTips}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderWeatherContent = (data) => {
    return (
      <View>
        {data.climate && (
          <View style={styles.keyValueItem}>
            <Text style={styles.keyText}>
              {t("userPlan.weather.climateLabel")}
            </Text>
            <Text style={styles.valueText}>{data.climate}</Text>
          </View>
        )}
        {data.packingTips && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>
              {t("userPlan.weather.packingTipsLabel")}
            </Text>
            <Text style={styles.paragraphText}>{data.packingTips}</Text>
          </View>
        )}
      </View>
    );
  };

  // --- Main Render ---
  if (!plan) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDarkMode && { backgroundColor: colors.background },
        ]}
        edges={["top", "left", "right"]}
      >
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={isDarkMode ? colors.background : "#fff"}
        />

        {/* Header Title (Centered) */}
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("plan.title", "Your Plan")}
          </Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText}>{t("userPlan.loading")}</Text>
        </View>

        {/* Header Right Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleShare}
            className="w-[50px] h-[50px] rounded-full bg-gray-100 dark:bg-gray-900 justify-center items-center"
            accessibilityRole="button"
            accessibilityLabel={t("accessibility.shareButton", "Share Plan")}
          >
            <Ionicons name="share-outline" size={28} style={styles.iconColor} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDarkMode && { backgroundColor: colors.background },
      ]}
      edges={["top", "left", "right"]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          isDarkMode && {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={isDarkMode ? colors.text : "#374151"}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDarkMode ? colors.text : "#1F2937" },
          ]}
        >
          {t("userPlan.title")}
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
          <Ionicons
            name="share-outline"
            size={24}
            color={isDarkMode ? colors.text : "#374151"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
      >
        {/* Basic Trip Details */}
        <View
          style={[
            styles.card,
            styles.detailsContainer,
            isDarkMode && { backgroundColor: colors.card },
          ]}
        >
          {plan.details.map(renderDetailItem)}
        </View>

        {/* Conditionally render a message if parsing failed */}
        {plan.parsingError && (
          <View
            style={[
              styles.errorCard,
              isDarkMode && {
                backgroundColor: colors.notification,
                borderLeftColor: "#F59E0B",
              },
            ]}
          >
            <Ionicons
              name="warning-outline"
              size={20}
              color={isDarkMode ? "#FFD700" : "#D97706"}
            />
            <Text
              style={[styles.errorText, isDarkMode && { color: colors.text }]}
            >
              {t(
                "userPlan.errors.parsingFailed",
                "Could not load all generated details (Visa, Culture, etc.). Basic info shown."
              )}
            </Text>
          </View>
        )}

        {/* Itinerary Section */}
        {renderAccordionSection(
          "userPlan.sections.itinerary",
          sectionIcons.dailyItinerary,
          plan.days,
          renderItineraryContent
        )}

        {/* Currency Section */}
        {renderAccordionSection(
          "userPlan.sections.currency",
          sectionIcons.currencyInfo,
          plan.currencyInfo,
          renderKeyValueContent
        )}

        {/* Health & Safety Section */}
        {renderAccordionSection(
          "userPlan.sections.health",
          sectionIcons.healthAndSafety,
          plan.healthAndSafety,
          renderHealthSafetyContent
        )}

        {/* Transportation Section */}
        {renderAccordionSection(
          "userPlan.sections.transportation",
          sectionIcons.transportation,
          plan.transportation,
          renderTransportationContent
        )}

        {/* Language Basics Section */}
        {renderAccordionSection(
          "userPlan.sections.language",
          sectionIcons.languageBasics,
          plan.languageBasics,
          renderLanguageBasicsContent
        )}

        {/* Weather Info Section */}
        {renderAccordionSection(
          "userPlan.sections.weather",
          sectionIcons.weatherInfo,
          plan.weatherInfo,
          renderWeatherContent
        )}

        {/* Visa Requirements Section */}
        {renderAccordionSection(
          "userPlan.sections.visa",
          sectionIcons.visaRequirements,
          plan.visaRequirements?.details
            ? { details: plan.visaRequirements.details }
            : null,
          (data) => (
            <Text style={styles.paragraphText}>{data.details}</Text>
          )
        )}

        {/* Culture Insights Section */}
        {renderAccordionSection(
          "userPlan.sections.culture",
          sectionIcons.cultureInsights,
          plan.cultureInsights?.customs
            ? { customs: plan.cultureInsights.customs }
            : null,
          (data) => (
            <Text style={styles.paragraphText}>{data.customs}</Text>
          )
        )}

        {/* Nearby Events Section */}
        {renderAccordionSection(
          "userPlan.sections.events",
          sectionIcons.nearbyEvents,
          plan.nearbyEvents,
          (data) => (
            <NearbyEvents events={data} />
          )
        )}
      </ScrollView>

      {/* Footer Button */}
      <View
        style={[
          styles.footer,
          isDarkMode && {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.nextButton,
            isDarkMode && { backgroundColor: colors.primary },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  // Existing base styles with improvements
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Lighter, more modern background
  },

  // Enhanced header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    flex: 1,
    marginHorizontal: 12,
  },

  // Enhanced cards
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden", // Ensure content stays within borders
  },

  // Enhanced Details Card
  detailsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  // Enhanced accordion styling
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FAFAFA",
  },

  accordionIcon: {
    marginRight: 14,
    opacity: 0.8,
  },

  accordionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    flex: 1,
    letterSpacing: 0.3,
  },

  accordionContent: {
    padding: 16,
    backgroundColor: "#FFF",
  },

  // Enhanced Daily Itinerary
  daysContainer: {
    width: "100%", // Ensure container takes full width
  },

  dayContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  dayTitleContainer: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },

  timeContainer: {
    backgroundColor: "#F0F9FF",
    padding: 8,
    borderRadius: 8,
    minWidth: 100,
  },

  planTime: {
    fontSize: 14,
    color: "#0EA5E9",
    fontWeight: "600",
    textAlign: "center",
  },

  eventContainer: {
    flex: 1,
    paddingLeft: 12,
  },

  planItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },

  planEvent: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
    flex: 1,
    flexWrap: "wrap",
  },

  // Enhanced key-value pairs
  keyValueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  keyText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    marginRight: 12,
  },

  valueText: {
    fontSize: 14,
    color: "#334155",
    textAlign: "right",
    flex: 1,
    flexWrap: "wrap",
    paddingLeft: 8,
  },

  // Enhanced section styling
  sectionBlock: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  // Enhanced list items
  listItem: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 6,
    lineHeight: 20,
    paddingLeft: 8,
  },

  // Enhanced paragraph text
  paragraphText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
    marginBottom: 8,
    flexWrap: "wrap",
  },

  // Enhanced footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },

  // Enhanced button
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0EA5E9",
    paddingVertical: 14,
    borderRadius: 12,
    height: 54,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Enhanced error card
  errorCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    backgroundColor: "#FFFBEB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  errorText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#D97706",
    flex: 1,
    lineHeight: 20,
  },

  scrollView: {
    flex: 1,
    marginBottom: 70, // Add space for footer
  },

  scrollViewContent: {
    paddingBottom: 90,
    paddingHorizontal: 16,
  },
});

export default UserPlanScreen;
