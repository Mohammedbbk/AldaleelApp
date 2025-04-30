import React, { useState, useCallback, useEffect } from "react"; // Added useEffect
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
  StyleSheet, // Added StyleSheet
} from "react-native";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import i18n from "../../config/appConfig"; // Ensure this path is correct
import {
  SPECIAL_REQUIREMENTS,
  TRANSPORTATION_OPTIONS,
} from "../../config/constants"; // Ensure this path is correct
import { createTrip } from "../../services/tripService"; // Ensure this path is correct

// Define styles for better organization
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF", paddingTop: 20 },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 8,
  },
  keyboardAvoidingView: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#FFF",
    marginTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#000" },
  stepIndicator: { fontSize: 16, color: "#F97316", fontWeight: "600" },
  scrollView: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
    marginTop: 20,
  },
  optionsContainer: { marginBottom: 20 },
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
  },
  checkboxSelected: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },
  checkboxUnselected: { borderColor: "#0EA5E9" },
  optionText: { fontSize: 16, color: "#4B5563" },
  textInputContainer: { marginTop: 10 },
  textInput: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F2937",
  },
  createButtonContainer: { marginBottom: 40, marginTop: 10 }, // Added marginTop
  createButton: {
    borderRadius: 999,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonEnabled: { backgroundColor: "#0EA5E9" },
  createButtonDisabled: { backgroundColor: "#9CA3AF" },
  createButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  loadingText: {
    color: "#FFF",
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
  createButtonText: { color: "#FFF", fontSize: 18, fontWeight: "600" },
  iconStyle: { marginLeft: 8 },
  bottomButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  startFreshButton: {
    borderWidth: 1.5,
    borderColor: "#0EA5E9",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  startFreshText: { color: "#0EA5E9", fontSize: 14, fontWeight: "600" },
  homeButton: {
    position: "absolute",
    bottom: -5,
    right: 130,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export function TripDetailsScreen({ route, navigation }) {
  const fullTripData = route.params?.fullTripData || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [additionalRequirement, setAdditionalRequirement] = useState("");
  const [selectedTransport, setSelectedTransport] = useState([]);

  // --- TEST FETCH ---
  useEffect(() => {
    const testFetch = async () => {
      console.log(
        "[Test Fetch] Attempting fetch to https://httpbin.org/get..."
      );
      try {
        const response = await fetch("https://httpbin.org/get");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("[Test Fetch] Success:", data);
        Alert.alert(
          "Test Fetch Success",
          "Successfully fetched from httpbin.org"
        );
      } catch (error) {
        console.error("[Test Fetch] Failed:", error);
        Alert.alert(
          "Test Fetch Failed",
          `Failed to fetch from httpbin.org: ${error.message}`
        );
        if (error.message.includes("Network request failed")) {
          console.warn(
            '[Test Fetch] Encountered "Network request failed". This might indicate a general network issue within the app environment.'
          );
        }
      }
    };

    testFetch();
  }, []); // Empty dependency array ensures this runs only once on mount
  // --- END TEST FETCH ---

  // Use useCallback for functions passed to TouchableOpacity to prevent unnecessary re-renders
  const toggleRequirement = useCallback((value) => {
    setSelectedRequirements((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  const toggleTransport = useCallback((value) => {
    setSelectedTransport((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }, []);

  const handleCreateAdventure = async () => {
    setError(""); // Clear previous errors
    const tripData = {
      ...fullTripData,
      specialRequirements: selectedRequirements,
      additionalRequirement: additionalRequirement.trim(), // Trim whitespace
      transportationPreference: selectedTransport,
    };

    // Optional: Add validation here if needed before calling createTrip

    console.log(
      "Attempting to create trip with data:",
      JSON.stringify(tripData, null, 2)
    ); // Log data being sent

    try {
      // Note: The original code structure suggests createTrip might not return the final data directly,
      // relying on the onSuccess callback instead. Adjust if createTrip actually returns data.
      const tripResult = await createTrip(tripData, {
        onLoadingChange: setLoading,
        onLoadingMessageChange: setLoadingMessage,
        onError: (err) => {
          // Check if this might be a partial success case
          if (err.includes("AI generation") || err.includes("recommendation")) {
            // This is likely a case where the trip was created but AI recommendations failed
            console.log("AI generation error but trip may have been created. Checking...");
            // We'll handle this in the try/catch, not here
          } else {
            // Use onError callback for service-level errors
            console.error("Error reported by createTrip service:", err);
            setError(err?.message || i18n.t("tripDetails.alerts.error.message"));
            setLoading(false); // Ensure loading is stopped on error
          }
        },
        onSuccess: (data) => {
          console.log("Trip created successfully:", data);
          setLoading(false); // Ensure loading is stopped on success

          // Check if AI generation failed but trip was created
          if (data && data.aiGenerationFailed) {
            // Show a warning that the trip was created but without AI recommendations
            Alert.alert(
              "Trip Created with Limited Features",
              "Your trip was created successfully, but we couldn't generate AI recommendations. You can still view and edit your trip details.",
              [
                {
                  text: "View Trip",
                  onPress: () => navigation.navigate("UserPlanScreen", { tripData: data }),
                },
              ]
            );
          } else {
            // Normal success flow
            Alert.alert(
              i18n.t("tripDetails.alerts.success.title"),
              i18n.t("tripDetails.alerts.success.message"),
              [
                {
                  text: i18n.t("tripDetails.alerts.success.ok"),
                  onPress: () => navigation.navigate("UserPlanScreen", { tripData: data }),
                },
              ]
            );
          }
        },
      });

      // Handle case where tripResult is returned directly
      if (tripResult) {
        console.log("Trip creation completed with direct return:", tripResult);
        
        // Check if this is a partial success (trip created but AI generation failed)
        if (tripResult.aiGenerationFailed) {
          Alert.alert(
            "Trip Created with Limited Features",
            "Your trip was created successfully, but we couldn't generate AI recommendations. You can still view and edit your trip details.",
            [
              {
                text: "View Trip",
                onPress: () => navigation.navigate("UserPlanScreen", { tripData: tripResult }),
              },
            ]
          );
        }
      }
    } catch (err) {
      // This catch block handles errors thrown *synchronously* by createTrip
      // or errors during the setup before the async operation within createTrip starts.
      // Asynchronous errors within createTrip (like network failures) should ideally be caught
      // and handled via the onError callback passed to it.
      console.error(
        "Synchronous error during createTrip call or in subsequent handling:",
        err
      );
      setLoading(false); // Ensure loading is stopped

      // Check if the error might indicate a partial success
      if (err.message && (
          err.message.includes("AI generation") || 
          err.message.includes("recommendation") ||
          err.message.includes("itinerary")
      )) {
        // This is likely a case where the trip was created but AI recommendations failed
        Alert.alert(
          "Trip May Have Been Created",
          "We encountered an issue with AI recommendations, but your trip may have been created. Would you like to check your trips or try again?",
          [
            {
              text: "View My Trips",
              onPress: () => navigation.navigate("TripListScreen"),
            },
            {
              text: "Try Again",
              onPress: handleCreateAdventure,
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
        return;
      }

      // Retry logic for specific network-related errors
      if (
        retryCount < 2 &&
        (err.message.includes("timed out") ||
          err.message.includes("Network request failed") ||
          err.message.includes("Failed to fetch"))
      ) {
        setRetryCount((prev) => prev + 1);
        Alert.alert(
          i18n.t("tripDetails.alerts.serverStarting.title"),
          i18n.t("tripDetails.alerts.serverStarting.message"),
          [
            {
              text: i18n.t("tripDetails.alerts.serverStarting.cancel"),
              style: "cancel",
              onPress: () => setLoading(false),
            }, // Ensure loading stops on cancel
            {
              text: i18n.t("tripDetails.alerts.serverStarting.retry"),
              onPress: handleCreateAdventure,
            }, // No arrow function needed
          ]
        );
      } else {
        // Generic error for other issues or after retries fail
        setError(err.message || i18n.t("tripDetails.alerts.error.message")); // Show specific error if available
        Alert.alert(
          i18n.t("tripDetails.alerts.error.title"),
          err.message || i18n.t("tripDetails.alerts.error.message")
        );
      }
    }
  };

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

  // --- Render Helper Functions ---

  const renderRequirementOption = (item) => {
    const isSelected = selectedRequirements.includes(item.value);
    const label = i18n.t(`tripDetails.specialRequirements.${item.value}`);
    return (
      <TouchableOpacity
        key={item.value}
        style={styles.optionTouchable}
        onPress={() => toggleRequirement(item.value)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={label}
      >
        <View
          style={[
            styles.checkboxBase,
            isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
          ]}
        />
        <Text style={styles.optionText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderTransportOption = (option) => {
    const isSelected = selectedTransport.includes(option.value);
    const label = i18n.t(`tripDetails.transportation.${option.value}`);
    return (
      <TouchableOpacity
        key={option.value}
        style={styles.optionTouchable}
        onPress={() => toggleTransport(option.value)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={label}
      >
        <View
          style={[
            styles.checkboxBase,
            isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
          ]}
        />
        <Text style={styles.optionText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {error ? <Text className="text-red-500 text-sm text-center mx-5 mb-2">{error}</Text> : null}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined} // 'height' might also work
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust offset as needed
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5 bg-white dark:bg-gray-900">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 justify-center items-center"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {i18n.t("tripDetails.title")}
            </Text>
          </View>
          {/* Adjusted to not rely on absolute positioning if header structure changes */}
          <Text className="text-base text-orange-500 font-semibold">
            {i18n.t("tripDetails.stepIndicator")}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          scrollEnabled={!loading}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Special Requirements */}
          <Text style={styles.sectionTitle}>
            {i18n.t("tripDetails.specialRequirements.title")}
          </Text>
          <View style={styles.optionsContainer}>
            {/* Defensive check before mapping */}
            {Array.isArray(SPECIAL_REQUIREMENTS) ? (
              SPECIAL_REQUIREMENTS.map(renderRequirementOption)
            ) : (
              <Text>Error: Special requirements not loaded.</Text>
            )}

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={i18n.t(
                  "tripDetails.specialRequirements.additionalPlaceholder"
                )}
                placeholderTextColor="#9CA3AF" // Use a less intrusive color
                value={additionalRequirement}
                onChangeText={setAdditionalRequirement}
                accessibilityLabel={i18n.t(
                  "tripDetails.specialRequirements.additionalPlaceholder"
                )}
                accessibilityRole="text" // Correct role
              />
            </View>
          </View>

          {/* Transportation Preference */}
          <Text style={styles.sectionTitle}>
            {i18n.t("tripDetails.transportation.title")}
          </Text>
          <View style={styles.optionsContainer}>
            {/* Defensive check before mapping */}
            {Array.isArray(TRANSPORTATION_OPTIONS) ? (
              TRANSPORTATION_OPTIONS.map(renderTransportOption)
            ) : (
              <Text>Error: Transportation options not loaded.</Text>
            )}
          </View>

          {/* Create Adventure Button */}
          <View style={styles.createButtonContainer}>
            <TouchableOpacity
              style={[
                styles.createButton,
                loading
                  ? styles.createButtonDisabled
                  : styles.createButtonEnabled,
              ]}
              onPress={handleCreateAdventure}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={i18n.t("tripDetails.buttons.createAdventure")}
              accessibilityState={{ disabled: loading }}
            >
              <View className="flex-row justify-center items-center">
                {loading ? (
                  <View className="flex-col items-center justify-center p-2.5">
                    <ActivityIndicator color="#FFF" size="small" />
                    {loadingMessage && (
                      <Text style={styles.loadingText}>{loadingMessage}</Text>
                    )}
                  </View>
                ) : (
                  <>
                    <Text style={styles.createButtonText}>
                      {i18n.t("tripDetails.buttons.createAdventure")}
                    </Text>
                    <Ionicons
                      name="star"
                      size={20}
                      color="#FFF"
                      style={styles.iconStyle}
                    />
                    <Feather
                      name="arrow-up-right"
                      size={20}
                      color="#FFF"
                      style={styles.iconStyle}
                    />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Bottom Buttons */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity
              style={styles.startFreshButton}
              onPress={handleStartFresh}
              disabled={loading} // Disable if loading
              accessibilityRole="button"
              accessibilityLabel={i18n.t("tripDetails.buttons.startFresh")}
              accessibilityState={{ disabled: loading }}
            >
              <Text style={styles.startFreshText}>
                {i18n.t("tripDetails.buttons.startFresh")}
              </Text>
            </TouchableOpacity>

            {/* Centered Home Button (Removed absolute positioning for robustness) */}
            {/* If you need it positioned specifically, consider adjusting layout */}
            {/* <TouchableOpacity
                            style={styles.homeButton} // Consider revising positioning
                            onPress={() => navigation.navigate('Home')} // Ensure 'Home' is the correct route name
                         >
                            <FontAwesome name="home" size={24} color="#333" />
                        </TouchableOpacity> */}
          </View>
          {/* Add Spacer at the bottom if needed for KeyboardAvoidingView */}
          {/* <View style={{ height: 50 }} /> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
