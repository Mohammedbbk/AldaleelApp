import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function VisaRequirements({ visaData, isLoading, error }) {
  const displayError = error || visaData?.error;

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

  if (displayError || !visaData) {
    return (
      <View style={[styles.card, displayError && styles.errorCard]}>
        <View style={styles.headerRow}>
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text style={styles.title}>Visa Requirements</Text>
        </View>
        <Text style={styles.errorText}>{displayError || 'Unable to load visa requirements.'}</Text>
      </View>
    );
  }

  if (typeof visaData === 'string') {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="document-text-outline" size={24} color="#0284C7" />
          <Text style={styles.title}>Visa Requirements</Text>
        </View>
        <Text style={styles.bodyText}>{visaData}</Text>
      </View>
    );
  }

  const content = visaData.content ?? visaData.notes ?? '';
  const hasStructured = visaData.type || visaData.processingTime || Array.isArray(visaData.requiredDocuments);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="document-text-outline" size={24} color="#0284C7" />
        <Text style={styles.title}>Visa Requirements</Text>
      </View>

      {hasStructured && (
        <>
          {visaData.type && (
            <>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.bodyText}>{visaData.type}</Text>
            </>
          )}
          {visaData.processingTime && (
            <>
              <Text style={styles.label}>Processing Time:</Text>
              <Text style={styles.bodyText}>{visaData.processingTime}</Text>
            </>
          )}
          {Array.isArray(visaData.requiredDocuments) && (
            <>
              <Text style={styles.label}>Required Documents:</Text>
              {visaData.requiredDocuments.map((doc,i) => (
                <View key={i} style={styles.dotRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" style={styles.listIcon}/>
                  <Text style={styles.bodyText}>{doc}</Text>
                </View>
              ))}
            </>
          )}
        </>
      )}

      {content ? (
        <Text style={[styles.bodyText, hasStructured && styles.notes]}>{content}</Text>
      ) : (
        !hasStructured && <Text style={styles.bodyText}>No specific visa details available.</Text>
      )}
    </View>
  );
}

const styles = {
  card: {
    backgroundColor:'#FFF', padding:16, borderRadius:8, marginBottom:16,
    shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.1, shadowRadius:2, elevation:2,
  },
  errorCard: {
    borderColor:'#FCA5A5', borderWidth:1
  },
  headerRow: {
    flexDirection:'row', alignItems:'center', marginBottom:12
  },
  title: {
    fontSize:16, fontWeight:'600', marginLeft:8, color:'#1F2937'
  },
  label: {
    marginTop:8, marginBottom:2, fontSize:14, fontWeight:'600', color:'#4B5563'
  },
  bodyText: {
    fontSize:14, color:'#374151', lineHeight:20
  },
  errorText: {
    fontSize:14, color:'#EF4444', lineHeight:20
  },
  dotRow: {
    flexDirection:'row', alignItems:'center', marginVertical:4
  },
  listIcon: {
    marginRight:6
  },
  notes: {
    marginTop:12, fontStyle:'italic', color:'#4B5563'
  }
};