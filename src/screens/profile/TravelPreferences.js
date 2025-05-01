// screens/TravelPreferences.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from "react-native";
import { useTheme } from "../../../ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, CheckCircle, Circle } from "lucide-react-native";

export default function TravelPreferences() {
  const navigation = useNavigation();

  // Default travel preferences state
  const [preferences, setPreferences] = useState({
    interests: {
      culture: true,
      nature: true,
      food: true,
      shopping: false,
      adventure: false,
      relaxation: true,
    },
    pace: "balanced", // 'relaxed', 'balanced', 'intense'
    requirements: {
      halalFood: true,
      wheelchairAccessible: false,
      kidFriendly: false,
      petFriendly: false,
    },
    transportation: "mix", // 'public', 'private', 'walking', 'mix'
  });

  // Function to navigate back to ProfileSetting
  const navigateToProfileSetting = () => {
    navigation.navigate("ProfileSetting");
  };

  // Toggle boolean preferences
  const toggleInterest = (key) => {
    setPreferences((prev) => ({
      ...prev,
      interests: {
        ...prev.interests,
        [key]: !prev.interests[key],
      },
    }));
  };

  const toggleRequirement = (key) => {
    setPreferences((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [key]: !prev.requirements[key],
      },
    }));
  };

  // Set single-choice preferences
  const setPace = (value) => {
    setPreferences((prev) => ({
      ...prev,
      pace: value,
    }));
  };

  const setTransportation = (value) => {
    setPreferences((prev) => ({
      ...prev,
      transportation: value,
    }));
  };

  const { isDarkMode, colors } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1 bg-gray-50 dark:bg-gray-900 pt-5 ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />
      {/* Header with back button */}
      <View
        className={`flex-row items-center px-4 py-3 ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <TouchableOpacity onPress={navigateToProfileSetting} className="p-2">
          <ChevronLeft size={24} color={isDarkMode ? "#fff" : "#111"} />
        </TouchableOpacity>
        <Text
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          } ml-4`}
        >
          Default Travel Preferences
        </Text>
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6">
          {/* Description */}
          <View className="mb-6">
            <Text
              className={`text-base ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Set your default travel preferences. These will be applied
              automatically when creating new trips, but you can always
              customize them for each trip.
            </Text>
          </View>

          {/* Interests Section */}
          <View
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } rounded-2xl shadow-sm overflow-hidden mb-6`}
          >
            <View
              className={`p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Text
                className={` mb-1 text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Travel Interests
              </Text>
              <Text
                className={`text-sm ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Select what you typically enjoy during your trips
              </Text>
            </View>

            <View className="p-2">
              <View className="flex-row flex-wrap">
                {/* Interest Items */}
                <InterestItem
                  label="Culture"
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                  emoji="🏛"
                  selected={preferences.interests.culture}
                  onPress={() => toggleInterest("culture")}
                />
                <InterestItem
                  label="Nature"
                  emoji="🌲"
                  selected={preferences.interests.nature}
                  onPress={() => toggleInterest("nature")}
                />
                <InterestItem
                  label="Food"
                  emoji="🍽"
                  selected={preferences.interests.food}
                  onPress={() => toggleInterest("food")}
                />
                <InterestItem
                  label="Shopping"
                  emoji="🛍"
                  selected={preferences.interests.shopping}
                  onPress={() => toggleInterest("shopping")}
                />
                <InterestItem
                  label="Adventure"
                  emoji="🗺"
                  selected={preferences.interests.adventure}
                  onPress={() => toggleInterest("adventure")}
                />
                <InterestItem
                  label="Relaxation"
                  emoji="🧘"
                  selected={preferences.interests.relaxation}
                  onPress={() => toggleInterest("relaxation")}
                />
              </View>
            </View>
          </View>

          {/* Trip Pace Section */}
          <View
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } rounded-2xl shadow-sm overflow-hidden mb-6`}
          >
            <View
              className={` p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Text
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Trip Pace
              </Text>
              <Text
                className={`text-sm ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                How do you prefer to explore?
              </Text>
            </View>

            <View className="p-4">
              <View className="flex-row justify-between">
                <PaceOption
                  label="Relaxed"
                  selected={preferences.pace === "relaxed"}
                  onPress={() => setPace("relaxed")}
                />
                <PaceOption
                  label="Balanced"
                  selected={preferences.pace === "balanced"}
                  onPress={() => setPace("balanced")}
                />
                <PaceOption
                  label="Intense"
                  selected={preferences.pace === "intense"}
                  onPress={() => setPace("intense")}
                />
              </View>
            </View>
          </View>

          {/* Special Requirements */}
          <View
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } rounded-2xl shadow-sm overflow-hidden mb-6`}
          >
            <View
              className={` p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Text
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Special Requirements
              </Text>
              <Text
                className={`text-sm ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Your typical travel needs
              </Text>
            </View>

            <View>
              <RequirementItem
                label="Halal Food Required"
                value={preferences.requirements.halalFood}
                onToggle={() => toggleRequirement("halalFood")}
              />
              <RequirementItem
                label="Wheelchair Accessible"
                value={preferences.requirements.wheelchairAccessible}
                onToggle={() => toggleRequirement("wheelchairAccessible")}
              />
              <RequirementItem
                label="Kid-Friendly"
                value={preferences.requirements.kidFriendly}
                onToggle={() => toggleRequirement("kidFriendly")}
              />
              <RequirementItem
                label="Pet-Friendly"
                value={preferences.requirements.petFriendly}
                onToggle={() => toggleRequirement("petFriendly")}
                noBorder
              />
            </View>
          </View>

          {/* Transportation Preference */}
          <View
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } rounded-2xl shadow-sm overflow-hidden mb-6`}
          >
            <View
              className={` p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Text
                className={`text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Transportation Preference
              </Text>
              <Text
                className={`text-sm ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                How do you prefer to get around?
              </Text>
            </View>

            <View className="p-4">
              <RadioOption
                label="Public Transport"
                selected={preferences.transportation === "public"}
                onPress={() => setTransportation("public")}
              />
              <RadioOption
                label="Private Car"
                selected={preferences.transportation === "private"}
                onPress={() => setTransportation("private")}
              />
              <RadioOption
                label="Walking/Biking"
                selected={preferences.transportation === "walking"}
                onPress={() => setTransportation("walking")}
              />
              <RadioOption
                label="Mix of all"
                selected={preferences.transportation === "mix"}
                onPress={() => setTransportation("mix")}
                noBorder
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className={`py-4 rounded-xl items-center ${
              isDarkMode ? "bg-blue-600" : "bg-blue-500"
            }`}
            onPress={() => {
              // ...existing code...
            }}
          >
            <Text className="text-white font-semibold text-base">
              Save Default Preferences
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}

// Component for interest item
const InterestItem = ({ label, emoji, selected, onPress }) => {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity
      className={`m-2 p-3 rounded-xl border ${
        selected
          ? isDarkMode
            ? "bg-blue-900 border-blue-700"
            : "bg-blue-50 border-blue-500"
          : isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "border-gray-200"
      }`}
      onPress={onPress}
    >
      <View className="items-center">
        <Text className="text-2xl mb-1">{emoji}</Text>
        <Text
          className={`text-sm ${
            selected
              ? isDarkMode
                ? "text-blue-400 font-medium"
                : "text-blue-500 font-medium"
              : isDarkMode
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Component for pace option
const PaceOption = ({ label, selected, onPress }) => {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity
      className={`px-5 py-3 rounded-xl ${
        selected
          ? isDarkMode
            ? "bg-blue-600"
            : "bg-blue-500"
          : isDarkMode
          ? "bg-gray-900"
          : "bg-gray-100"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-center ${
          selected
            ? "text-white font-medium"
            : isDarkMode
            ? "text-gray-300"
            : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Component for requirement item with switch
const RequirementItem = ({ label, value, onToggle, noBorder = false }) => {
  const { isDarkMode } = useTheme();
  return (
    <View
      className={`flex-row items-center justify-between p-4 ${
        !noBorder
          ? isDarkMode
            ? "border-b border-gray-600"
            : "border-b border-gray-100"
          : ""
      }`}
    >
      <Text
        className={`text-base ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
      <Switch
        trackColor={{
          false: isDarkMode ? "#374151" : "#d1d5db",
          true: isDarkMode ? "#1d4ed8" : "#bfdbfe",
        }}
        thumbColor={value ? "#3b82f6" : isDarkMode ? "#6b7280" : "#f4f4f5"}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );
};

// Component for radio option
const RadioOption = ({ label, selected, onPress, noBorder = false }) => {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity
      className={`flex-row items-center py-3 ${
        !noBorder
          ? isDarkMode
            ? "border-b border-gray-600"
            : "border-b border-gray-100"
          : ""
      }`}
      onPress={onPress}
    >
      {selected ? (
        <CheckCircle size={20} color={isDarkMode ? "#60a5fa" : "#3b82f6"} />
      ) : (
        <Circle size={20} color={isDarkMode ? "#6b7280" : "#9ca3af"} />
      )}
      <Text
        className={`ml-3 text-base ${
          selected
            ? isDarkMode
              ? "text-blue-400 font-medium"
              : "text-blue-500 font-medium"
            : isDarkMode
            ? "text-gray-300"
            : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
