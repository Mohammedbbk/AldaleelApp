import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function CultureInsights({ cultureData, isLoading, error }) {
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

  // flatten nested content / additionalInfo
  const raw =
    cultureData?.content ??
    cultureData?.additionalInfo ??
    '';

  if (error || !raw) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text style={styles.title}>Cultural Insights</Text>
        </View>
        <Text style={styles.errorText}>
          {error || 'Unable to load cultural insights.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="earth-outline" size={24} color="#9333EA" />
        <Text style={styles.title}>Cultural Insights</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <Text style={styles.bodyText}>{raw}</Text>
      </ScrollView>
      {cultureData?.source && (
        <Text style={styles.source}>Source: {cultureData.source}</Text>
      )}
    </View>
  );
}

const styles = {
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  scroll: { maxHeight: 180, marginBottom: 8 },
  bodyText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  source: { fontSize: 12, color: '#6B7280', textAlign: 'right' },
  errorText: { fontSize: 14, color: '#EF4444' },
};