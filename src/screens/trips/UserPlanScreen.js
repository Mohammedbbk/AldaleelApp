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
import { useTheme } from "../../../ThemeProvider";
import { NearbyEvents } from "../../components/trips/NearbyEvents";
import { DetailItem } from "../../components/shared/DetailItem";
import { Accordion } from "../../components/shared/Accordion";

const detailEmojis = {
  Destination: "🌍",
  Duration: "⏳",
  Style: "🎨",
  Expenses: "💰",
  Budget: "💵",
};

const sectionIcons = {
  dailyItinerary: "calendar-outline",
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
          .header { text-align: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 2px solid #0EA5E9; }
          .header h1 { margin: 0; font-size: 28px; color: #0EA5E9; }
          .header p { margin: 5px 0 0; font-size: 16px; color: #555; }
          .details { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .detail { text-align: center; }
          .detail h3 { margin: 0 0 5px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail p { margin: 0; font-size: 18px; font-weight: 500; color: #333; }
          .section-block { margin-bottom: 25px; background: #f9f9f9; padding: 15px 20px; border-radius: 6px; border-left: 4px solid #0EA5E9; }
          .section-block h2 { font-size: 20px; color: #333; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #eee; }
          .section-block p, .section-block li { color: #555; line-height: 1.6; font-size: 14px; }
          .section-block ul { padding-left: 20px; margin-top: 5px; list-style-type: disc; }
          .section-block .key-value { margin-bottom: 8px; font-size: 14px; }
          .section-block .key-value strong { color: #1F2937; margin-right: 5px; }
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

export function UserPlanScreen({ route, navigation }) {
  const { t, i18n } = useTranslation();
  const { isDarkMode, colors } = useTheme();

  const plan = useMemo(() => {
    const tripData = route.params?.tripData;

    console.log(
      "[UserPlanScreen] Received tripData:",
      JSON.stringify(tripData, null, 2)
    );

    if (!tripData?.itinerary?.data?.content) {
      console.log("[UserPlanScreen] Missing required data structure");
      return null;
    }

    try {
      const travelPlan =
        typeof tripData.itinerary.data.content === "string"
          ? JSON.parse(tripData.itinerary.data.content)
          : tripData.itinerary.data.content;

      console.log(
        "[UserPlanScreen] Parsed travel plan:",
        JSON.stringify(travelPlan, null, 2)
      );

      const tripInfo = travelPlan.TripInfo || {};
      const daysData = travelPlan.Days || [];
      const localInfo = travelPlan.LocalInfo || {};

      const details = [
        { name: "Destination", value: tripInfo.Destination },
        { name: "Duration", value: tripInfo.Duration },
        { name: "Style", value: tripInfo.Style },
        { name: "Budget", value: tripInfo.TotalCost },
      ].filter((item) => item.value);

      return {
        tripId: tripData.id,
        destination: tripInfo.Destination,
        details,
        days: daysData.map((day) => ({
          day: day.DayNumber,
          title: day.DayNumber ? `Day ${day.DayNumber}` : null,
          plan: [
            day.Activities?.Morning && {
              time: "Morning",
              event:
                day.Activities.Morning.Activity &&
                day.Activities.Morning.Description
                  ? `${day.Activities.Morning.Activity} - ${day.Activities.Morning.Description}`
                  : null,
              cost: day.Activities.Morning.Cost,
            },
            day.Activities?.Afternoon && {
              time: "Afternoon",
              event:
                day.Activities.Afternoon.Activity &&
                day.Activities.Afternoon.Description
                  ? `${day.Activities.Afternoon.Activity} - ${day.Activities.Afternoon.Description}`
                  : null,
              cost: day.Activities.Afternoon.Cost,
            },
            day.Activities?.Evening && {
              time: "Evening",
              event:
                day.Activities.Evening.Activity &&
                day.Activities.Evening.Description
                  ? `${day.Activities.Evening.Activity} - ${day.Activities.Evening.Description}`
                  : null,
              cost: day.Activities.Evening.Cost,
            },
          ].filter(Boolean),
          activityCost: day.DailyCost,
          transport: day.Transport,
        })),
        ...(localInfo.Visa && {
          visaRequirements: {
            required: true,
            details: localInfo.Visa,
          },
        }),
        ...(localInfo.Weather && {
          weatherInfo: {
            climate: localInfo.Weather,
          },
        }),
        ...(localInfo.Transport && {
          transportation: {
            gettingAround: localInfo.Transport,
          },
        }),
        ...(localInfo.Health && {
          healthAndSafety: {
            details: localInfo.Health,
          },
        }),
        ...(localInfo.Customs && {
          cultureInsights: typeof localInfo.Customs === 'string' 
            ? { customs: localInfo.Customs } 
            : localInfo.Customs
        }),
      };
    } catch (error) {
      console.error("[UserPlanScreen] Error parsing travel plan:", error);
      Alert.alert(
        t("userPlan.alerts.errorTitle"),
        t("userPlan.alerts.parsingError")
      );
      return null;
    }
  }, [route.params?.tripData, t]);

  const handleShare = async () => {
    if (!plan) return;
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

  const renderDetailItem = (item, index) => {
    if (!item || !item.name || !item.value) return null;
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

  const renderItineraryContent = (days) => {
    if (!Array.isArray(days) || days.length === 0) {
      return (
        <Text style={styles.emptyText}>{t("userPlan.itinerary.empty")}</Text>
      );
    }

    return (
      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <View
            key={`day-${day.day || index}`}
            style={[
              styles.dayContainer,
              index === days.length - 1 && { marginBottom: 0 },
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
                  <View style={styles.timeContainer}>
                    <Text style={styles.planTime}>{item.time}</Text>
                  </View>
                  <View style={styles.eventContainer}>
                    <Text style={styles.planEvent} numberOfLines={0}>
                      {item.event}
                    </Text>
                    {item.cost && (
                      <Text style={styles.costText}>💰 {item.cost}</Text>
                    )}
                  </View>
                </View>
              ))}
              {(day.activityCost || day.transport) && (
                <View style={styles.dayDetailsContainer}>
                  {day.activityCost && (
                    <Text style={styles.dayDetailText}>
                      💰 {day.activityCost}
                    </Text>
                  )}
                  {day.transport && (
                    <Text style={styles.dayDetailText}>🚗 {day.transport}</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderKeyValueContent = (data) => {
    if (!data || typeof data !== "object") return null;

    return (
      <View>
        {Object.entries(data).map(([key, value]) => {
          if (!value) return null;

          return (
            <View key={key} style={styles.keyValueItem}>
              <Text style={styles.keyText}>
                {t(`userPlan.costs.${key.toLowerCase()}`, key)}:
              </Text>
              <Text style={styles.valueText}>{value}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderHealthSafetyContent = (data) => {
    if (!data) return null;

    return (
      <View>
        {typeof data.details === "string" && data.details && (
          <Text style={styles.paragraphText}>{data.details}</Text>
        )}

        {Array.isArray(data.precautions) && data.precautions.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>
              {t("userPlan.health.precautionsLabel")}
            </Text>
            {data.precautions.map((precaution, index) => (
              <Text key={`precaution-${index}`} style={styles.listItem}>
                • {precaution}
              </Text>
            ))}
          </View>
        )}

        {Array.isArray(data.safetyTips) && data.safetyTips.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>
              {t("userPlan.health.safetyTipsLabel")}
            </Text>
            {data.safetyTips.map((tip, index) => (
              <Text key={`tip-${index}`} style={styles.listItem}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

        {data.emergencyContacts &&
          Object.keys(data.emergencyContacts).length > 0 && (
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>
                {t("userPlan.health.emergencyContactsLabel")}
              </Text>
              {Object.entries(data.emergencyContacts)
                .filter(([_, value]) => value)
                .map(([key, value]) => (
                  <View key={`contact-${key}`} style={styles.keyValueItem}>
                    <Text style={styles.keyText}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
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

  const renderCultureContent = (data) => {
    if (!data) return null;

    if (typeof data === "string") {
      return <Text style={styles.paragraphText}>{data}</Text>;
    }

    if (data.customs && typeof data.customs === "string") {
      return <Text style={styles.paragraphText}>{data.customs}</Text>;
    }

    const { etiquette, dressCode, communication, keyCustoms, notes } = data;
    return (
      <View>
        {etiquette && (
          <View style={styles.cultureSectionItem}>
            <Text style={styles.sectionTitle}>{t("userPlan.culture.etiquetteLabel")}</Text>
            <Text style={styles.paragraphText}>{etiquette}</Text>
          </View>
        )}
        
        {dressCode && (
          <View style={styles.cultureSectionItem}>
            <Text style={styles.sectionTitle}>{t("userPlan.culture.dressCodeLabel")}</Text>
            <Text style={styles.paragraphText}>{dressCode}</Text>
          </View>
        )}
        
        {communication && (
          <View style={styles.cultureSectionItem}>
            <Text style={styles.sectionTitle}>{t("userPlan.culture.communicationLabel")}</Text>
            <Text style={styles.paragraphText}>{communication}</Text>
          </View>
        )}
        
        {Array.isArray(keyCustoms) && keyCustoms.length > 0 && (
          <View style={styles.cultureSectionItem}>
            <Text style={styles.sectionTitle}>{t("userPlan.culture.keyCustomsLabel")}</Text>
            {keyCustoms.map((custom, index) => (
              <Text key={index} style={styles.listItem}>• {custom}</Text>
            ))}
          </View>
        )}
        
        {notes && (
          <View style={styles.cultureSectionItem}>
            <Text style={styles.sectionTitle}>{t("userPlan.culture.notesLabel")}</Text>
            <Text style={styles.paragraphText}>{notes}</Text>
          </View>
        )}
      </View>
    );
  };

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

        <View style={styles.loadingHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={isDarkMode ? colors.text : "#374151"}
            />
          </TouchableOpacity>
          <Text style={[styles.loadingTitle, isDarkMode && { color: colors.text }]}>
            {t("plan.title", "Your Plan")}
          </Text>
          <View style={styles.placeholderButton} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={[styles.loadingText, isDarkMode && { color: colors.text }]}>
            {t("userPlan.loading")}
          </Text>
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
          accessibilityRole="button"
          accessibilityLabel={t("accessibility.backButton", "Go back")}
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
        <TouchableOpacity 
          onPress={handleShare} 
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={t("accessibility.shareButton", "Share Plan")}
        >
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
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
      >
        <View
          style={[
            styles.destinationCard,
            isDarkMode && { backgroundColor: colors.card },
          ]}
        >
          <Text style={styles.destinationTitle}>
            {plan.destination || t("userPlan.defaultDestination")}
          </Text>
          
          <View style={styles.detailsGrid}>
            {plan.details.map(renderDetailItem)}
          </View>
        </View>

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

        {renderAccordionSection(
          "userPlan.sections.itinerary",
          sectionIcons.dailyItinerary,
          plan.days,
          renderItineraryContent
        )}

        {renderAccordionSection(
          "userPlan.sections.currency",
          sectionIcons.currencyInfo,
          plan.currencyInfo,
          renderKeyValueContent
        )}

        {renderAccordionSection(
          "userPlan.sections.health",
          sectionIcons.healthAndSafety,
          plan.healthAndSafety,
          renderHealthSafetyContent
        )}

        {renderAccordionSection(
          "userPlan.sections.transportation",
          sectionIcons.transportation,
          plan.transportation,
          renderTransportationContent
        )}

        {renderAccordionSection(
          "userPlan.sections.language",
          sectionIcons.languageBasics,
          plan.languageBasics,
          renderLanguageBasicsContent
        )}

        {renderAccordionSection(
          "userPlan.sections.weather",
          sectionIcons.weatherInfo,
          plan.weatherInfo,
          renderWeatherContent
        )}

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

        {renderAccordionSection(
          "userPlan.sections.culture",
          sectionIcons.cultureInsights,
          plan.cultureInsights,
          renderCultureContent
        )}

        {renderAccordionSection(
          "userPlan.sections.events",
          sectionIcons.nearbyEvents,
          plan.nearbyEvents,
          (data) => (
            <NearbyEvents events={data} />
          )
        )}
      </ScrollView>

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
          style={styles.nextButton}
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={t("accessibility.homeButton", "Go to home")}
        >
          <Text style={styles.nextButtonText}>
            {t("userPlan.homeButton", "Home")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    flex: 1,
    marginHorizontal: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(241, 245, 249, 0.8)",
  },
  destinationCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    padding: 20,
  },
  destinationTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0EA5E9",
    textAlign: "center",
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#F8FAFC",
  },
  accordionIcon: {
    marginRight: 16,
    width: 28,
    height: 28,
    textAlign: "center",
    backgroundColor: "#E0F2FE",
    borderRadius: 14,
    lineHeight: 28,
    overflow: "hidden",
  },
  accordionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0F172A",
    flex: 1,
    letterSpacing: 0.3,
  },
  accordionContent: {
    padding: 20,
    backgroundColor: "#FFF",
  },
  daysContainer: {
    width: "100%",
    paddingBottom: 0,
  },
  dayContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dayTitleContainer: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  timeContainer: {
    backgroundColor: "#E0F2FE",
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
  },
  planTime: {
    fontSize: 15,
    color: "#0284C7",
    fontWeight: "600",
    textAlign: "center",
  },
  eventContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: "space-between",
  },
  planItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  planEvent: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 22,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
    fontWeight: "500",
  },
  costText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    fontStyle: "italic",
  },
  dayDetailsContainer: {
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  dayDetailText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 6,
    fontWeight: "500",
  },
  keyValueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  keyText: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "600",
    marginRight: 12,
  },
  valueText: {
    fontSize: 15,
    color: "#334155",
    textAlign: "right",
    flex: 1,
    flexWrap: "wrap",
    paddingLeft: 8,
    fontWeight: "400",
  },
  sectionBlock: {
    marginTop: 10,
    marginBottom: 12,
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  listItem: {
    fontSize: 15,
    color: "#334155",
    marginBottom: 6,
    lineHeight: 20,
    paddingLeft: 8,
  },
  paragraphText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 22,
    paddingVertical: 12,
    fontWeight: "400",
  },
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
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0EA5E9",
    paddingVertical: 16,
    borderRadius: 12,
    height: 56,
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  errorCard: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderColor: "#FEF3C7",
    backgroundColor: "#FFFBEB",
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 70,
  },
  scrollViewContent: {
    paddingTop: 16,
    paddingBottom: 90,
  },
  loadingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(241, 245, 249, 0.8)",
  },
  placeholderButton: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    fontWeight: "500",
  },
  customsContainer: {
    paddingVertical: 10,
  },
  customItem: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  customText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 22,
    fontWeight: "400",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  iconColor: {
    color: "#64748B",
  },
  cultureSectionItem: {
    padding: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default UserPlanScreen;