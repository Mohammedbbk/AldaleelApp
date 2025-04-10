import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function NearbyEvents({ eventsData, isLoading, error }) {
  if (isLoading) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={24} className="text-blue-600 mr-2" />
          <Text className="text-lg font-semibold">Nearby Events</Text>
        </View>
        <ActivityIndicator size="small" color="#0284c7" />
      </View>
    );
  }

  if (error || !eventsData) {
    return (
      <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="alert-circle-outline" size={24} className="text-red-600 mr-2" />
          <Text className="text-lg font-semibold">Nearby Events</Text>
        </View>
        <Text className="text-red-600">
          {error || 'Unable to load nearby events. Please try again later.'}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={24} className="text-blue-600 mr-2" />
          <Text className="text-lg font-semibold">Nearby Events</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="-mx-4"
      >
        {eventsData.map((event, index) => (
          <TouchableOpacity 
            key={index}
            className="mx-2 bg-gray-50 rounded-lg overflow-hidden shadow-sm"
            style={{ width: 280 }}
            activeOpacity={0.7}
          >
            <View className="p-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-base font-medium text-gray-800" numberOfLines={1}>
                  {event.name}
                </Text>
                <View className="bg-blue-100 px-2 py-1 rounded">
                  <Text className="text-xs text-blue-800">{event.category}</Text>
                </View>
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="time-outline" size={16} className="text-gray-600 mr-1" />
                <Text className="text-sm text-gray-600">{event.date} • {event.time}</Text>
              </View>

              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} className="text-gray-600 mr-1" />
                <Text className="text-sm text-gray-600" numberOfLines={1}>{event.location}</Text>
              </View>

              {event.description && (
                <Text className="text-sm text-gray-700" numberOfLines={2}>
                  {event.description}
                </Text>
              )}

              {event.price && (
                <View className="mt-2 flex-row items-center">
                  <Ionicons name="pricetag-outline" size={16} className="text-gray-600 mr-1" />
                  <Text className="text-sm font-medium text-gray-800">{event.price}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}