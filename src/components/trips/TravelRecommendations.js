import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accordion } from '../shared/Accordion';
import { ActivityItem } from '../shared/ActivityItem';
import { DetailItem } from '../shared/DetailItem';

// Define icons for sections (similar to UserPlanScreen)
const sectionIcons = {
  currencyInfo: "cash-outline",
  healthAndSafety: "medkit-outline",
  transportation: "car-sport-outline",
  languageBasics: "language-outline",
  weatherInfo: "partly-sunny-outline",
  dailyItinerary: "map-outline",
};

export function TravelRecommendations({
  itinerary = [], // Expects the processed 'days' array
  currencyInfo,
  healthAndSafety,
  transportation,
  languageBasics,
  weatherInfo,
}) {
  // If nothing at all, early return
  if (
    !currencyInfo &&
    !healthAndSafety &&
    !transportation &&
    !languageBasics &&
    !weatherInfo &&
    (!Array.isArray(itinerary) || itinerary.length === 0)
  ) {
    return null;
  }

  // --- Helper to Render an Accordion Section ---
  const renderAccordionSection = (title, iconName, data, renderContent) => {
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0 && !(data instanceof Array)) || (Array.isArray(data) && data.length === 0)) {
      return null; // Don't render if data is empty or null
    }
    return (
      <View style={styles.sectionContainer}>
        <Accordion 
          title={
            <View style={styles.accordionHeader}>
              <Ionicons name={iconName} size={22} color="#4B5563" style={styles.accordionIcon} />
              <Text style={styles.sectionTitle}>{title}</Text>
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

  // --- Render Functions for Specific Sections ---
  const renderCurrencyInfo = (data) => (
    <>
      {data.currency && <DetailItem label="Currency" value={data.currency} />}
      {data.exchangeRates && <DetailItem label="Exchange Rate" value={data.exchangeRates} />}
      {data.tippingCustoms && <DetailItem label="Tipping" value={data.tippingCustoms} />}
      {Array.isArray(data.paymentMethods) && data.paymentMethods.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Payment Methods:</Text>
          {data.paymentMethods.map((m, i) => <Text key={i} style={styles.listItem}>• {m}</Text>)}
        </View>
      )}
    </>
  );

  const renderHealthSafety = (data) => (
    <>
      {data.vaccinationsNeeded && <DetailItem label="Vaccinations" value={data.vaccinationsNeeded} />}
      {data.healthPrecautions && <DetailItem label="Precautions" value={data.healthPrecautions} />}
      {data.emergencyNumbers && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Emergency Numbers:</Text>
          {Object.entries(data.emergencyNumbers).map(([k, v], i) => <DetailItem key={i} label={k} value={String(v)} />)}
        </View>
      )}
      {Array.isArray(data.safetyTips) && data.safetyTips.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Safety Tips:</Text>
          {data.safetyTips.map((tip, i) => <Text key={i} style={styles.listItem}>• {tip}</Text>)}
        </View>
      )}
    </>
  );
  
  const renderTransportation = (data) => (
    <>
      {Array.isArray(data.gettingAround) && data.gettingAround.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Getting Around:</Text>
          {data.gettingAround.map((tip, i) => <Text key={i} style={styles.listItem}>• {tip}</Text>)}
        </View>
      )}
      {Array.isArray(data.publicTransitOptions) && data.publicTransitOptions.length > 0 && (
         <View style={styles.listSection}>
          <Text style={styles.listTitle}>Public Transit:</Text>
          {data.publicTransitOptions.map((opt, i) => <Text key={i} style={styles.listItem}>• {opt}</Text>)}
        </View>
      )}
       {Array.isArray(data.recommendedTransportationMethods) && data.recommendedTransportationMethods.length > 0 && (
         <View style={styles.listSection}>
          <Text style={styles.listTitle}>Recommended:</Text>
          {data.recommendedTransportationMethods.map((rec, i) => <Text key={i} style={styles.listItem}>• {rec}</Text>)}
        </View>
      )}
    </>
  );
  
  const renderLanguageBasics = (data) => (
    <>
      {data.officialLanguage && <DetailItem label="Official Language" value={data.officialLanguage} />}
      {data.commonUsefulPhrases && (
         <View style={styles.listSection}>
          <Text style={styles.listTitle}>Common Phrases:</Text>
          {Object.entries(data.commonUsefulPhrases).map(([k, v], i) => <DetailItem key={i} label={k} value={String(v)} />)}
        </View>
      )}
      {data.communicationTips && <DetailItem label="Tips" value={data.communicationTips} isMultiline={true} />}
    </>
  );
  
  const renderWeatherInfo = (data) => (
    <>
      {data.seasonalWeatherPatterns && <DetailItem label="Seasonal Patterns" value={data.seasonalWeatherPatterns} isMultiline={true} />}
      {data.whatToExpect && <DetailItem label="What to Expect" value={data.whatToExpect} isMultiline={true} />}
    </>
  );
  
  const renderDailyItinerary = (days) => (
    days.map((day, index) => (
      <View key={`day-${index}`} style={styles.dayContainer}>
        <Accordion 
          title={
            <Text style={styles.dayTitle}>{day.title || `Day ${day.day}`}</Text>
          }
        >
          {/* Render Morning, Afternoon, Evening sections */}
          {[ 'morning', 'afternoon', 'evening' ].map(period => {
            const periodData = day[period];
            if (!periodData || Object.keys(periodData).length === 0) return null; // Skip empty periods
            
            return (
              <View key={period} style={styles.periodContainer}>
                <Text style={styles.periodTitle}>{period.charAt(0).toUpperCase() + period.slice(1)}</Text>
                {periodData.timing && <Text style={styles.periodDetailText}><Text style={styles.detailLabel}>Time:</Text> {periodData.timing}</Text>}
                {periodData.activities && <Text style={styles.periodDetailText}><Text style={styles.detailLabel}>Activities:</Text> {periodData.activities}</Text>}
                {periodData.estimatedCosts && <Text style={styles.periodDetailText}><Text style={styles.detailLabel}>Est. Cost:</Text> {periodData.estimatedCosts}</Text>}
                {periodData.transportationOptions && <Text style={styles.periodDetailText}><Text style={styles.detailLabel}>Transport:</Text> {periodData.transportationOptions}</Text>}
                {periodData.mealRecommendations && <Text style={styles.periodDetailText}><Text style={styles.detailLabel}>Meals:</Text> {periodData.mealRecommendations}</Text>}
                {periodData.accommodationSuggestions && <Text style={styles.periodDetailText}><Text style={styles.detailLabel}>Accommodation:</Text> {periodData.accommodationSuggestions}</Text>}
              </View>
            );
          })}
        </Accordion>
      </View>
    ))
  );

  // --- Main Component Render ---
  return (
    <View style={styles.container}>
      {renderAccordionSection("Daily Itinerary", sectionIcons.dailyItinerary, itinerary, renderDailyItinerary)}
      {renderAccordionSection("Currency", sectionIcons.currencyInfo, currencyInfo, renderCurrencyInfo)}
      {renderAccordionSection("Health & Safety", sectionIcons.healthAndSafety, healthAndSafety, renderHealthSafety)}
      {renderAccordionSection("Transportation", sectionIcons.transportation, transportation, renderTransportation)}
      {renderAccordionSection("Language Basics", sectionIcons.languageBasics, languageBasics, renderLanguageBasics)}
      {renderAccordionSection("Weather", sectionIcons.weatherInfo, weatherInfo, renderWeatherInfo)}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // Add margin between recommendation sections and other accordions
  },
  sectionContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12, // Space between accordion sections
    overflow: 'hidden', // Ensures border radius is applied to content
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12, // Adjusted padding
    paddingHorizontal: 16,
  },
  accordionIcon: {
    marginRight: 12, // Increased margin
  },
  sectionTitle: {
    fontSize: 17, // Slightly larger title
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16, // Add padding at the bottom
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', // Lighter separator line
  },
  listSection: {
    marginTop: 8,
    marginBottom: 4,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  listItem: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8, // Indent list items
    lineHeight: 20,
  },
  dayContainer: {
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 8, // Add padding for day title accordion
  },
  periodContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 6,
  },
  periodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  periodDetailText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
    lineHeight: 18,
  },
  detailLabel: { 
    fontWeight: '500', 
    color: '#1F2937', 
  }, 
});