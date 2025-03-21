// TripStyleScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const INTERESTS = [
  { label: 'Culture', emoji: '🏛️' },
  { label: 'Nature', emoji: '🌲' },
  { label: 'Food', emoji: '🍽️' },
  { label: 'Shopping', emoji: '🛍️' },
  { label: 'Adventure', emoji: '🗺️' },
  { label: 'Relaxation', emoji: '🧘‍♂️' },
];

const TRIP_PACES = ['Relaxed', 'Balanced', 'Intense'];

const TripStyleScreen = ({ navigation, route }) => {
  const stepOneData = route.params?.stepOneData || {};

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedTripPace, setSelectedTripPace] = useState('');

  const isFormValid = selectedInterests.length > 0 && selectedTripPace !== '';

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleNextStep = () => {
    if (!isFormValid) {
      Alert.alert('Missing Fields', 'Please select at least one interest and pace.');
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* الهيدر */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Trip Style</Text>
        </View>
        <Text style={styles.stepIndicator}>Step 2/3</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* الاهتمامات */}
        <Text style={styles.sectionTitle}>Choose your interests</Text>
        <View style={styles.interestsContainer}>
          {INTERESTS.map((item) => {
            const isSelected = selectedInterests.includes(item.label);
            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.interestButton,
                  { borderColor: isSelected ? '#FF8C00' : '#00BFFF' },
                ]}
                onPress={() => toggleInterest(item.label)}
              >
                {/* اليسار: الإيموجي والنص */}
                <View style={styles.interestInfo}>
                  <Text style={styles.interestEmoji}>{item.emoji}</Text>
                  <Text style={[styles.interestText, isSelected && styles.selectedInterestText]}>
                    {item.label}
                  </Text>
                </View>
                {/* اليمين: مربّع الاختيار */}
                <View
                  style={[
                    styles.checkbox,
                    { borderColor: isSelected ? '#FF8C00' : '#00BFFF' },
                  ]}
                >
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FF8C00" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* سرعات الرحلة */}
        <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Trip Pace</Text>
        <View style={styles.pacesContainer}>
          {TRIP_PACES.map((pace) => {
            const isSelected = selectedTripPace === pace;
            return (
              <TouchableOpacity
                key={pace}
                style={[
                  styles.paceButton,
                  { borderColor: isSelected ? '#FF8C00' : '#00BFFF' },
                ]}
                onPress={() => setSelectedTripPace(pace)}
              >
                <Text style={[styles.paceText, isSelected && styles.selectedPaceText]}>
                  {pace}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* شريط التنقل السفلي */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('HomePage')}
        >
          <FontAwesome name="home" size={24} color="#333" />
        </TouchableOpacity>
        {/* زر "التالي" يبقى دائماً باللون الأزرق */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextStep}
          disabled={!isFormValid}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TripStyleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  stepIndicator: { fontSize: 16, color: '#FF8C00', fontWeight: '600' },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 16,
  },

  // =========== الاهتمامات ===========
  interestsContainer: {},
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#FFF',
  },
  interestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  interestText: {
    fontSize: 16,
    color: '#000',
  },
  selectedInterestText: {
    fontWeight: '600',
    color: '#000',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },

  // =========== سرعات الرحلة ===========
  pacesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  paceButton: {
    width: '28%',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  paceText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  selectedPaceText: {
    fontWeight: '600',
    color: '#000',
  },

  // =========== شريط التنقل السفلي ===========
  bottomNavigation: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButton: {
    position: 'absolute',
    left: 0,
    width: 60,
    height: 60,
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
  // زر "التالي" يبقى دائمًا باللون الأزرق
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00BFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  
});
