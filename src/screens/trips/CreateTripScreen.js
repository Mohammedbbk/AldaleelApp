import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image, // Keep for potential future use, though flags are removed
  ActivityIndicator,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'; // Added MaterialCommunityIcons, kept FontAwesome for Home button
import { debounce } from 'lodash'; // Using lodash debounce for better handling

// --- Configuration ---
// IMPORTANT: Store API keys securely in a real app (env variables, config)!
const OPENWEATHERMAP_API_KEY = '3f141daba7c7fb2740e27f544145b76f'; // <--- REPLACE WITH YOUR ACTUAL KEY

// Constants remain the same (except removing COUNTRY specific ones)
const MONTHS = [
  ['Jan', 'Feb', 'Mar'],
  ['Apr', 'May', 'Jun'],
  ['Jul', 'Aug', 'Sep'],
  ['Oct', 'Nov', 'Dec'],
];
const YEARS = ['2025', '2026', '2027', '2028'];
const TRAVELER_STYLES = ['Solo', 'Family', 'Friends'];
const BUDGET_LEVELS = ['Economy', 'Moderate', 'Luxury'];

const CreateTripScreen = ({ navigation, route }) => {
  // State hooks - Adjusted for city search
  const [destination, setDestination] = useState(''); // Will hold "City, Country" string for display
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedTravelerStyle, setSelectedTravelerStyle] = useState('');
  const [selectedBudgetLevel, setSelectedBudgetLevel] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null); // Will hold the selected city object from OWM
  const [showSearchModal, setShowSearchModal] = useState(false);

  // --- API Call for Cities ---
  const searchCities = async (query) => {
    if (!query || query.trim().length < 2) { // Don't search for very short queries
      setSearchResults([]);
      setShowSearchResults(false);
      setIsLoading(false);
      return;
    }
    if (!OPENWEATHERMAP_API_KEY || OPENWEATHERMAP_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
        Alert.alert("API Key Missing", "Please add your OpenWeatherMap API key to the code.");
        setIsLoading(false);
        setShowSearchResults(false);
        return;
    }

    console.log("Searching for:", query);
    setIsLoading(true);
    setShowSearchResults(true); // Show the results area (might show loader)

    try {
      // Using OpenWeatherMap Geocoding API
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${OPENWEATHERMAP_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
       // Filter out results without a country code for better quality
      const validResults = data.filter(city => city.country);
      setSearchResults(validResults);
      console.log("API Results:", validResults);

    } catch (error) {
      console.error('Error fetching cities:', error);
      setSearchResults([]); // Clear results on error
      Alert.alert("Search Error", "Could not fetch city data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearchCities = useCallback(debounce(searchCities, 500), [OPENWEATHERMAP_API_KEY]); // Recreate if API key changes (though it shouldn't)

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearchCities(searchQuery);
    // Cancel the debounce on unmount or query change
    return () => debouncedSearchCities.cancel();
  }, [searchQuery, debouncedSearchCities]);


  // Effect to check form validity
  useEffect(() => {
    setIsFormValid(
      selectedPlace !== null &&
      selectedMonth !== '' &&
      selectedTravelerStyle !== '' &&
      selectedBudgetLevel !== ''
    );
  }, [selectedPlace, selectedMonth, selectedTravelerStyle, selectedBudgetLevel]);

  // --- Handlers ---
  const handleSelectPlace = (place) => {
    setSelectedPlace(place); // Store the whole city object
    // Format display name: City, State (if exists), Country Code
    const displayName = `${place.name}${place.state ? `, ${place.state}` : ''}, ${place.country}`;
    setDestination(displayName); // Update the display text field
    setSearchQuery(''); // Clear search input in modal
    setShowSearchResults(false); // Hide results list
    setShowSearchModal(false); // Close modal
  };

  const handleNext = () => {
    if (isFormValid && selectedPlace) {
      const tripData = {
        destinationCity: selectedPlace.name,
        country: selectedPlace.country, // Country Code (e.g., 'US', 'GB')
        state: selectedPlace.state || null, // State/Region if available
        latitude: selectedPlace.lat,
        longitude: selectedPlace.lon,
        year: selectedYear,
        month: selectedMonth,
        travelerStyle: selectedTravelerStyle,
        budgetLevel: selectedBudgetLevel,
        // countryCode: selectedPlace.country, // Already have country
      };
      console.log('Trip Data:', tripData);
      navigation.navigate('TripStyleScreen', { stepOneData: tripData });
    } else {
      Alert.alert('Required Fields', 'Please select a destination and fill all other required fields.');
    }
  };

  const handleBackToHome = () => {
    navigation.navigate('HomePage'); // Assuming 'HomePage' is your home screen route name
  };

   const openSearchModal = () => {
    setShowSearchModal(true);
    // Optional: Immediately trigger a search if needed, or wait for user input
    // if (searchQuery) searchCities(searchQuery);
   }

  // --- Render Functions ---

  const renderSearchResults = () => {
    // Only render if the modal intends to show results
    if (!showSearchResults) return null;

    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center p-8">
          <ActivityIndicator size="large" color="#00BFFF" />
          <Text className="mt-4 text-base text-gray-500">Searching cities...</Text>
        </View>
      );
    }

    if (!isLoading && searchResults.length === 0 && searchQuery.length > 1) { // Show 'no results' only after loading and if query exists
      return (
        <View className="flex-1 justify-center items-center p-12">
          <MaterialIcons name="search-off" size={60} color="#CCC" />
          <Text className="mt-5 text-lg text-gray-400">No matching cities found</Text>
        </View>
      );
    }

     if (!isLoading && searchResults.length === 0 && searchQuery.length <= 1) { // Prompt to type more
        return (
          <View className="flex-1 justify-center items-center p-12">
              <Ionicons name="pencil-outline" size={60} color="#CCC" />
              <Text className="mt-5 text-lg text-gray-400">Enter 2 or more characters to search</Text>
          </View>
        );
    }


    return (
      <View className="flex-1 pt-2.5">
        <ScrollView keyboardShouldPersistTaps="handled">
          {searchResults.map((item, index) => ( // Using index as part of key for safety if lat/lon are identical
            <TouchableOpacity
              key={`${item.lat}-${item.lon}-${index}`} // Key based on lat/lon and index
              className="flex-row items-center py-4 px-5 border-b border-gray-100"
              onPress={() => handleSelectPlace(item)}
            >
              {/* Icon instead of Flag */}
              <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-4">
                 <MaterialCommunityIcons name="map-marker-outline" size={24} color="#666" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-800">{item.name}</Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  {item.state ? `${item.state}, ` : ''}{item.country}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // --- Main Component Return ---
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-2.5 pb-5 bg-white z-10">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-black">New Trip</Text>
        </View>
        <Text className="text-base font-semibold text-orange-500 w-10 text-right">1/3</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust if necessary
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }} // Padding for bottom nav
          className="flex-1"
          keyboardShouldPersistTaps="handled" // Allow taps in ScrollView while keyboard is up
        >
          {/* Where to? Section */}
          <View className="px-5 mb-6 relative">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Where to?</Text>
            <TouchableOpacity
              className="flex-row items-center bg-gray-100 rounded-full px-4 h-12"
              onPress={openSearchModal}
            >
              <Ionicons name="search" size={20} color="#999" className="mr-2.5" />
              <Text
                className={`flex-1 text-base ${selectedPlace ? 'text-gray-800' : 'text-gray-400'}`}
                numberOfLines={1}
              >
                {selectedPlace ? destination : 'Search City or Destination'}
              </Text>
            </TouchableOpacity>

            {/* Selected Place Card */}
            {selectedPlace && (
              <View className="mt-4 bg-gray-50 rounded-xl p-3">
                <View className="flex-row items-center">
                  {/* Location Icon */}
                  <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center">
                     <MaterialCommunityIcons name="map-marker" size={24} color="#333" />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-base font-bold text-gray-800">{selectedPlace.name}</Text>
                    <Text className="text-sm text-gray-600 mt-0.5">
                         {selectedPlace.state ? `${selectedPlace.state}, ` : ''}{selectedPlace.country}
                    </Text>
                  </View>
                  <TouchableOpacity
                    className="bg-white px-3 py-1.5 rounded-full border border-sky-500"
                    onPress={openSearchModal} // Re-open modal to change
                  >
                    <Text className="text-sky-500 text-sm font-medium">Change</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* When to? Section (No changes needed here) */}
          <View className="px-5 mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">When to?</Text>
            <View className="border border-gray-200 rounded-xl p-4">
              <TouchableOpacity
                className="flex-row justify-between items-center border-b border-gray-100 pb-2.5"
                onPress={() => setShowYearSelector(true)}
              >
                <Text className="text-lg text-gray-700">{selectedYear}</Text>
                <AntDesign name="down" size={16} color="#999" />
              </TouchableOpacity>
              {/* Placeholder Month Navigation Arrows */}
              <View className="flex-row justify-between items-center mt-2.5">
                <TouchableOpacity disabled>
                  <Ionicons name="chevron-back" size={24} color="#CCC" />
                </TouchableOpacity>
                <TouchableOpacity disabled>
                  <Ionicons name="chevron-forward" size={24} color="#CCC" />
                </TouchableOpacity>
              </View>
              {/* Month Selection Grid */}
              <View className="mt-2.5">
                {MONTHS.map((row, rowIndex) => (
                  <View key={`row-${rowIndex}`} className="flex-row justify-between mb-4">
                    {row.map((month) => (
                      <TouchableOpacity
                        key={month}
                        className={`flex-1 items-center py-2 rounded-full mx-1 ${
                          selectedMonth === month ? 'bg-sky-500' : 'bg-white'
                        }`}
                        onPress={() => setSelectedMonth(month)}
                      >
                        <Text
                          className={`text-base ${
                            selectedMonth === month ? 'text-white font-semibold' : 'text-gray-700'
                          }`}
                        >
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Traveler Style Section (No changes needed here) */}
          <View className="px-5 mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Traveler Style</Text>
            <View className="flex-row justify-between">
              {TRAVELER_STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  className={`flex-1 mx-1 border-[1.5px] rounded-full py-3.5 items-center ${
                    selectedTravelerStyle === style
                      ? 'border-sky-500 bg-sky-500/5'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedTravelerStyle(style)}
                >
                  <Text
                    className={`text-base font-medium ${
                      selectedTravelerStyle === style ? 'text-sky-500 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {style}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget Level Section (No changes needed here) */}
          <View className="px-5 mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Budget Level</Text>
            <View className="flex-row justify-between">
              {BUDGET_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  className={`flex-1 mx-1 border-[1.5px] rounded-full py-3.5 items-center ${
                    selectedBudgetLevel === level
                      ? 'border-sky-500 bg-sky-500/5'
                      : 'border-gray-200 bg-white'
                  }`}
                  onPress={() => setSelectedBudgetLevel(level)}
                >
                  <Text
                    className={`text-base font-medium ${
                      selectedBudgetLevel === level ? 'text-sky-500 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Search Modal */}
      <Modal
        visible={showSearchModal}
        transparent={false} // Usually better as non-transparent for full screen
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="flex-row items-center px-4 py-2.5 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => {
                setShowSearchModal(false);
                // Don't clear query here, user might want to modify it
              }}
              className="p-1 mr-2.5"
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            {/* Search Input inside Modal Header */}
            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 h-10">
              <Ionicons name="search" size={20} color="#999" className="mr-1.5" />
              <TextInput
                className="flex-1 text-base text-gray-800 h-10"
                placeholder="Search City or Destination"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery} // Directly set, useEffect will trigger debounced search
                autoFocus={true}
                returnKeyType="search"
                onBlur={() => setShowSearchResults(true)} // Keep results visible when input loses focus within modal
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} className="p-1">
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Search Results Area */}
          {renderSearchResults()}

        </SafeAreaView>
      </Modal>

      {/* Year Selector Modal (No changes needed here) */}
      <Modal
        transparent={true}
        visible={showYearSelector}
        animationType="fade"
        onRequestClose={() => setShowYearSelector(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowYearSelector(false)}
        >
          <View
            onStartShouldSetResponder={() => true} // Prevent closing on inner press
            className="w-4/5 bg-white rounded-xl p-5 shadow-md max-h-[70%]" // Added max-h
          >
             <View className="flex-row justify-between items-center mb-4 pb-2.5 border-b border-gray-100">
               <Text className="text-lg font-bold text-gray-800">Select Year</Text>
               <TouchableOpacity onPress={() => setShowYearSelector(false)}>
                 <Ionicons name="close" size={24} color="#333" />
               </TouchableOpacity>
             </View>
             <ScrollView>
                {YEARS.map((year) => (
                <TouchableOpacity
                    key={year}
                    className={`flex-row justify-between items-center py-3 px-1 border-b border-gray-100 ${
                    selectedYear === year ? 'bg-sky-500/5' : ''
                    }`}
                    onPress={() => {
                    setSelectedYear(year);
                    setShowYearSelector(false);
                    }}
                >
                    <Text
                    className={`text-base ${
                        selectedYear === year ? 'text-sky-500 font-semibold' : 'text-gray-800'
                    }`}
                    >
                    {year}
                    </Text>
                    {selectedYear === year && <Ionicons name="checkmark" size={20} color="#00BFFF" />}
                </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation (No changes needed here) */}
       <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 pb-5 border-t border-gray-100">
         <View className="flex-row justify-between items-center h-[50px]">
             <TouchableOpacity
             className="w-[50px] h-[50px] rounded-full bg-gray-100 justify-center items-center shadow shadow-black/5" // Adjusted size/shadow
             onPress={handleBackToHome}>
             <FontAwesome name="home" size={26} color="#444" />
             </TouchableOpacity>

             <TouchableOpacity
                 className={`flex-row flex-1 items-center justify-center rounded-full px-6 py-3 shadow shadow-black/10 ml-4 ${ // Adjusted padding, margin
                 isFormValid ? 'bg-sky-500' : 'bg-sky-300' // Made inactive slightly darker
                 }`}
                 onPress={handleNext}
                 disabled={!isFormValid}
             >
                 <Text className="text-white text-lg font-semibold mr-1.5">Next</Text>
                 <Ionicons name="chevron-forward" size={22} color="#FFF" />
             </TouchableOpacity>
         </View>
      </View>

    </SafeAreaView>
  );
};

export default CreateTripScreen;