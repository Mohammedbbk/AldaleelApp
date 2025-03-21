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
} from 'react-native';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';

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

  const handleCreateAdventure = () => {
    const finalTripData = {
      ...fullTripData,
      specialRequirements: selectedRequirements,
      additionalRequirement: additionalRequirement.trim() || null,
      transportationPreference: selectedTransport,
    };
    console.log('Final Trip Data:', finalTripData);
    Alert.alert('Trip Created', 'Your trip data has been compiled successfully!');
    // navigation.navigate('HomePage');
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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        {/* الهيدر */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Trip Details</Text>
          </View>
          <Text style={styles.stepIndicator}>Step 3/3</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} scrollEnabled={false}>
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
              disabled={!isFormValid}
            >
              <View style={styles.createButtonContent}>
                <Text style={styles.createButtonTextLarge}>Create Adventure</Text>
                <Ionicons name="star" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                <Feather name="arrow-up-right" size={20} color="#FFF" style={{ marginLeft: 8 }} />
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
});
