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
import {
  Bell,
  Calendar,
  MessageSquare,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react-native";

export default function NotificationSettings() {
  const navigation = useNavigation();
  const { isDarkMode, colors } = useTheme();
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    tripUpdates: true,
    chatMessages: true,
    travelAlerts: false,
    promotions: false,
  });

  // Function to navigate back to ProfileSetting
  const navigateToProfileSetting = () => {
    navigation.navigate("ProfileSetting");
  };

  // Toggle handler for switches
  const toggleSwitch = (key) => {
    setNotificationSettings((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

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
          Notifications
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
              Manage your notification preferences for AI Travel Planner. Choose
              which notifications you want to receive.
            </Text>
          </View>

          {/* Notification Options */}
          <View
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } rounded-2xl shadow-sm overflow-hidden mb-6`}
          >
            {/* Trip Updates */}
            <View
              className={`flex-row items-center justify-between p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <View className="flex-row items-center">
                <Calendar size={20} color={isDarkMode ? "#fff" : "#111"} />
                <View className="ml-4">
                  <Text
                    className={` mb-1 text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Trip Updates
                  </Text>
                  <Text
                    className={`text-sm ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Changes to your travel plans
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{
                  false: isDarkMode ? "#374151" : "#d1d5db",
                  true: isDarkMode ? "#1d4ed8" : "#bfdbfe",
                }}
                thumbColor={
                  notificationSettings.tripUpdates
                    ? isDarkMode
                      ? "#60a5fa"
                      : "#3b82f6"
                    : isDarkMode
                    ? "#6b7280"
                    : "#f4f4f5"
                }
                onValueChange={() => toggleSwitch("tripUpdates")}
                value={notificationSettings.tripUpdates}
              />
            </View>

            {/* Chat Messages */}
            <View
              className={`flex-row items-center justify-between p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <View className="flex-row items-center">
                <MessageSquare size={20} color={isDarkMode ? "#fff" : "#111"} />
                <View className="ml-4">
                  <Text
                    className={` mb-1 text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Chat Messages
                  </Text>
                  <Text
                    className={`text-sm ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    AI planner responses and suggestions
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{
                  false: isDarkMode ? "#374151" : "#d1d5db",
                  true: isDarkMode ? "#1d4ed8" : "#bfdbfe",
                }}
                thumbColor={
                  notificationSettings.chatMessages
                    ? isDarkMode
                      ? "#60a5fa"
                      : "#3b82f6"
                    : isDarkMode
                    ? "#6b7280"
                    : "#f4f4f5"
                }
                onValueChange={() => toggleSwitch("chatMessages")}
                value={notificationSettings.chatMessages}
              />
            </View>

            {/* Travel Alerts */}
            <View
              className={`flex-row items-center justify-between p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <View className="flex-row items-center">
                <AlertTriangle size={20} color={isDarkMode ? "#fff" : "#111"} />
                <View className="ml-4">
                  <Text
                    className={` mb-1 text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Travel Alerts
                  </Text>
                  <Text
                    className={`text-sm ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    Important travel advisories
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{
                  false: isDarkMode ? "#374151" : "#d1d5db",
                  true: isDarkMode ? "#1d4ed8" : "#bfdbfe",
                }}
                thumbColor={
                  notificationSettings.travelAlerts
                    ? isDarkMode
                      ? "#60a5fa"
                      : "#3b82f6"
                    : isDarkMode
                    ? "#6b7280"
                    : "#f4f4f5"
                }
                onValueChange={() => toggleSwitch("travelAlerts")}
                value={notificationSettings.travelAlerts}
              />
            </View>

            {/* Promotions */}
            <View
              className={`flex-row items-center justify-between p-4 border-b ${
                isDarkMode
                  ? "bg-gray-800 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <View className="flex-row items-center">
                <Bell size={20} color={isDarkMode ? "#fff" : "#111"} />
                <View className="ml-4">
                  <Text
                    className={` mb-1 text-lg font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Promotions
                  </Text>
                  <Text
                    className={`text-sm ${
                      isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    New features and recommendations
                  </Text>
                </View>
              </View>
              <Switch
                trackColor={{
                  false: isDarkMode ? "#374151" : "#d1d5db",
                  true: isDarkMode ? "#1d4ed8" : "#bfdbfe",
                }}
                thumbColor={
                  notificationSettings.promotions
                    ? isDarkMode
                      ? "#60a5fa"
                      : "#3b82f6"
                    : isDarkMode
                    ? "#6b7280"
                    : "#f4f4f5"
                }
                onValueChange={() => toggleSwitch("promotions")}
                value={notificationSettings.promotions}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-blue-500 py-4 rounded-xl items-center"
            onPress={() => {
              // Here you would implement saving the settings to a backend or local storage
              // Save logic here...

              // Then navigate to ProfileSetting
              navigateToProfileSetting();
            }}
          >
            <Text className="text-white font-semibold text-base">
              Save Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
