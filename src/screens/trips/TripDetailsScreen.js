
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import i18n from '../../config/appConfig';
import { SPECIAL_REQUIREMENTS, TRANSPORTATION_OPTIONS } from '../../config/constants';
import { createTrip } from '../../services/tripService';

export function TripDetailsScreen({ route, navigation }) {
  const fullTripData = route.params?.fullTripData || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [additionalRequirement, setAdditionalRequirement] = useState('');
  const [selectedTransport, setSelectedTransport] = useState([]);

  const toggleRequirement = (value) => {
    if (selectedRequirements.includes(value)) {
      setSelectedRequirements(selectedRequirements.filter((item) => item !== value));
    } else {
      setSelectedRequirements([...selectedRequirements, value]);
    }
  };

  const toggleTransport = (value) => {
    if (selectedTransport.includes(value)) {
      setSelectedTransport(selectedTransport.filter((item) => item !== value));
    } else {
      setSelectedTransport([...selectedTransport, value]);
    }
  };

  const handleCreateAdventure = async () => {
    setRetryCount(0);

    try {
      const tripData = {
        ...fullTripData,
        specialRequirements: selectedRequirements,
        additionalRequirement,
        transportationPreference: selectedTransport,
      };

      const finalTripData = await createTrip(tripData, {
        onLoadingChange: setLoading,
        onLoadingMessageChange: setLoadingMessage,
        onError: setError,
        onSuccess: (data) => {
          Alert.alert(
            i18n.t('tripDetails.alerts.success.title'),
            i18n.t('tripDetails.alerts.success.message'),
            [{ text: i18n.t('tripDetails.alerts.success.ok'), onPress: () => navigation.navigate('UserPlanScreen', { tripData: data }) }]
          );
        },
      });

      return finalTripData;
    } catch (err) {
      console.error('Trip creation error:', err);
      
      if (retryCount < 2 && (err.message.includes('timed out') || err.message.includes('Failed to fetch'))) {
        setRetryCount(retryCount + 1);
        Alert.alert(
          i18n.t('tripDetails.alerts.serverStarting.title'),
          i18n.t('tripDetails.alerts.serverStarting.message'),
          [
            { text: i18n.t('tripDetails.alerts.serverStarting.cancel'), style: 'cancel', onPress: () => setLoading(false) },
            { text: i18n.t('tripDetails.alerts.serverStarting.retry'), onPress: () => handleCreateAdventure() }
          ]
        );
      } else {
        Alert.alert(i18n.t('tripDetails.alerts.error.title'), i18n.t('tripDetails.alerts.error.message'));
      }
    }
  };

  const handleStartFresh = () => {
    Alert.alert(
      i18n.t('tripDetails.alerts.startFresh.title'),
      i18n.t('tripDetails.alerts.startFresh.message'),
      [
        { text: i18n.t('tripDetails.alerts.startFresh.cancel'), style: 'cancel' },
        { text: i18n.t('tripDetails.alerts.startFresh.ok'), onPress: () => navigation.popToTop() },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      {error ? <Text className="text-red-500 text-sm text-center mx-5 mb-2">{error}</Text> : null}

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5 bg-white">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-black">{i18n.t('tripDetails.title')}</Text>
          </View>
          <Text className="text-base text-orange-500 font-semibold">{i18n.t('tripDetails.stepIndicator')}</Text>
        </View>

        <ScrollView className="px-5 pb-10" scrollEnabled={!loading}>
          {/* Special Requirements */}
          <Text className="text-2xl font-bold text-neutral-800 mb-4 mt-5">
            {i18n.t('tripDetails.specialRequirements.title')}
          </Text>
          <View className="mb-5">
            {SPECIAL_REQUIREMENTS.map((item) => {
              const isSelected = selectedRequirements.includes(item.value);
              return (
                <TouchableOpacity
                  key={item.value}
                  className="flex-row items-center mb-3.5"
                  onPress={() => toggleRequirement(item.value)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={i18n.t(`tripDetails.specialRequirements.${item.value}`)}
                >
                  <View
                    className={`w-[22px] h-[22px] rounded border-2 mr-2.5 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-sky-500'}`}
                  />
                  <Text className="text-base text-neutral-600">
                    {i18n.t(`tripDetails.specialRequirements.${item.value}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <View className="mt-2.5">
              <TextInput
                className="border-[1.5px] border-gray-200 rounded-lg px-4 py-2.5 text-base text-neutral-800"
                placeholder={i18n.t('tripDetails.specialRequirements.additionalPlaceholder')}
                placeholderTextColor="#999"
                value={additionalRequirement}
                onChangeText={setAdditionalRequirement}
                accessibilityLabel="Additional requirements input"
                accessibilityRole="textbox"
              />
            </View>
          </View>

          {/* Transportation Preference */}
          <Text className="text-2xl font-bold text-neutral-800 mb-4">
            {i18n.t('tripDetails.transportation.title')}
          </Text>
          <View className="mb-5">
            {TRANSPORTATION_OPTIONS.map((option) => {
              const isSelected = selectedTransport.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  className="flex-row items-center mb-3.5"
                  onPress={() => toggleTransport(option.value)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={i18n.t(`tripDetails.transportation.${option.value}`)}
                >
                  <View
                    className={`w-[22px] h-[22px] rounded border-2 mr-2.5 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-sky-500'}`}
                  />
                  <Text className="text-base text-neutral-600">
                    {i18n.t(`tripDetails.transportation.${option.value}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Create Adventure Button */}
          <View className="mb-10">
            <TouchableOpacity
              className={`rounded-full py-4 shadow ${loading ? 'bg-gray-400' : 'bg-sky-500'}`}
              onPress={handleCreateAdventure}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Create adventure"
              accessibilityState={{ disabled: loading }}
            >
              <View className="flex-row justify-center items-center">
                {loading ? (
                  <View className="flex-col items-center justify-center p-2.5">
                    <ActivityIndicator color="#FFF" size="small" />
                    <Text className="text-white mt-2 text-center text-sm">{loadingMessage}</Text>
                  </View>
                ) : (
                  <>
                    <Text className="text-white text-lg font-semibold">
                      {i18n.t('tripDetails.buttons.createAdventure')}
                    </Text>
                    <Ionicons name="star" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    <Feather name="arrow-up-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Buttons */}
          <View className="flex-row items-center justify-between mb-5">
            <TouchableOpacity
              className="border-[1.5px] border-sky-500 rounded-full px-5 py-3"
              onPress={handleStartFresh}
              accessibilityRole="button"
              accessibilityLabel="Start fresh"
            >
              <Text className="text-sky-500 text-sm font-semibold">
                {i18n.t('tripDetails.buttons.startFresh')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="absolute bottom-[-5] right-[150] w-[50] h-[50] rounded-full bg-gray-100 justify-center items-center shadow"
              onPress={() => navigation.navigate('HomePage')}
              accessibilityRole="button"
              accessibilityLabel="Go to home"
            >
              <FontAwesome name="home" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
