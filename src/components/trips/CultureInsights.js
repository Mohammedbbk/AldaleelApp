import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function CultureInsights({ cultureData, isLoading, error }) {
  const displayError = error || cultureData?.error;

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

  if (displayError || !cultureData) {
    return (
      <View style={[styles.card, displayError && styles.errorCard]}>
        <View style={styles.headerRow}>
          <Ionicons name="alert-circle-outline" size={24} color="#EF4444" />
          <Text style={styles.title}>Cultural Insights</Text>
        </View>
        <Text style={styles.errorText}>{displayError || 'Unable to load cultural insights.'}</Text>
      </View>
    );
  }

  // Extract text
  let content = '';
  if (typeof cultureData === 'string') {
    content = cultureData;
  } else {
    content = cultureData.content
           ?? cultureData.insights
           ?? cultureData.additionalInfo
           ?? '';
  }

  if (!content) {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="earth-outline" size={24} color="#9333EA" />
          <Text style={styles.title}>Cultural Insights</Text>
        </View>
        <Text style={styles.bodyText}>No cultural insights available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="earth-outline" size={24} color="#9333EA" />
        <Text style={styles.title}>Cultural Insights</Text>
      </View>
      <ScrollView style={styles.scroll} nestedScrollEnabled>
        <Text style={styles.bodyText}>{content}</Text>
      </ScrollView>
      {typeof cultureData === 'object' && cultureData.source && (
        <Text style={styles.source}>Source: {cultureData.source}</Text>
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
  scroll: {
    maxHeight:180, marginBottom:8
  },
  bodyText: {
    fontSize:14, color:'#374151', lineHeight:20
  },
  source: {
    fontSize:12, color:'#6B7280', textAlign:'right', marginTop:4
  },
  errorText: {
    fontSize:14, color:'#EF4444', lineHeight:20
  },
};