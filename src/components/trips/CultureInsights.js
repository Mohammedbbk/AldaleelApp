import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Helper to render lists or single strings
function renderCultureDetail(label, data) {
  if (!data) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}:</Text>
      {Array.isArray(data) ? (
        data.map((item, index) => (
          <View key={index} style={styles.dotRow}>
            <Ionicons name="ellipse" size={8} color="#9333EA" style={styles.listIcon} />
            <Text style={[styles.bodyText, styles.listItemText]}>{item}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.bodyText}>{data}</Text>
      )}
    </View>
  );
}

export function CultureInsights({ cultureData, isLoading, error }) {
  const displayError = error || cultureData?.error;

  // --- Loading State ---
  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="earth-outline" size={24} color="#9333EA" />
          <Text style={styles.title}>Cultural Insights</Text>
        </View>
        <ActivityIndicator size="small" color="#9333EA" />
      </View>
    );
  }

  // --- Error or No Data State ---
  if (!cultureData || typeof cultureData !== 'object' || Object.keys(cultureData).length === 0 || displayError) {
    return (
      <View style={[styles.card, displayError && styles.errorCard]}>
        <View style={styles.headerRow}>
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text style={styles.title}>Cultural Insights</Text>
        </View>
        <Text style={styles.errorText}>{displayError || 'No specific cultural insights available.'}</Text>
      </View>
    );
  }

  // --- String Fallback (Less likely, keep for robustness) ---
  if (typeof cultureData === 'string') {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="earth-outline" size={24} color="#9333EA" />
          <Text style={styles.title}>Cultural Insights</Text>
        </View>
        <Text style={styles.bodyText}>{cultureData}</Text>
      </View>
    );
  }

  // --- Structured Data Display ---
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="earth-outline" size={24} color="#9333EA" />
        <Text style={styles.title}>Cultural Insights</Text>
      </View>

      <ScrollView style={styles.scroll} nestedScrollEnabled>
        {/* Render specific fields */}
        {renderCultureDetail("Cultural Norms", cultureData.culturalNorms)}
        {renderCultureDetail("Etiquette", cultureData.etiquette)}
        {renderCultureDetail("Dress Code", cultureData.dressCode || cultureData.dressCodes)}
        {renderCultureDetail("Behaviors to Avoid", cultureData.behaviorsToAvoid)}
        {renderCultureDetail("Local Customs", cultureData.localCustoms)}
        {renderCultureDetail("Religious Practices", cultureData.religiousPractices)}
        {renderCultureDetail("Greetings", cultureData.greetings)}
        
        {/* Display content/notes if they exist (fallback for legacy data) */}
        {(cultureData.content || cultureData.notes || cultureData.insights) && (
          <Text style={styles.bodyText}>
            {cultureData.content || cultureData.notes || cultureData.insights}
          </Text>
        )}
      </ScrollView>

      {typeof cultureData === 'object' && cultureData.source && (
        <Text style={styles.source}>Source: {cultureData.source}</Text>
      )}
    </View>
  );
}

// --- Use StyleSheet.create ---
const styles = StyleSheet.create({
  card: { backgroundColor:'#FFF', padding:16, borderRadius:12, marginBottom:16, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.08, shadowRadius:3, elevation:2 },
  errorCard: { borderColor:'#FCA5A5', borderWidth:1 },
  headerRow: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  title: { fontSize:16, fontWeight:'600', marginLeft:8, color:'#1F2937' },
  scroll: { maxHeight: 300 },
  section: { marginBottom: 12 },
  label: { marginBottom:4, fontSize:14, fontWeight:'600', color:'#4B5563' },
  bodyText: { fontSize:14, color:'#374151', lineHeight:20 },
  errorText: { fontSize:14, color:'#EF4444', lineHeight:20 },
  dotRow: { flexDirection:'row', alignItems:'flex-start', marginVertical:3, paddingLeft: 4 },
  listIcon: { marginRight:8, marginTop: 6 },
  listItemText: { flex: 1 },
  source: { fontSize:12, color:'#6B7280', textAlign:'right', marginTop:8 }
});