import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accordion } from '../shared/Accordion';
import { ActivityItem } from '../shared/ActivityItem';
import { DetailItem } from '../shared/DetailItem';

export function TravelRecommendations({
  itinerary = [],
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

  return (
    <View style={styles.card}>
      {/* Currency */}
      {currencyInfo && (
        <View style={styles.section}>
          <Accordion title={
            <View style={styles.headerRow}>
              <Ionicons name="cash-outline" size={20} color="#047857" />
              <Text style={styles.sectionTitle}>Currency</Text>
            </View>
          }>
            {currencyInfo.currency && (
              <DetailItem label="Currency" value={currencyInfo.currency} />
            )}
            {currencyInfo.exchangeRates && Object.keys(currencyInfo.exchangeRates).length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>Exchange Rates</Text>
                {Object.entries(currencyInfo.exchangeRates).map(([k, v], i) => (
                  <DetailItem key={i} label={k} value={v.toString()} />
                ))}
              </View>
            )}
            {currencyInfo.tippingCustoms && (
              <DetailItem label="Tipping Customs" value={currencyInfo.tippingCustoms} />
            )}
            {currencyInfo.paymentMethods && currencyInfo.paymentMethods.length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>Payment Methods</Text>
                {currencyInfo.paymentMethods.map((m, i) => (
                  <Text key={i} style={styles.bodyText}>• {m}</Text>
                ))}
              </View>
            )}
            {(!currencyInfo.currency && !currencyInfo.exchangeRates && !currencyInfo.tippingCustoms && !(currencyInfo.paymentMethods?.length)) && (
              <Text style={styles.bodyText}>No information available</Text>
            )}
          </Accordion>
        </View>
      )}

      {/* Health & Safety */}
      {healthAndSafety && (
        <View style={styles.section}>
          <Accordion title={
            <View style={styles.headerRow}>
              <Ionicons name="medkit-outline" size={20} color="#B91C1C" />
              <Text style={styles.sectionTitle}>Health & Safety</Text>
            </View>
          }>
            {Array.isArray(healthAndSafety.vaccinationsNeeded) && healthAndSafety.vaccinationsNeeded.length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>Vaccinations Needed</Text>
                {healthAndSafety.vaccinationsNeeded.map((v, i) => (
                  <Text key={i} style={styles.bodyText}>• {v}</Text>
                ))}
              </View>
            )}
            {healthAndSafety.healthPrecautions && (
              <DetailItem label="Health Precautions" value={healthAndSafety.healthPrecautions} />
            )}
            {healthAndSafety.emergencyNumbers && Object.keys(healthAndSafety.emergencyNumbers).length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>Emergency Numbers</Text>
                {Object.entries(healthAndSafety.emergencyNumbers).map(([k, num], i) => (
                  <DetailItem key={i} label={k} value={num} />
                ))}
              </View>
            )}
            {Array.isArray(healthAndSafety.safetyTips) && healthAndSafety.safetyTips.length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>Safety Tips</Text>
                {healthAndSafety.safetyTips.map((t, i) => (
                  <Text key={i} style={styles.bodyText}>• {t}</Text>
                ))}
              </View>
            )}
            {(!healthAndSafety.vaccinationsNeeded?.length && !healthAndSafety.healthPrecautions && !healthAndSafety.emergencyNumbers && !healthAndSafety.safetyTips?.length) && (
              <Text style={styles.bodyText}>No information available</Text>
            )}
          </Accordion>
        </View>
      )}

      {/* Transportation */}
      {transportation && (
        <View style={styles.section}>
          <Accordion title={
            <View style={styles.headerRow}>
              <Ionicons name="bus-outline" size={20} color="#1E40AF" />
              <Text style={styles.sectionTitle}>Transportation</Text>
            </View>
          }>
            {Array.isArray(transportation.options) && transportation.options.length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>Options</Text>
                {transportation.options.map((opt, i) => (
                  <Text key={i} style={styles.bodyText}>• {opt}</Text>
                ))}
              </View>
            )}
            {transportation.recommendations && (
              <DetailItem label="Recommendations" value={transportation.recommendations} />
            )}
            {(!transportation.options?.length && !transportation.recommendations) && (
              <Text style={styles.bodyText}>No information available</Text>
            )}
          </Accordion>
        </View>
      )}

      {/* Language */}
      {languageBasics && (
        <View style={styles.section}>
          <Accordion title={
            <View style={styles.headerRow}>
              <Ionicons name="chatbubbles-outline" size={20} color="#9333EA" />
              <Text style={styles.sectionTitle}>Language Basics</Text>
            </View>
          }>
            {languageBasics.officialLanguage && (
              <DetailItem label="Official Language" value={languageBasics.officialLanguage} />
            )}
            {languageBasics.commonPhrases && Object.keys(languageBasics.commonPhrases).length > 0 && (
              <View style={styles.subSection}>
                <Text style={styles.subSectionTitle}>Common Phrases</Text>
                {Object.entries(languageBasics.commonPhrases).map(([k, v], i) => (
                  <DetailItem key={i} label={k} value={v} />
                ))}
              </View>
            )}
            {languageBasics.communicationTips && (
              <DetailItem label="Communication Tips" value={languageBasics.communicationTips} />
            )}
            {(!languageBasics.officialLanguage && !languageBasics.commonPhrases && !languageBasics.communicationTips) && (
              <Text style={styles.bodyText}>No information available</Text>
            )}
          </Accordion>
        </View>
      )}

      {/* Weather */}
      {weatherInfo && (
        <View style={styles.section}>
          <Accordion title={
            <View style={styles.headerRow}>
              <Ionicons name="rainy-outline" size={20} color="#0EA5E9" />
              <Text style={styles.sectionTitle}>Weather</Text>
            </View>
          }>
            {weatherInfo.seasonalPatterns && (
              <DetailItem label="Seasonal Patterns" value={weatherInfo.seasonalPatterns} />
            )}
            {weatherInfo.whatToExpect && (
              <DetailItem label="What to Expect" value={weatherInfo.whatToExpect} />
            )}
            {(!weatherInfo.seasonalPatterns && !weatherInfo.whatToExpect) && (
              <Text style={styles.bodyText}>No information available</Text>
            )}
          </Accordion>
        </View>
      )}

      {/* Daily Itinerary */}
      {Array.isArray(itinerary) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Itinerary</Text>
          {itinerary.map((day, idx) => (
            <View key={idx} style={styles.dayBlock}>
              <Text style={styles.dayTitle}>Day {day.day}</Text>

              {['morning', 'afternoon', 'evening'].map(period => {
                const block = day[period] ?? {};
                const items = Array.isArray(block.activities) ? block.activities : [];
                return (
                  <Accordion
                    key={period}
                    title={`${period.charAt(0).toUpperCase()}${period.slice(1)}`}
                  >
                    {items.length > 0 ? (
                      items.map((act, j) => (
                        <ActivityItem
                          key={j}
                          time={act.time || 'N/A'}
                          name={act.activity || act.name || 'Activity'}
                        />
                      ))
                    ) : (
                      <Text style={styles.bodyText}>No activities</Text>
                    )}
                  </Accordion>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = {
  card: { backgroundColor: '#FFF', borderRadius: 8, padding: 16, marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginLeft: 8, marginBottom: 4 },
  bodyText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  dayBlock: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  dayTitle: { fontSize: 15, fontWeight: '500', marginBottom: 6 },
  subSection: { marginLeft: 24, marginBottom: 8 },
  subSectionTitle: { fontSize: 14, fontWeight: '600', marginLeft: 8, marginBottom: 4 },
};