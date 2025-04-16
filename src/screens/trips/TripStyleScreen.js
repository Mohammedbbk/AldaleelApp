// TripStyleScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  useColorScheme,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import i18n from '../../config/appConfig';
import { INTERESTS, TRIP_PACES } from '../../config/tripConstants';

export function TripStyleScreen({ navigation, route }) {
  const stepOneData = route.params?.stepOneData || {};
  const colorScheme = useColorScheme();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedTripPace, setSelectedTripPace] = useState('');
  const [validationError, setValidationError] = useState('');

  const isFormValid = selectedInterests.length > 0 && selectedTripPace !== '';

  const toggleInterest = (interest) => {
    setValidationError('');
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNextStep = () => {
    if (!isFormValid) {
      setValidationError(i18n.t('tripStyle.validation.missingFields'));
      return;
    }
    const mergedData = {
      ...stepOneData,
      interests: selectedInterests,
      tripPace: selectedTripPace,
    };
    navigation.navigate('TripDetailsScreen', { fullTripData: mergedData });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5 bg-white dark:bg-gray-900">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 justify-center items-center"
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={28} color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {i18n.t('tripStyle.title')}
          </Text>
        </View>
        <Text className="text-base text-orange-500 font-semibold">
          {i18n.t('tripStyle.stepIndicator')}
        </Text>
      </View>

      <ScrollView className="px-5 pb-24">
        {/* Interests Section */}
        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mt-5">
          {i18n.t('tripStyle.interests.title')}
        </Text>
        {validationError && (
          <Text className="text-red-500 mb-4">{validationError}</Text>
        )}
        <View className="space-y-3">
          {INTERESTS.map((item) => {
            const isSelected = selectedInterests.includes(item.value);
            return (
              <TouchableOpacity
                key={item.value}
                className={`flex-row items-center justify-between p-4 rounded-lg border-2 ${isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-900' : 'border-blue-400 dark:border-blue-600'}`}
                onPress={() => toggleInterest(item.value)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={i18n.t(`tripStyle.interests.${item.value}`)}
              >
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{item.emoji}</Text>
                  <Text className={`text-base ${isSelected ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {i18n.t(`tripStyle.interests.${item.value}`)}
                  </Text>
                </View>
                <View className={`w-6 h-6 rounded border-2 items-center justify-center ${isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-900' : 'border-blue-400 dark:border-blue-600'}`}>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FF8C00" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Trip Pace Section */}
        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mt-10">
          {i18n.t('tripStyle.pace.title')}
        </Text>
        <View className="flex-row justify-between">
          {TRIP_PACES.map((pace) => {
            const isSelected = selectedTripPace === pace.value;
            return (
              <TouchableOpacity
                key={pace.value}
                className={`flex-1 mx-2 py-4 rounded-full border-2 items-center ${isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-900' : 'border-blue-400 dark:border-blue-600'}`}
                onPress={() => {
                  setValidationError('');
                  setSelectedTripPace(pace.value);
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={i18n.t(`tripStyle.pace.${pace.value}`)}
              >
                <Text className={`text-base ${isSelected ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  {i18n.t(`tripStyle.pace.${pace.value}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-8 left-5 right-5 flex-row items-center justify-center">
        <TouchableOpacity
          className="absolute left-0 w-15 h-15 rounded-full bg-gray-100 dark:bg-gray-800 justify-center items-center"
          onPress={() => navigation.navigate('HomePage')}
          accessibilityRole="button"
          accessibilityLabel="Go to home"
        >
          <FontAwesome name="home" size={24} color={colorScheme === 'dark' ? '#fff' : '#333'} />
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-row items-center justify-center px-8 py-4 rounded-full ${isFormValid ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
          onPress={handleNextStep}
          disabled={!isFormValid}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isFormValid }}
          accessibilityLabel={i18n.t('tripStyle.buttons.next')}
        >
          <Text className="text-white font-medium mr-2">
            {i18n.t('tripStyle.buttons.next')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Add default export at the end of the file
export default TripStyleScreen;
