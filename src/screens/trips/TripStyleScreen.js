import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  useColorScheme,
} from "react-native";
import { useTheme } from "../../../ThemeProvider";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { INTERESTS, TRIP_PACES } from "../../config/tripConstants";

export function TripStyleScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { isDarkMode, colors } = useTheme();
  const colorScheme = useColorScheme();
  const stepOneData = route.params?.stepOneData || {};

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedTripPace, setSelectedTripPace] = useState("");
  const [validationError, setValidationError] = useState("");

  const toggleInterest = (interest) => {
    setValidationError("");
    setSelectedInterests((prevInterests) => {
      if (prevInterests.includes(interest)) {
        return prevInterests.filter((i) => i !== interest);
      } else {
        return [...prevInterests, interest];
      }
    });
  };

  const isFormValid = selectedInterests.length > 0 && selectedTripPace !== "";

  const handleNextStep = () => {
    if (!isFormValid) {
      setValidationError(t("tripStyle.validation.missingFields"));
      return;
    }
    const mergedData = {
      ...stepOneData,
      interests: selectedInterests,
      tripPace: selectedTripPace,
    };
    navigation.navigate("TripDetailsScreen", { fullTripData: mergedData });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#1f2937" : "#fff"}
      />

      <View className="flex-row items-center justify-between px-5 pt-2.5 pb-5 bg-white dark:bg-gray-900">
        <TouchableOpacity
          className="w-[50] h-[50] rounded-full bg-gray-100 dark:bg-gray-900 justify-center items-center"
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t("accessibility.backButton")}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("tripStyle.title")}
          </Text>
        </View>
        <Text className="text-base text-orange-500 font-semibold">
          {t("tripStyle.stepIndicator")}
        </Text>
      </View>

      <ScrollView className="px-5 pb-24">
        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mt-5">
          {t("tripStyle.interests.title")}
        </Text>
        {validationError && (
          <Text className="text-red-500 mb-4">{validationError}</Text>
        )}
        <View className="space-y-3">
          {INTERESTS.map((item) => {
            const isSelected = selectedInterests.includes(item.value);
            return (
              <TouchableOpacity
                key={item.value}
                className={`flex-row items-center justify-between p-4 rounded-lg border-2 ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900"
                    : "border-blue-400 dark:border-blue-600"
                }`}
                onPress={() => toggleInterest(item.value)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={t(`tripStyle.interests.${item.value}`)}
              >
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{item.emoji}</Text>
                  <Text
                    className={`text-base ${
                      isSelected
                        ? "font-semibold text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {t(`tripStyle.interests.${item.value}`)}
                  </Text>
                </View>
                <View
                  className={`w-6 h-6 rounded border-2 items-center justify-center ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900"
                      : "border-blue-400 dark:border-blue-600"
                  }`}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#FF8C00" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mt-10">
          {t("tripStyle.pace.title")}
        </Text>
        <View className="flex-row justify-between">
          {TRIP_PACES.map((pace) => {
            const isSelected = selectedTripPace === pace.value;
            return (
              <TouchableOpacity
                key={pace.value}
                className={`flex-1 mx-2 py-4 rounded-full border-2 items-center ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900"
                    : "border-blue-400 dark:border-blue-600"
                }`}
                onPress={() => {
                  setValidationError("");
                  setSelectedTripPace(pace.value);
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={t(`tripStyle.pace.${pace.value}`)}
              >
                <Text
                  className={`text-base ${
                    isSelected
                      ? "font-semibold text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {t(`tripStyle.pace.${pace.value}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-3 pb-5 border-t border-gray-100">
        <View className="flex-row justify-between items-center h-[50px]">
          <TouchableOpacity
            className="w-[50px] h-[50px] rounded-full bg-gray-100 justify-center items-center shadow shadow-black/5"
            onPress={() => navigation.navigate("HomePage")}
            accessibilityRole="button"
            accessibilityLabel={t("accessibility.homeButton")}
          >
            <FontAwesome
              name="home"
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#333"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row flex-1 items-center justify-center rounded-full px-6 py-3 shadow shadow-black/10 ml-4 ${
              isFormValid ? "bg-sky-500" : "bg-sky-300"
            }`}
            onPress={handleNextStep}
            disabled={!isFormValid}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isFormValid }}
            accessibilityLabel={t("tripStyle.buttons.next")}
          >
            <Text className="text-white font-medium mr-2">
              {t("tripStyle.buttons.next")}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default TripStyleScreen;