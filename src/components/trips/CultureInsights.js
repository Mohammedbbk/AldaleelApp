import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function CultureInsights({ cultureData, isLoading, error }) {
  if (isLoading) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="earth-outline" size={24} className="text-purple-600 mr-2" />
          <Text className="text-lg font-semibold">Cultural Insights</Text>
        </View>
        <ActivityIndicator size="small" color="#9333ea" />
        <Text className="text-sm text-gray-500 mt-1">Fetching cultural information...</Text>
      </View>
    );
  }

  if (error || !cultureData || !cultureData.content) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="alert-circle-outline" size={24} className="text-red-600 mr-2" />
          <Text className="text-lg font-semibold">Cultural Information</Text>
        </View>
        <Text className="text-red-600">
          {error || 'Unable to load cultural insights. Please try again later.'}
        </Text>
      </View>
    );
  }

  // Basic rendering of the content string. Consider parsing Markdown or structured data if the LLM provides it.
  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <View className="flex-row items-center mb-3">
        <Ionicons name="earth-outline" size={24} className="text-purple-600 mr-2" />
        <Text className="text-lg font-semibold">Cultural Insights</Text>
      </View>
      <ScrollView style={{ maxHeight: 300 }}> 
        <Text className="text-base text-gray-700 leading-relaxed">
          {cultureData.content}
        </Text>
      </ScrollView>
      {cultureData.source && (
         <Text className="text-xs text-gray-400 mt-2 text-right">Source: {cultureData.source}</Text>
      )}
    </View>
  );
}