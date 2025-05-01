import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../../ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient"; // Import if using gradient for center button
import {
  HomeIcon,
  ListChecksIcon,
  SearchIcon,
  MessageSquareIcon,
  UserIcon,
  PlaneTakeoffIcon,
  PlaneIcon,
  PlaneLandingIcon,
  TicketIcon,
  TicketsPlane,
  TicketsPlaneIcon,
  Plane,
} from "lucide-react-native";

// Define the component, accepting activeRouteName as a prop

export default function FloatingBottomNav({ activeRouteName }) {
  const navigation = useNavigation();
  const { isDarkMode } = useTheme();

  // Define colors for active/inactive states based on theme
  const activeColor = isDarkMode ? "#fff" : "#fff";
  const inactiveColor = isDarkMode ? "#fff" : "#111";
  const activeBgColor = isDarkMode ? "#fff" : "#111";

  const isActive = (routeName) => activeRouteName === routeName;

  return (
    // Absolute positioning to float above content
    <View className="absolute bottom-6 left-6 right-6 z-50">
      {/* Container with shadow and rounded corners */}
      <View
        className={` ${
          isDarkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white  border-gray-200"
        } rounded-3xl shadow-xl py-4 px-6 `}
      >
        <View className="flex-row justify-between items-center">
          {/* Home Tab */}
          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => navigation.navigate("Home")}
          >
            <View
              className={`p-3 rounded-full ${
                isActive("Home") && (isDarkMode ? "bg-blue-600" : "bg-blue-500")
              }`}
            >
              <HomeIcon
                size={22}
                color={isActive("Home") ? activeColor : inactiveColor}
                strokeWidth={isActive("Home") ? 2 : 1.5}
              />
            </View>
            <Text
              className={`text-xs mt-1 font-medium ${
                isActive("Home")
                  ? isDarkMode
                    ? "text-blue-300"
                    : "text-blue-400"
                  : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Home
            </Text>
          </TouchableOpacity>

          {/* Trips Tab */}
          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => navigation.navigate("Trips")}
          >
            <View
              className={`p-3 rounded-full ${
                isActive("Trips") &&
                (isDarkMode ? "bg-blue-600" : "bg-blue-500")
              }`}
            >
              <ListChecksIcon
                size={22}
                color={isActive("Trips") ? activeColor : inactiveColor}
                strokeWidth={isActive("Trips") ? 2 : 1.5}
              />
            </View>
            <Text
              className={`text-xs mt-1 font-medium ${
                isActive("Trips")
                  ? isDarkMode
                    ? "text-blue-300"
                    : "text-blue-400"
                  : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Trips
            </Text>
          </TouchableOpacity>

          {/* Center Search Button */}
          {/* Added flex-1 to maintain spacing, adjust alignment if needed */}
          <View className="items-center flex-1">
            <TouchableOpacity
              className={`-mt-3 w-[60] h-[60] rounded-full justify-center items-center shadow-lg ${
                isDarkMode ? "bg-gray-600" : "bg-gray-300"
              }`}
              onPress={() => navigation.navigate("CreateTrip")}
            >
              <Plane
                size={28}
                color={isDarkMode ? "#fff" : "#111"}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => navigation.navigate("AssistantScreen")}
          >
            <View
              className={`p-3 rounded-full ${
                isActive("AssistantScreen") &&
                (isDarkMode ? "bg-blue-600" : "bg-blue-400")
              }`}
            >
              <MessageSquareIcon
                size={22}
                color={
                  isActive("AssistantScreen") ? activeColor : inactiveColor
                }
                strokeWidth={1.5}
              />
            </View>
            <Text
              className={`text-xs mt-1 font-medium ${
                isActive("AssistantScreen")
                  ? isDarkMode
                    ? "text-blue-300"
                    : "text-blue-400"
                  : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              AI Chat
            </Text>
          </TouchableOpacity>

          {/* Profile Tab - تم تغيير الاسم من Profile إلى ProfileSetting */}
          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => navigation.navigate("ProfileSetting")}
          >
            <View
              className={`p-3 rounded-full ${
                isActive("ProfileSetting") &&
                (isDarkMode ? "bg-blue-600" : "bg-blue-500")
              }`}
            >
              <UserIcon
                size={22}
                color={isActive("ProfileSetting") ? activeColor : inactiveColor}
                strokeWidth={isActive("ProfileSetting") ? 2 : 1.5}
              />
            </View>
            <Text
              className={`text-xs mt-1 font-medium ${
                isActive("ProfileSetting")
                  ? isDarkMode
                    ? "text-blue-300"
                    : "text-blue-400"
                  : isDarkMode
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
