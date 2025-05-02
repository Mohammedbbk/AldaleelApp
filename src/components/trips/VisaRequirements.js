import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
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

  const visaType = visaData.visaType;
  const requirements = visaData.requirements;
  const applicationProcess = visaData.applicationProcess;
  const fees = visaData.fees;
  const otherInfo = visaData.content || visaData.notes || visaData.details || '';

  const hasAnyData = visaType || (Array.isArray(requirements) && requirements.length > 0) || applicationProcess || fees || otherInfo;

  if (!hasAnyData) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="document-text-outline" size={24} color="#0284C7" />
          <Text style={styles.title}>Visa Requirements</Text>
        </View>
        <Text style={styles.bodyText}>No specific visa details available for this destination.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="document-text-outline" size={24} color="#0284C7" />
        <Text style={styles.title}>Visa Requirements</Text>
      </View>

      {visaType && (
        <>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.bodyText}>{visaType}</Text>
        </>
      )}

      {Array.isArray(requirements) && requirements.length > 0 && (
        <>
          <Text style={styles.label}>Requirements:</Text>
          {requirements.map((doc, i) => (
            <View key={i} style={styles.dotRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" style={styles.listIcon}/>
              <Text style={[styles.bodyText, styles.listItemText]}>{doc}</Text>
            </View>
          ))}
        </>
      )}

      {applicationProcess?.steps && Array.isArray(applicationProcess.steps) && applicationProcess.steps.length > 0 && (
        <>
          <Text style={styles.label}>Application Process:</Text>
          {applicationProcess.steps.map((step, i) => (
            <View key={i} style={styles.dotRow}>
              <Text style={styles.stepNumber}>{i + 1}.</Text>
              <Text style={[styles.bodyText, styles.listItemText]}>{step}</Text>
            </View>
          ))}
        </>
      )}

      {fees && typeof fees === 'object' ? (
        <>
          <Text style={styles.label}>Fees:</Text>
          {fees.visaFee && (
             <Text style={styles.bodyText}>- Visa Fee: {fees.visaFee}</Text>
          )}
          {fees.serviceCharge && (
             <Text style={styles.bodyText}>- Service Charge: {fees.serviceCharge}</Text>
          )}
          {fees.processingFee && (
             <Text style={styles.bodyText}>- Processing Fee: {fees.processingFee}</Text>
          )}
          {fees.expeditedFee && (
             <Text style={styles.bodyText}>- Expedited Processing: {fees.expeditedFee}</Text>
          )}
          {!fees.visaFee && !fees.serviceCharge && !fees.processingFee && !fees.expeditedFee && 
           Object.keys(fees).length > 0 && (
             Object.keys(fees).map((key, i) => (
               <Text key={i} style={styles.bodyText}>
                 - {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: {fees[key]}
               </Text>
             ))
           )}
        </>
      ) : fees ? (
        <>
           <Text style={styles.label}>Fees:</Text>
           <Text style={styles.bodyText}>{fees}</Text>
        </>
      ) : null}

      {otherInfo ? (
        <Text style={[styles.bodyText, styles.notes]}>{otherInfo}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor:'#FFF', padding:16, borderRadius:12, marginBottom:16, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.08, shadowRadius:3, elevation:2 },
  errorCard: { borderColor:'#FCA5A5', borderWidth:1 },
  headerRow: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  title: { fontSize:16, fontWeight:'600', marginLeft:8, color:'#1F2937' },
  label: { marginTop:10, marginBottom:4, fontSize:14, fontWeight:'600', color:'#4B5563' },
  bodyText: { fontSize:14, color:'#374151', lineHeight:20 },
  errorText: { fontSize:14, color:'#EF4444', lineHeight:20 },
  dotRow: { flexDirection:'row', alignItems:'flex-start', marginVertical:3, paddingLeft: 4 },
  listIcon: { marginRight:8, marginTop: 2 },
  listItemText: { flex: 1 },
  stepNumber: { marginRight: 8, fontWeight: '600', color: '#4B5563', width: 20 },
  notes: { marginTop:12, fontStyle:'italic', color:'#4B5563', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 }
});