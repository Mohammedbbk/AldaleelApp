// TripDetailsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { AI_RESPONSE } from '../config/AiResponse';

const API_BASE_URL = 'https://aldaleelapp-mcp.onrender.com';
// Add timeout duration for API requests (in milliseconds)
const API_TIMEOUT = 120000; // 2 minutes to account for cold start

// Define the fetchWithTimeout function
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

// أمثلة على المتطلبات الخاصة
const SPECIAL_REQUIREMENTS = [
  { label: 'Halal Food Required', value: 'halal' },
  { label: 'Wheelchair Accessible', value: 'wheelchair' },
  { label: 'Kid-Friendly', value: 'kidFriendly' },
  { label: 'Pet-Friendly', value: 'petFriendly' },
];

// خيارات المواصلات
const TRANSPORTATION_OPTIONS = [
  { label: 'Public Transport', value: 'publicTransport' },
  { label: 'Private Car', value: 'privateCar' },
  { label: 'Walking/Biking', value: 'walkingBiking' },
  { label: 'Mix of all', value: 'mix' },
];

const { width } = Dimensions.get('window');

const TripDetailsScreen = ({ route, navigation }) => {
  const fullTripData = route.params?.fullTripData || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0); // Add missing state
  const [loadingMessage, setLoadingMessage] = useState(''); // Add missing state

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

  const isFormValid = true; // لا يوجد شرط إجباري هنا

  const handleCreateAdventure = async () => {
    setLoading(true);
    setError('');
    setRetryCount(0);

    try {
      const finalTripData = {
        ...fullTripData,
        specialRequirements: selectedRequirements,
        additionalRequirement: additionalRequirement.trim() || null,
        transportationPreference: selectedTransport,
      };

      // Get visa requirements
      setLoadingMessage('Fetching visa requirements...');
      let visaData;
      try {
        visaData = await fetchWithTimeout(`${API_BASE_URL}/visa-requirements`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nationality: finalTripData.nationality || 'Unknown',
            destination: finalTripData.destination || 'Unknown',
          }),
        });
        finalTripData.visaRequirements = visaData;
      } catch (err) {
        console.warn('Visa requirements fetch failed:', err.message);
        // Continue without visa data
      }

      // Get travel recommendations from OpenAI
      setLoadingMessage('Generating travel recommendations...\nThis may take a minute if the server is starting up.');
      let aiData;
      try {
        aiData = await fetchWithTimeout(`${API_BASE_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination: finalTripData.destination,
            days: finalTripData.duration,
            budget: finalTripData.budget,
            interests: finalTripData.interests,
            userCountry: finalTripData.nationality,
            travelDates: `${finalTripData.startDate} to ${finalTripData.endDate}`,
            travelStyle: finalTripData.travelStyle,
          }),
        });
        
        // Update the AI_RESPONSE with the generated plan
        AI_RESPONSE.updatePlan(aiData);
      } catch (err) {
        console.warn('AI recommendations fetch failed:', err.message);
        // Continue without AI data or use fallback data
        // You could set a flag to show a warning to the user
        finalTripData.aiGenerationFailed = true;
      }
      
      // Get events near destination
      setLoadingMessage('Finding events near your destination...');
      let eventsData;
      try {
        eventsData = await fetchWithTimeout(`${API_BASE_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: finalTripData.destination,
            startDate: finalTripData.startDate,
            endDate: finalTripData.endDate,
          }),
        });
        finalTripData.nearbyEvents = eventsData;
      } catch (err) {
        console.warn('Events fetch failed:', err.message);
        // Continue without events data
      }

      console.log('Final Trip Data:', finalTripData);
      Alert.alert(
        'Trip Created',
        'Your adventure has been created successfully! Check your itinerary for details.',
        [{ text: 'OK', onPress: () => navigation.navigate('UserPlanScreen', { tripData: finalTripData }) }]
      );
    } catch (err) {
      console.error('Trip creation error:', err);
      setError(err.message);
      
      if (retryCount < 2 && (err.message.includes('timed out') || err.message.includes('Failed to fetch'))) {
        setRetryCount(retryCount + 1);
        Alert.alert(
          'Server Starting Up',
          'Our server may be starting up after inactivity. Would you like to retry?',
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
            { text: 'Retry', onPress: () => handleCreateAdventure() }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to create trip. Please try again later.');
        setLoading(false);
      }
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  const handleStartFresh = () => {
    Alert.alert(
      'Start Fresh',
      'This will clear all trip data and take you back to step 1.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            navigation.popToTop();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleGoHome = () => {
    navigation.navigate('HomePage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Trip Details</Text>
          </View>
          <Text style={styles.stepIndicator}>Step 3/3</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} scrollEnabled={!loading}>
          {/* Special Requirements */}
          <Text style={styles.sectionTitle}>Special Requirements</Text>
          <View style={{ marginBottom: 20 }}>
            {SPECIAL_REQUIREMENTS.map((item) => {
              const isSelected = selectedRequirements.includes(item.value);
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.row, styles.checkRow]}
                  onPress={() => toggleRequirement(item.value)}
                >
                  <View style={[styles.checkBox, isSelected && styles.checkBoxSelected]} />
                  <Text style={styles.labelText}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}

            {/* حقل نصي إضافي */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputField}
                placeholder="Enter more ..."
                placeholderTextColor="#999"
                value={additionalRequirement}
                onChangeText={setAdditionalRequirement}
              />
            </View>
          </View>

          {/* Transportation Preference */}
          <Text style={styles.sectionTitle}>Transportation Preference</Text>
          <View style={{ marginBottom: 20 }}>
            {TRANSPORTATION_OPTIONS.map((option) => {
              const isSelected = selectedTransport.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.row, styles.checkRow]}
                  onPress={() => toggleTransport(option.value)}
                >
                  <View style={[styles.checkBox, isSelected && styles.checkBoxSelected]} />
                  <Text style={styles.labelText}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* زر Create Adventure تحت الاختيارات */}
          <View style={{ marginBottom: 40 }}>
            <TouchableOpacity
              style={[styles.createButtonLarge, !isFormValid && styles.disabledCreateButton]}
              onPress={handleCreateAdventure}
              disabled={loading || !isFormValid}
            >
              <View style={styles.createButtonContent}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#FFF" size="small" />
                    <Text style={styles.loadingText}>{loadingMessage}</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.createButtonTextLarge}>Create Adventure</Text>
                    <Ionicons name="star" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    <Feather name="arrow-up-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* الأزرار السفلية تتحرك مع الصفحة */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity style={styles.startFreshButton} onPress={handleStartFresh}>
              <Text style={styles.startFreshText}>Start Fresh ↗</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
              <FontAwesome name="home" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TripDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  stepIndicator: {
    fontSize: 16,
    color: '#FF8C00',
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkRow: {
    // لتوسيع مساحة اللمس
  },
  checkBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#00BFFF',
    borderRadius: 4,
    marginRight: 10,
  },
  checkBoxSelected: {
    borderColor: '#FF8C00',
    backgroundColor: 'rgba(255, 140, 0, 0.1)',
  },
  labelText: {
    fontSize: 16,
    color: '#555',
  },
  inputContainer: {
    marginTop: 10,
  },
  inputField: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  createButtonLarge: {
    backgroundColor: '#00BFFF',
    borderRadius: 30,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  createButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonTextLarge: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledCreateButton: {
    backgroundColor: '#A9A9A9',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  startFreshButton: {
    borderWidth: 1.5,
    borderColor: '#00BFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  startFreshText: {
    color: '#00BFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  homeButton: {
    position: 'absolute',
    bottom: -5,
    right: 150,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  loadingContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loadingText: {
    color: '#FFF',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});
