import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome, AntDesign, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MONTHS = [
  ['Jan', 'Feb', 'Mar'],
  ['Apr', 'May', 'Jun'],
  ['Jul', 'Aug', 'Sep'],
  ['Oct', 'Nov', 'Dec'],
];

const YEARS = ['2025', '2026', '2027', '2028'];
const TRAVELER_STYLES = ['Solo', 'Family', 'Friends'];
const BUDGET_LEVELS = ['Economy', 'Moderate', 'Luxury'];

// دالة للمطابقة بين الاسم المختصر والاسم الكامل باستخدام altSpellings
const getMatchingCountry = (countryName, countries) => {
  return countries.find(country =>
    country.name.common.toLowerCase().includes(countryName.toLowerCase()) ||
    (country.altSpellings &&
      country.altSpellings.some(spelling => spelling.toLowerCase() === countryName.toLowerCase()))
  );
};

const CreateTripScreen = ({ navigation, route }) => {
  const initialDestination = route?.params?.selectedDestination || '';

  // حالات النموذج
  const [destination, setDestination] = useState(initialDestination);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedTravelerStyle, setSelectedTravelerStyle] = useState('');
  const [selectedBudgetLevel, setSelectedBudgetLevel] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // حالات البحث
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // قائمة الدول من REST Countries API
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const sortedData = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // عند وجود initialDestination نستخرج اسم الدولة ونحاول مطابقة الاختصار مع الاسم الكامل
  useEffect(() => {
    if (initialDestination && countries.length > 0) {
      const parts = initialDestination.split(',');
      const countryName = parts.length > 1 ? parts[1].trim() : initialDestination.trim();
      const match = getMatchingCountry(countryName, countries);
      if (match) {
        setSelectedPlace(match);
        setDestination(match.name.common);
      }
    }
  }, [initialDestination, countries]);

  useEffect(() => {
    if (
      selectedPlace !== null &&
      selectedMonth !== '' &&
      selectedTravelerStyle !== '' &&
      selectedBudgetLevel !== ''
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [selectedPlace, selectedMonth, selectedTravelerStyle, selectedBudgetLevel]);

  const searchPlaces = (query) => {
    setIsLoading(true);
    setShowSearchResults(true);
    setTimeout(() => {
      let filteredResults;
      if (!query.trim()) {
        filteredResults = countries;
      } else {
        filteredResults = countries.filter((item) =>
          item.name.common.toLowerCase().includes(query.toLowerCase())
        );
      }
      setSearchResults(filteredResults);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchPlaces(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, countries]);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setDestination(place.name.common);
    setSearchQuery('');
    setShowSearchResults(false);
    setShowSearchModal(false);
  };

  const handleNext = () => {
    if (isFormValid) {
      Alert.alert('Success', 'Moving to next step!');
      const tripData = {
        destination: selectedPlace.name.common,
        country: selectedPlace.name.common,
        year: selectedYear,
        month: selectedMonth,
        travelerStyle: selectedTravelerStyle,
        budgetLevel: selectedBudgetLevel,
        countryCode: selectedPlace.cca3,
      };
      console.log('Trip Data:', tripData);

      // ↓↓↓ هنا التعديل: بدلاً من الذهاب لصفحة التفاصيل مباشرة،
      // ننتقل للخطوة الثانية TripStyleScreen مع تمرير بيانات الخطوة الأولى (tripData)
      navigation.navigate('TripStyleScreen', {
        stepOneData: tripData,
      });
    } else {
      Alert.alert('Required Fields', 'Please fill all required fields.');
    }
  };

  const handleBackToHome = () => {
    navigation.navigate('HomePage');
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <View style={styles.modalContent}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00BFFF" />
            <Text style={styles.loadingText}>جاري البحث...</Text>
          </View>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.modalContent}>
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search-off" size={60} color="#CCC" />
            <Text style={styles.noResultsText}>لم يتم العثور على نتائج</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.modalContent}>
        <ScrollView>
          {searchResults.map((item) => (
            <TouchableOpacity
              key={item.cca3}
              style={styles.searchResultItem}
              onPress={() => handleSelectPlace(item)}
            >
              <View style={styles.resultImageContainer}>
                <Image
                  source={{
                    uri: item.flags?.png || 'https://via.placeholder.com/50',
                  }}
                  style={[styles.resultImage, { resizeMode: 'cover' }]}
                />
              </View>
              <View style={styles.resultContent}>
                <Text style={styles.resultName}>{item.name.common}</Text>
                <Text style={styles.resultCountry}>{item.region}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>New Trip</Text>
        </View>
        <Text style={styles.stepIndicator}>Step 1/3</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Where to? Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Where to?</Text>
            <TouchableOpacity
              style={styles.searchContainer}
              onPress={() => {
                setShowSearchModal(true);
                if (!searchQuery.trim()) {
                  setSearchResults(countries);
                }
              }}
            >
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <Text style={selectedPlace ? styles.searchText : styles.searchPlaceholder}>
                {selectedPlace ? selectedPlace.name.common : 'Search Countries'}
              </Text>
            </TouchableOpacity>

            {selectedPlace && (
              <View style={styles.selectedPlaceContainer}>
                <View style={styles.selectedPlaceContent}>
                  <View style={styles.destinationImageContainer}>
                    <Image
                      source={{
                        uri: selectedPlace.flags?.png || 'https://via.placeholder.com/50',
                      }}
                      style={[styles.destinationImage, { resizeMode: 'cover' }]}
                    />
                  </View>
                  <View style={styles.destinationInfo}>
                    <Text style={styles.destinationName}>{selectedPlace.name.common}</Text>
                    <Text style={styles.destinationCountry}>{selectedPlace.region}</Text>
                  </View>
                  <TouchableOpacity style={styles.changeButton} onPress={() => setShowSearchModal(true)}>
                    <Text style={styles.changeButtonText}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* When to? Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>When to?</Text>
            <View style={styles.calendarContainer}>
              <TouchableOpacity style={styles.yearSelector} onPress={() => setShowYearSelector(true)}>
                <Text style={styles.yearText}>{selectedYear}</Text>
                <AntDesign name="down" size={16} color="#999" />
              </TouchableOpacity>

              <View style={styles.monthNavigators}>
                <TouchableOpacity>
                  <Ionicons name="chevron-back" size={24} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="chevron-forward" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.monthsContainer}>
                {MONTHS.map((row, rowIndex) => (
                  <View key={`row-${rowIndex}`} style={styles.monthRow}>
                    {row.map((month) => (
                      <TouchableOpacity
                        key={month}
                        style={[styles.monthButton, selectedMonth === month && styles.selectedMonthButton]}
                        onPress={() => setSelectedMonth(month)}
                      >
                        <Text style={[styles.monthText, selectedMonth === month && styles.selectedMonthText]}>
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Traveler Style Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Traveler Style</Text>
            <View style={styles.optionsContainer}>
              {TRAVELER_STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[styles.optionButton, selectedTravelerStyle === style && styles.selectedOptionButton]}
                  onPress={() => setSelectedTravelerStyle(style)}
                >
                  <Text style={[styles.optionText, selectedTravelerStyle === style && styles.selectedOptionText]}>
                    {style}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget Level Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Budget Level</Text>
            <View style={styles.optionsContainer}>
              {BUDGET_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.optionButton, selectedBudgetLevel === level && styles.selectedOptionButton]}
                  onPress={() => setSelectedBudgetLevel(level)}
                >
                  <Text style={[styles.optionText, selectedBudgetLevel === level && styles.selectedOptionText]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* مودال البحث */}
      <Modal
        visible={showSearchModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowSearchModal(false);
                setSearchQuery('');
              }}
              style={styles.closeModalButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.modalSearchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Search Countries"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {renderSearchResults()}
        </SafeAreaView>
      </Modal>

      {/* مودال اختيار السنة */}
      <Modal
        transparent={true}
        visible={showYearSelector}
        animationType="fade"
        onRequestClose={() => setShowYearSelector(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearSelector(false)}
        >
          <View style={styles.yearPickerContainer}>
            <View style={styles.yearPickerHeader}>
              <Text style={styles.yearPickerTitle}>Select Year</Text>
              <TouchableOpacity onPress={() => setShowYearSelector(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {YEARS.map((year) => (
              <TouchableOpacity
                key={year}
                style={[styles.yearPickerItem, selectedYear === year && styles.selectedYearItem]}
                onPress={() => {
                  setSelectedYear(year);
                  setShowYearSelector(false);
                }}
              >
                <Text style={[styles.yearPickerText, selectedYear === year && styles.selectedYearText]}>
                  {year}
                </Text>
                {selectedYear === year && <Ionicons name="checkmark" size={20} color="#00BFFF" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
          <FontAwesome name="home" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !isFormValid && styles.disabledNextButton]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    zIndex: 10,
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
  sectionContainer: { paddingHorizontal: 20, marginBottom: 24, position: 'relative' },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchPlaceholder: { flex: 1, fontSize: 16, color: '#999' },
  searchText: { flex: 1, fontSize: 16, color: '#333' },
  selectedPlaceContainer: { marginTop: 16, backgroundColor: '#F8F8F8', borderRadius: 12, padding: 12 },
  selectedPlaceContent: { flexDirection: 'row', alignItems: 'center' },
  destinationImageContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0E0E0', overflow: 'hidden' },
  destinationImage: { width: '100%', height: '100%' },
  destinationInfo: { flex: 1, marginLeft: 12 },
  destinationName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  destinationCountry: { fontSize: 14, color: '#666', marginTop: 2 },
  changeButton: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, borderWidth: 1, borderColor: '#00BFFF' },
  changeButtonText: { color: '#00BFFF', fontSize: 14, fontWeight: '500' },
  calendarContainer: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, padding: 16 },
  yearSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 10 },
  yearText: { fontSize: 18, color: '#555' },
  monthNavigators: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  monthsContainer: { marginTop: 10 },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  monthButton: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 20 },
  selectedMonthButton: { backgroundColor: '#00BFFF' },
  monthText: { fontSize: 16, color: '#555' },
  selectedMonthText: { color: '#FFF', fontWeight: '600' },
  optionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  optionButton: { flex: 1, marginHorizontal: 5, borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 25, paddingVertical: 15, alignItems: 'center' },
  selectedOptionButton: { borderColor: '#00BFFF', backgroundColor: 'rgba(0, 191, 255, 0.05)' },
  optionText: { fontSize: 16, color: '#555', fontWeight: '500' },
  selectedOptionText: { color: '#00BFFF', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  yearPickerContainer: { width: '80%', backgroundColor: '#FFF', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  yearPickerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  yearPickerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  yearPickerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  selectedYearItem: { backgroundColor: 'rgba(0, 191, 255, 0.05)' },
  yearPickerText: { fontSize: 16, color: '#333' },
  selectedYearText: { color: '#00BFFF', fontWeight: '600' },
  // تعديل الستايل لزر التنقل السفلي
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
  disabledNextButton: { backgroundColor: '#B0E0E6' },
  nextButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600', marginRight: 5 },
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  closeModalButton: { padding: 5, marginRight: 10 },
  modalSearchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  modalSearchInput: { flex: 1, fontSize: 16, color: '#333', marginLeft: 5, height: 40 },
  modalContent: { flex: 1, paddingTop: 10 },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  resultImageContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F0F0', overflow: 'hidden', marginRight: 15 },
  resultImage: { width: '100%', height: '100%' },
  resultContent: { flex: 1 },
  resultName: { fontSize: 16, fontWeight: '500', color: '#333' },
  resultCountry: { fontSize: 14, color: '#777', marginTop: 2 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { marginTop: 15, fontSize: 16, color: '#777' },
  noResultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  noResultsText: { marginTop: 20, fontSize: 18, color: '#999' },
});

export default CreateTripScreen;
