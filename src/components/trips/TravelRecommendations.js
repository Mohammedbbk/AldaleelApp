import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function TravelRecommendations({ recommendations, isLoading, error }) {
  if (isLoading) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="compass-outline" size={24} className="text-blue-600 mr-2" />
          <Text className="text-lg font-semibold">Travel Recommendations</Text>
        </View>
        <ActivityIndicator size="small" color="#0284c7" />
      </View>
    );
  }

  if (error || !recommendations) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="alert-circle-outline" size={24} className="text-red-600 mr-2" />
          <Text className="text-lg font-semibold">Travel Recommendations</Text>
        </View>
        <Text className="text-red-600">
          {error || 'Unable to load recommendations. Please try again later.'}
        </Text>
      </View>
    );
  }

  // Handle both structured and raw string responses
  if (typeof recommendations === 'string' || recommendations.content || recommendations.additionalInfo) {
    const content = recommendations.additionalInfo || recommendations.content || recommendations;
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="compass-outline" size={24} className="text-blue-600 mr-2" />
          <Text className="text-lg font-semibold">Travel Recommendations</Text>
        </View>
        <Text className="text-base">{content}</Text>
      </View>
    );
  }

  const sections = [
    { title: 'Must-Visit Places', icon: 'location', data: recommendations.places },
    { title: 'Local Tips', icon: 'bulb', data: recommendations.tips },
    { title: 'Cultural Notes', icon: 'people', data: recommendations.culturalNotes },
    { title: 'Safety Tips', icon: 'shield-checkmark', data: recommendations.safetyTips }
  ];

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <View className="flex-row items-center mb-3">
        <Ionicons name="compass-outline" size={24} className="text-blue-600 mr-2" />
        <Text className="text-lg font-semibold">Travel Recommendations</Text>
      </View>
      {sections.map((section, sectionIndex) => (
        section.data && section.data.length > 0 && (
          <View key={sectionIndex} className="mb-4 last:mb-0">
            <View className="flex-row items-center mb-2">
              <Ionicons name={`${section.icon}-outline`} size={20} className="text-gray-600 mr-2" />
              <Text className="text-base font-medium text-gray-800">{section.title}</Text>
            </View>
            {section.data.map((item, index) => (
              <View 
                key={index} 
                className="bg-gray-50 rounded-lg p-3 mb-2 last:mb-0"
              >
                <Text className="text-gray-700">{item}</Text>
              </View>
            ))}
          </View>
        )
      ))}
      {recommendations.additionalInfo && (
        <View className="mt-3 p-3 bg-blue-50 rounded-md">
          <Text className="text-sm text-blue-800">{recommendations.additionalInfo}</Text>
        </View>
      )}
    </View>
  );
}