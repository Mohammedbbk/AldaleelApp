import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  HomeIcon,
  ListChecksIcon,
  SearchIcon,
  MessageSquareIcon,
  UserIcon,
} from "lucide-react-native";

export default function FloatingBottomNav({ activeRouteName }) {
  const navigation = useNavigation();

  const isActive = (routeName) => activeRouteName === routeName;

  const activeColor = "#24baec";
  const inactiveColor = "#1b1f26b8";
  const activeBgColor = "#e0f4ff";

  return (
    <View className="absolute bottom-6 left-6 right-6 z-50">
      <View className="bg-b rounded-3xl shadow-xl py-4 px-6">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => navigation.navigate("Home")}
          >
            <View
              className={`p-2 rounded-full ${
                isActive("Home") ? `bg-[${activeBgColor}]` : ""
              }`}
            >
              <HomeIcon
                size={22}
                color={isActive("Home") ? activeColor : inactiveColor}
                strokeWidth={isActive("Home") ? 2.5 : 1.5}
              />
            </View>
            <Text
              className={`text-xs mt-1 font-medium ${
                isActive("Home")
                  ? `text-[${activeColor}]`
                  : `text-[${inactiveColor}]`
              }`}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => navigation.navigate("Trips")}
          >
            <View
              className={`p-2 rounded-full ${
                isActive("Trips") ? `bg-[${activeBgColor}]` : ""
              }`}
            >
              <ListChecksIcon
                size={22}
                color={isActive("Trips") ? activeColor : inactiveColor}
                strokeWidth={1.5}
              />
            </View>
            <Text
              className={`text-xs mt-1 ${
                isActive("Trips")
                  ? `text-[${activeColor}]`
                  : `text-[${inactiveColor}]`
              }`}
            >
              Trips
            </Text>
          </TouchableOpacity>

          <View className="items-center flex-1">
            <TouchableOpacity
              className="-mt-8 bg-gradient-to-r from-[#24baec] to-[#1a8bec] w-16 h-16 rounded-full justify-center items-center shadow-lg"
              onPress={() => navigation.navigate("Search")}
            >
              <SearchIcon size={28} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => navigation.navigate("AssistantScreen")}
          >
            <View
              className={`p-2 rounded-full ${
                isActive("AIChat") ? `bg-[${activeBgColor}]` : ""
              }`}
            >
              <MessageSquareIcon
                size={22}
                color={isActive("AIChat") ? activeColor : inactiveColor}
                strokeWidth={1.5}
              />
            </View>
            <Text
              className={`text-xs mt-1 ${
                isActive("AIChat")
                  ? `text-[${activeColor}]`
                  : `text-[${inactiveColor}]`
              }`}
            >
              AI Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center flex-1"
            onPress={() => navigation.navigate("ProfileSetting")}
          >
            <View
              className={`p-2 rounded-full ${
                isActive("Profile") ? `bg-[${activeBgColor}]` : ""
              }`}
            >
              <UserIcon
                size={22}
                color={isActive("Profile") ? activeColor : inactiveColor}
                strokeWidth={1.5}
              />
            </View>
            <Text
              className={`text-xs mt-1 ${
                isActive("Profile")
                  ? `text-[${activeColor}]`
                  : `text-[${inactiveColor}]`
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