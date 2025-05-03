import React, { useState, useCallback, useEffect } from "react";
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
  StyleSheet,
} from "react-native";
import { useTheme } from "../../../ThemeProvider";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // Replace i18n import
import {
  SPECIAL_REQUIREMENTS,
  TRANSPORTATION_OPTIONS,
} from "../../config/constants";
import { createTrip } from "../../services/tripService";

// Define styles for better organization
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
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
  checkboxSelected: { borderColor: "#F97316", backgroundColor: "#F97316" },
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
  const { t } = useTranslation(); // Add translation hook
  const { isDarkMode, colors } = useTheme();
  const fullTripData = route.params?.fullTripData || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [additionalRequirement, setAdditionalRequirement] = useState("");
  const [selectedTransport, setSelectedTransport] = useState([]);

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

  const navigateToPlan = (apiResultData) => {
    // **MERGE DATA HERE**
    const finalTripDataForDisplay = {
      ...fullTripData, // Original data (destination, duration, budgetLevel, nationality etc.)
      ...apiResultData, // API response data (tripId, itinerary with additionalInfo)
      // Ensure API response doesn't accidentally overwrite crucial original fields if names clash
      // In this case, itinerary and tripId are added.
    };
    console.log(
      "Navigating to UserPlanScreen with merged data:",
      finalTripDataForDisplay
    );
    navigation.navigate("UserPlanScreen", {
      tripData: finalTripDataForDisplay,
    });
  };

  const handleCreateAdventure = async () => {
    setError("");
    setLoading(true);
    setLoadingMessage("Creating your adventure...");

    const tripDetailsPayload = {
      ...fullTripData,
      specialRequirements: selectedRequirements,
      additionalRequirement: additionalRequirement.trim(),
      transportationPreference: selectedTransport,
    };

    try {
      console.log(
        "[TripDetailsScreen] Sending trip details:",
        tripDetailsPayload
      );

      const tripResult = await createTrip(tripDetailsPayload, {
        onLoadingChange: (isLoading) => {
          setLoading(isLoading);
          if (!isLoading) {
            setLoadingMessage("");
          }
        },
        onLoadingMessageChange: setLoadingMessage,
        onError: (err) => {
          console.error(
            "[TripDetailsScreen] Error in createTrip callback:",
            err
          );
          setError(err.message || t("tripDetails.alerts.error.message"));
        },
      });

      if (!tripResult) {
        throw new Error("Failed to create trip. No response received.");
      }

      console.log("[TripDetailsScreen] Trip creation successful:", tripResult);

      if (tripResult.aiGenerationFailed) {
        Alert.alert(
          t("tripDetails.alerts.partialSuccess.title"),
          t("tripDetails.alerts.partialSuccess.message"),
          [
            {
              text: t("tripDetails.alerts.partialSuccess.viewButton"),
              onPress: () => navigateToPlan(tripResult),
            },
          ]
        );
      } else {
        navigateToPlan(tripResult);
      }
    } catch (err) {
      console.error("[TripDetailsScreen] Error during trip creation:", err);
      setError(t("tripDetails.alerts.error.createFailed"));
      Alert.alert(
        t("tripDetails.alerts.error.title"),
        t("tripDetails.alerts.error.createFailed"),
        [
          {
            text: t("common.buttons.ok"),
            onPress: () => setError(""),
          },
        ]
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleStartFresh = () => {
    Alert.alert(
      t("tripDetails.alerts.startFresh.title"),
      t("tripDetails.alerts.startFresh.message"),
      [
        {
          text: t("tripDetails.alerts.startFresh.cancel"),
          style: "cancel",
        },
        {
          text: t("tripDetails.alerts.startFresh.ok"),
          onPress: () => navigation.popToTop(),
        },
      ],
      { cancelable: true }
    );
  };

  // --- Render Helper Functions ---

  const renderRequirementOption = (item) => {
    const isSelected = selectedRequirements.includes(item.value);
    const label = t(`tripDetails.specialRequirements.${item.value}`);
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
    const label = t(`tripDetails.transportation.${option.value}`);
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
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />
      {error ? (
        <Text className="text-red-500 text-sm text-center mx-5 mb-2">
          {error}
        </Text>
      ) : null}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined} // 'height' might also work
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust offset as needed
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5 bg-white dark:bg-gray-900">
          <TouchableOpacity
            className="w-[50] h-[50] rounded-full bg-gray-100 dark:bg-gray-900 justify-center items-center"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("tripDetails.title")}
            </Text>
          </View>
          {/* Adjusted to not rely on absolute positioning if header structure changes */}
          <Text className="text-base text-orange-500 font-semibold">
            {t("tripDetails.stepIndicator")}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          scrollEnabled={!loading}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Special Requirements */}
          <Text style={styles.sectionTitle}>
            {t("tripDetails.specialRequirements.title")}
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
                placeholder={t(
                  "tripDetails.specialRequirements.additionalPlaceholder"
                )}
                placeholderTextColor="#9CA3AF" // Use a less intrusive color
                value={additionalRequirement}
                onChangeText={setAdditionalRequirement}
                accessibilityLabel={t(
                  "tripDetails.specialRequirements.additionalPlaceholder"
                )}
                accessibilityRole="text" // Correct role
              />
            </View>
          </View>

          {/* Transportation Preference */}
          <Text style={styles.sectionTitle}>
            {t("tripDetails.transportation.title")}
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
              accessibilityLabel={t("tripDetails.buttons.createAdventure")}
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
                      {t("tripDetails.buttons.createAdventure")}
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
              accessibilityLabel={t("tripDetails.buttons.startFresh")}
              accessibilityState={{ disabled: loading }}
            >
              <Text style={styles.startFreshText}>
                {t("tripDetails.buttons.startFresh")}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
