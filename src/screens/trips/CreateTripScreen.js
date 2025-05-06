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

import { OPENWEATHERMAP_API_KEY } from "../../config/keys";

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
  const [destination, setDestination] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTravelerStyle, setSelectedTravelerStyle] = useState("");
  const [selectedBudgetLevel, setSelectedBudgetLevel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [duration, setDuration] = useState("");
  const [nationality, setNationality] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
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

  const searchCities = async (query) => {
    if (!query || query.trim().length < 2) {
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
    setShowSearchResults(true);

    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=10&appid=${OPENWEATHERMAP_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const validResults = data.filter((city) => city.country);
      setSearchResults(validResults);
      console.log("API Results:", validResults);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setSearchResults([]);
      Alert.alert(
        "Search Error",
        "Could not fetch city data. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearchCities = useCallback(debounce(searchCities, 500), [
    OPENWEATHERMAP_API_KEY,
  ]);

  useEffect(() => {
    debouncedSearchCities(searchQuery);
    return () => debouncedSearchCities.cancel();
  }, [searchQuery, debouncedSearchCities]);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setDestination(`${place.name}, ${place.country}`);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchModal(false);
    setShowSearchResults(false);
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
      destination: selectedPlace?.name,
      destinationCountry: selectedPlace?.country,
      latitude: selectedPlace?.lat,
      longitude: selectedPlace?.lon,
      displayDestination: destination,
      year: selectedYear,
      month: selectedMonth,
      travelerStyle: selectedTravelerStyle,
      budgetLevel: selectedBudgetLevel,
      duration: parseInt(duration, 10),
      nationality: nationality.trim(),
    };
    console.log("Step 1 Data:", stepOneData);
    navigation.navigate("TripStyleScreen", { stepOneData });
  };

  const handleBackToHome = () => {
    navigation.navigate("Home");
  };

  const openSearchModal = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchModal(true);
  };

  const renderSearchResults = () => {
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
            key={`${item.lat}-${item.lon}-${index}`}
            className="p-3 border-b border-gray-100"
            onPress={() => handleSelectPlace(item)}
          >
            <Text className="text-base text-gray-800">
              {item.name}
              {item.state ? <Text>, {item.state}</Text> : <Text></Text>}
              <Text>, {item.country}</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View
          className={`flex-row items-center justify-between px-5 pt-2.5 pb-3 ${
            isDarkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          <TouchableOpacity
            className="w-[50] h-[50] rounded-full bg-gray-100 dark:bg-gray-900 justify-center items-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Plan Your Trip
            </Text>
          </View>
          <Text className="text-base text-orange-500 font-semibold">
            Step 1/3
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5 mb-20"
          keyboardShouldPersistTaps="handled"
        >
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

          <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            When are you going?
          </Text>
          <View className="flex-row justify-between items-center mb-6">
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
              keyboardType="number-pad"
              value={duration}
              onChangeText={(text) => setDuration(text.replace(/[^0-9]/g, ""))}
              maxLength={3}
            />
            {duration ? (
              <Text className="text-base text-gray-600 dark:text-gray-400 ml-2">
                days
              </Text>
            ) : null}
          </View>

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
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

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

      <Modal
        transparent={true}
        visible={showSearchModal}
        animationType="slide"
        onRequestClose={() => setShowSearchModal(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
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
            <View className="w-8">
              <Text> </Text>
            </View>
          </View>

          <View className="px-4 pt-4">
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <Ionicons name="search" size={20} color="#999" className="mr-2" />
              <TextInput
                className="flex-1 text-base text-gray-800 h-10"
                placeholder="Enter city name..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
                returnKeyType="search"
                onBlur={() => setShowSearchResults(true)}
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

          {renderSearchResults()}
        </SafeAreaView>
      </Modal>

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
            onStartShouldSetResponder={() => true}
            className="w-4/5 bg-white rounded-xl p-5 shadow-md max-h-[70%]"
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

      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 pb-5 border-t border-gray-100">
        <View className="flex-row justify-between items-center h-[50px]">
          <TouchableOpacity
            className="w-[50px] h-[50px] rounded-full bg-gray-100 justify-center items-center shadow shadow-black/5"
            onPress={handleBackToHome}
          >
            <FontAwesome name="home" size={26} color="#444" />
          </TouchableOpacity>
          <View style={{ flex: 0.05 }}>
            <Text> </Text>
          </View>
          <TouchableOpacity
            className={`flex-row flex-1 items-center justify-center rounded-full px-6 py-3 shadow shadow-black/10 ml-4 ${
              isFormValid ? "bg-sky-500" : "bg-sky-300"
            }`}
            onPress={handleNext}
            disabled={!isFormValid}
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