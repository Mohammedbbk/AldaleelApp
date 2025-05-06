import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {
  Mail,
  Edit3,
  User,
  Plane,
  Globe,
  Bell,
  Palette,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import FloatingBottomNav from "../../components/navigation/FloatingBottomNav";
import { AuthContext } from "../../../AuthProvider";
import { useTheme } from "../../../ThemeProvider";

const profileOptions = [
  { id: "edit", label: "Edit Profile", icon: Edit3, screen: "EditProfile" },
  { id: "info", label: "Profile Info", icon: User, screen: "ProfileInfo" },
  {
    id: "prefs",
    label: "Travel Preferences",
    icon: Plane,
    screen: "TravelPreferences",
  },
  { id: "lang", label: "Language", icon: Globe, screen: "LanguageSettings" },
  {
    id: "notif",
    label: "Notifications",
    icon: Bell,
    screen: "NotificationSettings",
  },
  { id: "theme", label: "Theme", icon: Palette, screen: "ThemeSettings" },
];

export default function ProfileSetting() {
  const navigation = useNavigation();
  const { isDarkMode, colors } = useTheme();
  const currentRouteName = "Profile";
  const { logout } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.warn("No token found!");
          return;
        }

        const response = await axios.get(
          "http://10.0.2.2:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-500">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <Text className="text-gray-500">Failed to load profile.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 pt-5 ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 pb-8 ">
          <View
            className={`shadow-xl flex-row items-center justify-between ${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } p-5 rounded-2xl shadow-sm mb-8`}
          >
            <View className="flex-row items-center flex-shrink mr-4">
              <Image
                source={{ uri: userData.avatarUrl }}
                className="w-16 h-16 rounded-full mr-4 border-2 border-blue-100"
              />
              <View className="flex-shrink">
                <Text
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {userData.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Mail size={14} color={isDarkMode ? "#fff" : "#111"} />
                  <Text
                    className={`text-sm font-bold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } ml-1 `}
                  >
                    {userData.email}
                  </Text>
                </View>
              </View>
            </View>

            <View className="items-end space-y-2">
              <View className="items-center">
                <Text
                  className={`text-xs font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }  `}
                >
                  Completed Trips
                </Text>
                <Text className="text-xl font-bold text-blue-500">
                  {userData.completedTrips ?? 0}
                </Text>
              </View>
              <View className="items-center">
                <Text
                  className={`text-xs font-bold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } ml-1 `}
                >
                  Reviews
                </Text>
                <Text className="text-xl font-bold text-blue-500">
                  {userData.reviews ?? 0}
                </Text>
              </View>
            </View>
          </View>

          <View
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } rounded-2xl overflow-hidden shadow-xl`}
          >
            {profileOptions.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center justify-between p-4 ${
                  index < profileOptions.length - 1
                    ? isDarkMode
                      ? "border-b border-gray-600"
                      : "border-b border-gray-200"
                    : ""
                }`}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View className="flex-row items-center">
                  <item.icon size={20} color={isDarkMode ? "#fff" : "#111"} />
                  <Text
                    className={`text-base ml-4 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </Text>
                </View>
                <ChevronRight size={18} color={isDarkMode ? "#fff" : "#111"} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={logout}
              className={`flex-row items-center justify-between p-4 border-t ${
                isDarkMode
                  ? "border-gray-800 bg-red-500"
                  : "border-gray-100 bg-red-500"
              }`}
            >
              <View className="flex-row items-center">
                <LogOut size={20} color={isDarkMode ? "#fff" : "#fff"} />
                <Text
                  className={`text-base ml-4 ${
                    isDarkMode ? "text-white" : "text-white"
                  }`}
                >
                  Logout
                </Text>
              </View>
              <ChevronRight size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-24" />
      </ScrollView>

      <FloatingBottomNav activeRouteName="ProfileSetting" />
    </SafeAreaView>
  );
}