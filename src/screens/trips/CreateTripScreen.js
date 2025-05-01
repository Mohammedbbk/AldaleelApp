// Propose changes to AldaleelApp/src/screens/trips/CreateTripScreen.js

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../../ThemeProvider";
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { debounce } from "lodash";

// --- Configuration ---
// IMPORTANT: Store API keys securely in a real app (env variables, config)!
import { OPENWEATHERMAP_API_KEY } from "../../config/keys";

// --- Constants ---
const MONTHS = [
  ["Jan", "Feb", "Mar"],
  ["Apr", "May", "Jun"],
  ["Jul", "Aug", "Sep"],
  ["Oct", "Nov", "Dec"],
];
const YEARS = ["2025", "2026", "2027", "2028"];
const TRAVELER_STYLES = ["Solo", "Family", "Friends"];
const BUDGET_LEVELS = ["Economy", "Moderate", "Luxury"];

export function CreateTripScreen({ navigation, route }) {
  // State hooks - Adjusted for city search
  const [destination, setDestination] = useState(""); // Will hold "City, Country" string for display
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTravelerStyle, setSelectedTravelerStyle] = useState("");
  const [selectedBudgetLevel, setSelectedBudgetLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null); // Holds selected city object { name, country, lat, lon }
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [duration, setDuration] = useState(""); // ADDED: State for trip duration (days)
  const [nationality, setNationality] = useState(""); // ADDED: State for user nationality
  const [isFormValid, setIsFormValid] = useState(false);
  const { isDarkMode, colors } = useTheme();

  // --- Form Validation ---
  // Now includes duration and nationality
  useEffect(() => {
    // Validate the form fields, now including duration and nationality
    const durationValid =
      duration && !isNaN(duration) && parseInt(duration, 10) > 0;
    const nationalityValid = nationality && nationality.trim().length > 0;
    const valid =
      selectedPlace !== null &&
      selectedYear !== "" &&
      selectedMonth !== "" &&
      selectedTravelerStyle !== "" &&
      selectedBudgetLevel !== "" &&
      durationValid &&
      nationalityValid;
    setIsFormValid(valid);
  }, [
    selectedPlace,
    selectedMonth,
    selectedYear,
    selectedTravelerStyle,
    selectedBudgetLevel,
    duration,
    nationality,
  ]);

  // --- API Call for Cities ---
  const searchCities = async (query) => {
    // ... (existing searchCities function remains unchanged) ...
    if (!query || query.trim().length < 2) {
      // Don't search for very short queries
      setSearchResults([]);
      setShowSearchResults(false);
      setIsLoading(false);
      return;
    }
    if (
      !OPENWEATHERMAP_API_KEY ||
      OPENWEATHERMAP_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY"
    ) {
      Alert.alert(
        "API Key Missing",
        "Please add your OpenWeatherMap API key to the code."
      );
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
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=10&appid=${OPENWEATHERMAP_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Filter out results without a country code for better quality
      const validResults = data.filter((city) => city.country);
      setSearchResults(validResults);
      console.log("API Results:", validResults);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setSearchResults([]); // Clear results on error
      Alert.alert(
        "Search Error",
        "Could not fetch city data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearchCities = useCallback(debounce(searchCities, 500), [
    OPENWEATHERMAP_API_KEY,
  ]);

  // Effect to trigger search when query changes
  useEffect(() => {
    // ... (existing useEffect remains unchanged) ...
    debouncedSearchCities(searchQuery);
    // Cancel the debounce on unmount or query change
    return () => debouncedSearchCities.cancel();
  }, [searchQuery, debouncedSearchCities]);

  // --- Handlers ---
  const handleSelectPlace = (place) => {
    // ... (existing handleSelectPlace function remains unchanged) ...
    setSelectedPlace(place); // Store the full place object
    setDestination(`${place.name}, ${place.country}`); // Set display string
    setSearchQuery(""); // Clear search query
    setSearchResults([]); // Clear results
    setShowSearchModal(false); // Close modal
    setShowSearchResults(false); // Hide results area
  };

  const handleNext = () => {
    if (!isFormValid) {
      Alert.alert(
        "Incomplete Form",
        "Please fill in all fields, including duration and nationality."
      );
      return;
    }
    if (parseInt(duration, 10) <= 0) {
      Alert.alert("Invalid Duration", "Trip duration must be at least 1 day.");
      return;
    }

    const stepOneData = {
      // Keep existing data
      destination: selectedPlace?.name, // Use city name from selectedPlace
      destinationCountry: selectedPlace?.country, // Use country code from selectedPlace
      latitude: selectedPlace?.lat,
      longitude: selectedPlace?.lon,
      displayDestination: destination, // Keep the display string "City, Country"
      year: selectedYear,
      month: selectedMonth,
      travelerStyle: selectedTravelerStyle,
      budgetLevel: selectedBudgetLevel,
      // ADDED: Pass duration and nationality
      duration: parseInt(duration, 10),
      nationality: nationality.trim(),
    };
    console.log("Step 1 Data:", stepOneData); // Log data being passed
    navigation.navigate("TripStyleScreen", { stepOneData });
  };

  const handleBackToHome = () => {
    // ... (existing handleBackToHome function remains unchanged) ...
    navigation.navigate("Home"); // Assuming 'HomePage' is your main screen route name
  };

  const openSearchModal = () => {
    // ... (existing openSearchModal function remains unchanged) ...
    setSearchQuery(""); // Clear previous search on open
    setSearchResults([]);
    setShowSearchModal(true);
  };

  // --- Render Functions ---
  // Function to render search results (can remain mostly the same)
  const renderSearchResults = () => {
    // ... (existing renderSearchResults function remains unchanged) ...
    if (!showSearchResults) return null;

    if (isLoading) {
      return (
        <ActivityIndicator size="large" color="#00BFFF" className="mt-4" />
      );
    }

    if (searchResults.length === 0 && searchQuery.length >= 2) {
      return (
        <Text className="text-center text-gray-500 mt-4">
          No cities found for "{searchQuery}".
        </Text>
      );
    }

    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="max-h-60 mt-2 border border-gray-200 rounded-md"
      >
        {searchResults.map((item, index) => (
          <TouchableOpacity
            key={`${item.lat}-${item.lon}-${index}`} // More unique key
            className="p-3 border-b border-gray-100"
            onPress={() => handleSelectPlace(item)}
          >
            <Text className="text-base text-gray-800">
              {item.name}, {item.state ? `${item.state}, ` : ""}
              {item.country}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-200 border-gray-200"
      } pt-5`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust offset if needed
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2.5 pb-3 bg-white dark:bg-gray-900">
          {/* Back Button */}
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          {/* Title */}
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Plan Your Trip
            </Text>
          </View>
          {/* Step Indicator */}
          <Text className="text-base text-orange-500 font-semibold">
            Step 1/3
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5 mb-20"
          keyboardShouldPersistTaps="handled"
        >
          {/* --- Destination --- */}
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 mt-5">
            Where to?
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 mb-4">
            Enter your desired city destination.
          </Text>
          <TouchableOpacity
            className="flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-full p-4 mb-6 shadow shadow-black/5"
            onPress={openSearchModal}
          >
            <Ionicons name="search" size={20} color="#999" className="mr-2" />
            <Text
              className={`flex-1 text-base ${
                destination
                  ? "text-gray-800 dark:text-gray-200"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {destination || "Search for a city..."}
            </Text>
          </TouchableOpacity>

          {/* --- Dates --- */}
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            When are you going?
          </Text>
          <View className="flex-row justify-between items-center mb-6">
            {/* Month Selector */}
            <View className="flex-1 mr-2">
              <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Month
              </Text>
              <View className="flex-row flex-wrap justify-between">
                {MONTHS.map((row, rowIndex) => (
                  <View
                    key={`month-row-${rowIndex}`}
                    className="flex-row justify-between w-full mb-1.5"
                  >
                    {row.map((month) => (
                      <TouchableOpacity
                        key={month}
                        className={`w-[31%] py-2.5 rounded-full items-center border-2 ${
                          selectedMonth === month
                            ? "border-sky-500 bg-sky-50 dark:bg-sky-900"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        onPress={() => setSelectedMonth(month)}
                      >
                        <Text
                          className={`font-semibold ${
                            selectedMonth === month
                              ? "text-sky-600 dark:text-sky-300"
                              : "text-gray-700 dark:text-gray-400"
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

            {/* Year Selector */}
            <View className="w-24">
              <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Year
              </Text>
              <TouchableOpacity
                className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-900 rounded-full p-3 border border-gray-300 dark:border-gray-600"
                onPress={() => setShowYearSelector(true)}
              >
                <Text className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {selectedYear}
                </Text>
                <AntDesign name="down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* --- ADDED: Duration Input --- */}
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 mt-4">
            How long?
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 mb-3">
            Enter the total number of days for your trip.
          </Text>
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-full p-4 mb-6 shadow shadow-black/5">
            <MaterialCommunityIcons
              name="calendar-range"
              size={22}
              color="#999"
              className="mr-3"
            />
            <TextInput
              className="flex-1 text-base text-gray-800 dark:text-gray-200"
              placeholder="e.g., 7"
              placeholderTextColor="#999"
              keyboardType="number-pad" // Use number pad for easier input
              value={duration}
              onChangeText={(text) => setDuration(text.replace(/[^0-9]/g, ""))} // Allow only numbers
              maxLength={3} // Limit to 3 digits (max 999 days)
            />
            {duration ? (
              <Text className="text-base text-gray-600 dark:text-gray-400 ml-2">
                days
              </Text>
            ) : null}
          </View>

          {/* --- ADDED: Nationality Input --- */}
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 mt-4">
            Your Nationality?
          </Text>
          <Text className="text-base text-gray-500 dark:text-gray-400 mb-3">
            Needed for visa checks and personalized tips.
          </Text>
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-900 rounded-full p-4 mb-6 shadow shadow-black/5">
            <FontAwesome name="flag" size={20} color="#999" className="mr-3" />
            <TextInput
              className="flex-1 text-base text-gray-800 dark:text-gray-200"
              placeholder="e.g., American, British, Emirati"
              placeholderTextColor="#999"
              value={nationality}
              onChangeText={setNationality}
              autoCapitalize="words" // Capitalize first letter of each word
              returnKeyType="done"
            />
          </View>

          {/* --- Travel Style --- */}
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mt-4">
            Who's traveling?
          </Text>
          <View className="flex-row justify-between mb-6">
            {TRAVELER_STYLES.map((style) => (
              <TouchableOpacity
                key={style}
                className={`flex-1 mx-1 py-3 rounded-full items-center border-2 ${
                  selectedTravelerStyle === style
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-900"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onPress={() => setSelectedTravelerStyle(style)}
              >
                <Text
                  className={`font-semibold ${
                    selectedTravelerStyle === style
                      ? "text-sky-600 dark:text-sky-300"
                      : "text-gray-700 dark:text-gray-400"
                  }`}
                >
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* --- Budget --- */}
          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mt-4">
            Budget level?
          </Text>
          <View className="flex-row justify-between mb-10">
            {BUDGET_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                className={`flex-1 mx-1 py-3 rounded-full items-center border-2 ${
                  selectedBudgetLevel === level
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-900"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onPress={() => setSelectedBudgetLevel(level)}
              >
                <Text
                  className={`font-semibold ${
                    selectedBudgetLevel === level
                      ? "text-sky-600 dark:text-sky-300"
                      : "text-gray-700 dark:text-gray-400"
                  }`}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Search Modal */}
      <Modal
        transparent={true}
        visible={showSearchModal}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        {/* ... (Search Modal content remains unchanged) ... */}
        <SafeAreaView className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setShowSearchModal(false)}
              className="p-1"
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">
              Search Destination
            </Text>
            <View className="w-8" /> {/* Spacer */}
          </View>

          {/* Search Input Area */}
          <View className="px-4 pt-4">
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <Ionicons name="search" size={20} color="#999" className="mr-2" />
              <TextInput
                className="flex-1 text-base text-gray-800 h-10" // Ensure consistent height
                placeholder="Enter city name..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery} // Directly set, useEffect will trigger debounced search
                autoFocus={true}
                returnKeyType="search"
                onBlur={() => setShowSearchResults(true)} // Keep results visible when input loses focus within modal
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="p-1"
                >
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Search Results Area */}
          {renderSearchResults()}
        </SafeAreaView>
      </Modal>

      {/* Year Selector Modal */}
      <Modal
        transparent={true}
        visible={showYearSelector}
        animationType="fade"
        onRequestClose={() => setShowYearSelector(false)}
      >
        {/* ... (Year Selector Modal content remains unchanged) ... */}
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
              <Text className="text-lg font-bold text-gray-800">
                Select Year
              </Text>
              <TouchableOpacity onPress={() => setShowYearSelector(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {YEARS.map((year) => (
                <TouchableOpacity
                  key={year}
                  className={`flex-row justify-between items-center py-3 px-1 border-b border-gray-100 ${
                    selectedYear === year ? "bg-sky-500/5" : ""
                  }`}
                  onPress={() => {
                    setSelectedYear(year);
                    setShowYearSelector(false);
                  }}
                >
                  <Text
                    className={`text-base ${
                      selectedYear === year
                        ? "text-sky-500 font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {year}
                  </Text>
                  {selectedYear === year && (
                    <Ionicons name="checkmark" size={20} color="#00BFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 pb-5 border-t border-gray-100">
        <View className="flex-row justify-between items-center h-[50px]">
          {/* Home Button */}
          <TouchableOpacity
            className="w-[50px] h-[50px] rounded-full bg-gray-100 justify-center items-center shadow shadow-black/5" // Adjusted size/shadow
            onPress={handleBackToHome}
          >
            <FontAwesome name="home" size={26} color="#444" />
          </TouchableOpacity>

          {/* Next Button */}
          <TouchableOpacity
            className={`flex-row flex-1 items-center justify-center rounded-full px-6 py-3 shadow shadow-black/10 ml-4 ${
              isFormValid ? "bg-sky-500" : "bg-sky-300" // Use updated isFormValid
            }`}
            onPress={handleNext}
            disabled={!isFormValid} // Use updated isFormValid
          >
            <Text className="text-white text-lg font-semibold mr-1.5">
              Next
            </Text>
            <Ionicons name="chevron-forward" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default CreateTripScreen;
