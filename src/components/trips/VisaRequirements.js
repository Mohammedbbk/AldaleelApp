import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function VisaRequirements({ visaData, isLoading, error }) {
  if (isLoading) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="document-text-outline" size={24} className="text-blue-600 mr-2" />
          <Text className="text-lg font-semibold">Visa Requirements</Text>
        </View>
        <ActivityIndicator size="small" color="#0284c7" />
      </View>
    );
  }

  if (error || !visaData) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="alert-circle-outline" size={24} className="text-red-600 mr-2" />
          <Text className="text-lg font-semibold">Visa Information</Text>
        </View>
        <Text className="text-red-600">
          {error || 'Unable to load visa requirements. Please try again later.'}
        </Text>
      </View>
    );
  }

  // Handle both structured and raw string responses
  if (typeof visaData === 'string' || visaData.content) {
    const content = visaData.content || visaData;
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="document-text-outline" size={24} className="text-blue-600 mr-2" />
          <Text className="text-lg font-semibold">Visa Requirements</Text>
        </View>
        <Text className="text-base">{content}</Text>
      </View>
    );
  }

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <View className="flex-row items-center mb-3">
        <Ionicons name="document-text-outline" size={24} className="text-blue-600 mr-2" />
        <Text className="text-lg font-semibold">Visa Requirements</Text>
      </View>
      {/* Visa Type */}
      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-600 mb-1">Type:</Text>
        <Text className="text-base">{visaData.type || 'Not specified'}</Text>
      </View>
      {/* Processing Time */}
      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-600 mb-1">Processing Time:</Text>
        <Text className="text-base">{visaData.processingTime || 'Not specified'}</Text>
      </View>
      {/* Required Documents */}
      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-600 mb-1">Required Documents:</Text>
        {visaData.requiredDocuments && visaData.requiredDocuments.length > 0 ? (
          visaData.requiredDocuments.map((doc, index) => (
            <View key={index} className="flex-row items-center mt-1">
              <Ionicons name="checkmark-circle" size={16} className="text-green-600 mr-2" />
              <Text className="text-base">{doc}</Text>
            </View>
          ))
        ) : (
          <Text className="text-base">No document information available</Text>
        )}
      </View>
      {/* Additional Notes */}
      {visaData.notes && (
        <View className="mt-2 p-3 bg-blue-50 rounded-md">
          <Text className="text-sm text-blue-800">{visaData.notes}</Text>
        </View>
      )}
    </View>
  );
}