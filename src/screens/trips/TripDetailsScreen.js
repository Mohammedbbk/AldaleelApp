import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet, // Added StyleSheet
} from "react-native";
import { useTheme } from "../../../ThemeProvider";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import i18n from "../../config/appConfig"; // Ensure this path is correct
import {
  SPECIAL_REQUIREMENTS,
  TRANSPORTATION_OPTIONS,
} from "../../config/constants";
import { createTrip } from "../../services/tripService";

/**
 * Trip Details Screen Component
 * Allows users to select special requirements and transportation preferences
 * before creating their trip itinerary
 */
export function TripDetailsScreen({ route, navigation }) {
  const { isDarkMode, colors } = useTheme();
  // Trip data from previous screens
  const fullTripData = route.params?.fullTripData || {};

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [additionalRequirement, setAdditionalRequirement] = useState("");
  const [selectedTransport, setSelectedTransport] = useState([]);

  /**
   * Toggle selection of a requirement
   */
  const toggleRequirement = useCallback((value) => {
    setSelectedRequirements((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  /**
   * Toggle selection of a transportation option
   */
  const toggleTransport = useCallback((value) => {
    setSelectedTransport((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  /**
   * Handle trip creation
   */
  const handleCreateAdventure = async () => {
    // Reset error state
    setError("");

    // Show loading state
    setLoading(true);
    setLoadingMessage("Preparing trip data...");

    // Combine data from previous screens with current selections
    const tripDataToProcess = {
      ...fullTripData,
      specialRequirements: selectedRequirements,
      additionalRequirement: additionalRequirement.trim(),
      transportationPreference: selectedTransport,
    };

    // Pre-API call validations
    if (!tripDataToProcess.duration && !tripDataToProcess.days) {
      const validationErrorMsg = i18n.t(
        "tripDetails.alerts.validation.durationRequired"
      );
      setError(validationErrorMsg);
      Alert.alert(
        i18n.t("tripDetails.alerts.validation.title"),
        validationErrorMsg,
        [
          {
            text: "OK",
            onPress: () => {
              setError("");
              navigation.goBack();
            },
          },
        ]
      );
      setLoading(false);
      return;
    }

    if (!tripDataToProcess.budget && !tripDataToProcess.budgetLevel) {
      const validationErrorMsg = i18n.t(
        "tripDetails.alerts.validation.budgetRequired"
      );
      setError(validationErrorMsg);
      Alert.alert(
        i18n.t("tripDetails.alerts.validation.title"),
        validationErrorMsg,
        [
          {
            text: "OK",
            onPress: () => {
              setError("");
              navigation.goBack();
            },
          },
        ]
      );
      setLoading(false);
      return;
    }

    try {
      // Call the trip creation service with callbacks for handling different states
      await createTrip(tripDataToProcess, {
        // Loading state management
        onLoadingChange: setLoading,
        onLoadingMessageChange: setLoadingMessage,

        // Error handling
        onError: (errMsg) => {
          const finalErrMsg =
            errMsg || i18n.t("tripDetails.alerts.error.message");
          setError(finalErrMsg);
          setLoading(false);

          // Handle specific error types
          if (
            finalErrMsg.includes("duration") ||
            finalErrMsg.includes("days") ||
            finalErrMsg.includes("budget")
          ) {
            Alert.alert(
              i18n.t("tripDetails.alerts.validation.title"),
              finalErrMsg,
              [
                {
                  text: i18n.t("tripDetails.alerts.goBack"),
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          } else if (
            finalErrMsg.includes("not allowed") ||
            finalErrMsg.includes("compatibility issue")
          ) {
            Alert.alert(
              i18n.t("tripDetails.alerts.dataError.title"),
              i18n.t("tripDetails.alerts.dataError.message"),
              [{ text: "OK" }]
            );
          } else if (
            finalErrMsg.includes("AI generation") ||
            finalErrMsg.includes("recommendation")
          ) {
            Alert.alert(
              i18n.t("tripDetails.alerts.aiError.title"),
              i18n.t("tripDetails.alerts.aiError.message"),
              [{ text: "OK" }]
            );
          } else {
            Alert.alert(i18n.t("tripDetails.alerts.error.title"), finalErrMsg, [
              { text: "OK" },
            ]);
          }
        },

        // Success handling
        onSuccess: (createdTripData) => {
          setLoading(false);
          setLoadingMessage("");

          // Validate response data
          if (!createdTripData || !createdTripData.tripId) {
            setError(i18n.t("tripDetails.alerts.incompleteData"));
            Alert.alert(
              i18n.t("tripDetails.alerts.error.title"),
              i18n.t("tripDetails.alerts.incompleteData")
            );
            return;
          }

          // Parse JSON data if it's a string
          let parsedData = null;
          let itineraryDays = [];

          try {
            // Handle the JSON parsing of the response
            let additionalInfo = null;

            // Create a consistent way to access the itinerary data
            let itinerarySource = null;

            // First try to parse itinerary.additionalInfo if it's a string
            if (
              createdTripData.itinerary?.additionalInfo &&
              typeof createdTripData.itinerary.additionalInfo === "string"
            ) {
              try {
                additionalInfo = JSON.parse(
                  createdTripData.itinerary.additionalInfo
                );
                itinerarySource = additionalInfo;
              } catch (e) {
                console.warn(
                  "[TripDetailsScreen] Could not parse itinerary.additionalInfo as JSON:",
                  e
                );
              }
            }
            // If not a string or parsing failed, use the object directly
            else if (createdTripData.itinerary?.additionalInfo) {
              additionalInfo = createdTripData.itinerary.additionalInfo;
              itinerarySource = additionalInfo;
            }
            // If no additionalInfo, check if itinerary itself has the data we need
            else if (createdTripData.itinerary) {
              itinerarySource = createdTripData.itinerary;
            }

            parsedData = itinerarySource || {};

            // Extract and transform the daily itinerary data
            // This handles formats returned from the backend AI service
            if (
              itinerarySource?.dailyItinerary &&
              Array.isArray(itinerarySource.dailyItinerary)
            ) {
              // Ensure we use the correct day number from the source data
              itineraryDays = itinerarySource.dailyItinerary.map(
                (daySource, index) => {
                  // Use daySource.day if available, otherwise use index + 1 as fallback
                  const currentDayNumber = daySource.day || index + 1;

                  // Transform the day structure to match what the components expect
                  return {
                    day: currentDayNumber, // Use the correct day number
                    title: `Day ${currentDayNumber}`, // Use the correct day number in title
                    // Keep the morning/afternoon/evening structure intact
                    morning: daySource.morning, // Use daySource here
                    afternoon: daySource.afternoon, // Use daySource here
                    evening: daySource.evening, // Use daySource here
                    // Create activities array for fallback rendering (if needed)
                    // NOTE: This activities array might not be directly used if morning/afternoon/evening exist
                    activities: [
                      {
                        time: daySource.morning?.timing || "Morning",
                        name: daySource.morning?.activities || "Explore",
                        estimatedCosts:
                          daySource.morning?.estimatedCosts || "Not specified",
                        transportationOptions:
                          daySource.morning?.transportationOptions ||
                          "Not specified",
                        mealRecommendations:
                          daySource.morning?.mealRecommendations ||
                          "Not specified",
                        accommodationSuggestions:
                          daySource.morning?.accommodationSuggestions ||
                          "Not specified",
                      },
                      {
                        time: daySource.afternoon?.timing || "Afternoon",
                        name: daySource.afternoon?.activities || "Explore",
                        estimatedCosts:
                          daySource.afternoon?.estimatedCosts ||
                          "Not specified",
                        transportationOptions:
                          daySource.afternoon?.transportationOptions ||
                          "Not specified",
                        mealRecommendations:
                          daySource.afternoon?.mealRecommendations ||
                          "Not specified",
                        accommodationSuggestions:
                          daySource.afternoon?.accommodationSuggestions ||
                          "Not specified",
                      },
                      {
                        time: daySource.evening?.timing || "Evening",
                        name: daySource.evening?.activities || "Relax",
                        estimatedCosts:
                          daySource.evening?.estimatedCosts || "Not specified",
                        transportationOptions:
                          daySource.evening?.transportationOptions ||
                          "Not specified",
                        mealRecommendations:
                          daySource.evening?.mealRecommendations ||
                          "Not specified",
                        accommodationSuggestions:
                          daySource.evening?.accommodationSuggestions ||
                          "Not specified",
                      },
                    ],
                  };
                }
              );
            }
            // Fallback for when the API returns a different structure
            else if (createdTripData.itinerary && !itineraryDays.length) {
              // Create default days based on the requested duration
              const duration = fullTripData.duration || fullTripData.days || 1;

              for (let i = 1; i <= duration; i++) {
                itineraryDays.push({
                  day: i,
                  title: `Day ${i}`,
                  morning: {
                    timing: "Morning",
                    activities: `Explore ${fullTripData.destination}`,
                  },
                  afternoon: {
                    timing: "Afternoon",
                    activities: `Continue exploring ${fullTripData.destination}`,
                  },
                  evening: {
                    timing: "Evening",
                    activities: `Enjoy dinner in ${fullTripData.destination}`,
                  },
                  activities: [
                    {
                      time: "Morning",
                      name: `Explore ${fullTripData.destination}`,
                      estimatedCosts: "Not specified",
                      transportationOptions: "Not specified",
                      mealRecommendations: "Not specified",
                      accommodationSuggestions: "Not specified",
                    },
                    {
                      time: "Afternoon",
                      name: `Continue exploring ${fullTripData.destination}`,
                      estimatedCosts: "Not specified",
                      transportationOptions: "Not specified",
                      mealRecommendations: "Not specified",
                      accommodationSuggestions: "Not specified",
                    },
                    {
                      time: "Evening",
                      name: `Enjoy dinner in ${fullTripData.destination}`,
                      estimatedCosts: "Not specified",
                      transportationOptions: "Not specified",
                      mealRecommendations: "Not specified",
                      accommodationSuggestions: "Not specified",
                    },
                  ],
                });
              }
            }
          } catch (parseError) {
            console.error(
              "[TripDetailsScreen] Error parsing data:",
              parseError
            );
          }

          // Prepare data for UserPlanScreen
          const combinedTripData = {
            ...fullTripData,
            tripId: createdTripData.tripId,

            // Store the original response for reference
            apiResponse: createdTripData,

            // Keep the original JSON string for alternative parsing in UserPlanScreen
            aiRecommendations: {
              additionalInfo:
                typeof createdTripData.itinerary?.additionalInfo === "string"
                  ? createdTripData.itinerary.additionalInfo
                  : JSON.stringify(
                      createdTripData.itinerary?.additionalInfo ||
                        createdTripData
                    ),
            },

            // Add direct access to the information sections
            // These should match the field names expected by components like TravelRecommendations
            currencyInfo: parsedData?.currencyInfo || null,
            healthAndSafety: parsedData?.healthAndSafety || null,
            transportation: parsedData?.transportation || null,
            languageBasics: parsedData?.languageBasics || null,
            weatherInfo: parsedData?.weatherInfo || null,
            visaRequirements: parsedData?.visaRequirements || null,
            cultureInsights:
              parsedData?.localCustoms || parsedData?.cultureInsights || null,

            // Provide both the raw itinerary array and the transformed days
            // UserPlanScreen can decide which to use based on what it finds
            itinerary: itineraryDays,
            days: itineraryDays,

            // Add a flag to indicate we've already processed the data
            dataProcessed: true,
          };

          console.log(
            "[TripDetailsScreen] Navigating with processed trip data"
          );

          // Navigate to UserPlanScreen with combined data
          navigation.navigate("UserPlanScreen", { tripData: combinedTripData });
        },
      });
    } catch (err) {
      // Handle any unexpected errors
      if (loading) {
        setLoading(false);
        const finalErrMsg =
          err?.message || i18n.t("tripDetails.alerts.error.message");
        setError(finalErrMsg);
        Alert.alert(i18n.t("tripDetails.alerts.error.title"), finalErrMsg);
      }
    }
  };

  /**
   * Handle "Start Fresh" action - confirms with user before resetting
   */
  const handleStartFresh = () => {
    Alert.alert(
      i18n.t("tripDetails.alerts.startFresh.title"),
      i18n.t("tripDetails.alerts.startFresh.message"),
      [
        {
          text: i18n.t("tripDetails.alerts.startFresh.cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("tripDetails.alerts.startFresh.ok"),
          onPress: () => navigation.popToTop(),
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Render a requirement option item
   */
  const renderRequirementOption = (item) => {
    if (!item) return null;

    const isSelected = selectedRequirements.includes(item.value);

    return (
      <TouchableOpacity
        key={item.value}
        style={styles.optionTouchable}
        onPress={() => toggleRequirement(item.value)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={item.label}
      >
        <View
          style={[
            styles.checkboxBase,
            isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
          ]}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#F97316" />
          )}
        </View>
        <Text style={styles.optionText}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render a transportation option item
   */
  const renderTransportOption = (option) => {
    if (!option) return null;

    const isSelected = selectedTransport.includes(option.value);

    return (
      <TouchableOpacity
        key={option.value}
        style={styles.optionTouchable}
        onPress={() => toggleTransport(option.value)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={option.label}
      >
        <View
          style={[
            styles.checkboxBase,
            isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
          ]}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#F97316" />
          )}
        </View>
        <Text style={styles.optionText}>{option.label}</Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render loading overlay component
   */
  const renderLoadingOverlay = () => {
    if (!loading) return null;

    return (
      <View style={styles.loadingOverlay} accessibilityViewIsModal={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0EA5E9" />
          <Text style={styles.loadingText} accessibilityLiveRegion="polite">
            {loadingMessage || i18n.t("tripDetails.loading.default")}
          </Text>
          <Text style={styles.loadingSubText}>
            {i18n.t("tripDetails.loading.timeEstimate")}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        {/* Header */}
        <View
          className={`flex-row items-center justify-between px-5 pt-2.5 pb-5 ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }`}
        >
          <TouchableOpacity
            className={`w-10 h-10 rounded-full justify-center items-center ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={isDarkMode ? "#fff" : "#111"}
            />
          </TouchableOpacity>

          <View className="flex-1 items-center">
            <Text
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {i18n.t("tripDetails.title")}
            </Text>
          </View>

          <Text className="text-base text-orange-500 font-semibold w-10 text-right">
            {i18n.t("tripDetails.stepIndicator")}
          </Text>
        </View>

        {/* Scrollable content */}
        <ScrollView
          style={styles.scrollView}
          scrollEnabled={!loading}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Rest of the content... */}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Overlay */}
      {renderLoadingOverlay()}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 20,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 8,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
    marginTop: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  checkboxBase: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    borderColor: "#F97316",
    backgroundColor: "#FFF7ED",
  },
  checkboxUnselected: {
    borderColor: "#0EA5E9",
  },
  optionText: {
    fontSize: 16,
    color: "#4B5563",
  },
  textInputContainer: {
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F2937",
  },
  createButtonContainer: {
    marginBottom: 40,
    marginTop: 20,
  },
  createButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#0EA5E9",
    paddingVertical: 16,
    height: 56,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  createButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  createButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 6,
    alignItems: "center",
    minWidth: 200,
  },
  loadingText: {
    color: "#374151",
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingSubText: {
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
    fontSize: 14,
  },
  iconStyle: {
    marginLeft: 8,
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 20 : 15,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D1D5DB",
    backgroundColor: "#FFF",
  },
  startFreshButton: {
    borderWidth: 1.5,
    borderColor: "#0EA5E9",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  startFreshText: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "600",
  },
});

// Export default
export default TripDetailsScreen;
