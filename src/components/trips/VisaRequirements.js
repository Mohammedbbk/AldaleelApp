import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function VisaRequirements({ visaData, isLoading, error }) {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="document-text-outline" size={24} color="#0284C7" />
          <Text style={styles.title}>Visa Requirements</Text>
        </View>
        <ActivityIndicator size="small" color="#0284C7" />
      </View>
    );
  }

  if (error || !visaData) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text style={styles.title}>Visa Requirements</Text>
        </View>
        <Text style={styles.errorText}>
          {error || 'Unable to load visa requirements.'}
        </Text>
      </View>
    );
  }

  // flatten both structured and raw
  const raw = typeof visaData === 'string'
    ? visaData
    : visaData.content ?? visaData.additionalInfo ?? '';

  if (raw) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="document-text-outline" size={24} color="#0284C7" />
          <Text style={styles.title}>Visa Requirements</Text>
        </View>
        <Text style={styles.bodyText}>{raw}</Text>
      </View>
    );
  }

  // fully structured object
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="document-text-outline" size={24} color="#0284C7" />
        <Text style={styles.title}>Visa Requirements</Text>
      </View>
      <Text style={styles.label}>Type:</Text>
      <Text style={styles.bodyText}>{visaData.type || 'N/A'}</Text>
      <Text style={styles.label}>Processing Time:</Text>
      <Text style={styles.bodyText}>{visaData.processingTime || 'N/A'}</Text>
      <Text style={styles.label}>Required Documents:</Text>
      {Array.isArray(visaData.requiredDocuments)
        ? visaData.requiredDocuments.map((doc, i) => (
            <View key={i} style={styles.dotRow}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              <Text style={styles.bodyText}>{doc}</Text>
            </View>
          ))
        : <Text style={styles.bodyText}>N/A</Text>
      }
      {visaData.notes && (
        <Text style={styles.notes}>{visaData.notes}</Text>
      )}
    </View>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '600', marginLeft: 8 },
  label: { marginTop: 12, fontSize: 14, fontWeight: '500' },
  bodyText: { fontSize: 14, color: '#374151', marginTop: 4 },
  errorText: { fontSize: 14, color: '#EF4444', marginTop: 4 },
  dotRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  notes: { marginTop: 12, fontStyle: 'italic', color: '#2563EB' },
};