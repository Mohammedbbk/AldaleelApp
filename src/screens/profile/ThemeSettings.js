import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ArrowLeft,
  Sun,
  Moon,
  Smartphone,
  Check,
  Palette,
} from "lucide-react-native";
import { useTheme } from "../../../ThemeProvider";

export default function ThemeSettingsScreen() {
  const navigation = useNavigation();
  const {
    themeMode,
    setThemeMode,
    themeColor,
    setThemeColor,
    isDarkMode,
    colors,
  } = useTheme();

  const themeColors = [
    { id: "blue", name: "Blue", primary: "#3b82f6", secondary: "#93c5fd" },
    { id: "green", name: "Green", primary: "#10b981", secondary: "#a7f3d0" },
    { id: "purple", name: "Purple", primary: "#8b5cf6", secondary: "#c4b5fd" },
    { id: "pink", name: "Pink", primary: "#ec4899", secondary: "#fbcfe8" },
    { id: "orange", name: "Orange", primary: "#f97316", secondary: "#fed7aa" },
    { id: "teal", name: "Teal", primary: "#14b8a6", secondary: "#99f6e4" },
  ];

  const handleDarkModeToggle = () => {
    if (themeMode === "system") {
      setThemeMode("dark");
    } else if (themeMode === "dark") {
      setThemeMode("light");
    } else {
      setThemeMode("dark");
    }
  };

  const handleSystemThemeToggle = (value) => {
    setThemeMode(value ? "system" : isDarkMode ? "dark" : "light");
  };

  const handleColorSelect = (colorId) => {
    setThemeColor(colorId);
  };

  const saveThemeSettings = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } pt-5`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />

      <View
        className={`flex-row items-center px-4 py-3 ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ArrowLeft size={24} color={isDarkMode ? "#e5e7eb" : "#374151"} />
        </TouchableOpacity>
        <Text
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          } ml-2`}
        >
          Theme Settings
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 pb-8 gap-5">
          <View
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } rounded-2xl shadow-sm overflow-hidden`}
          >
            <View
              className={`p-4 border-b ${
                isDarkMode ? "border-gray-600" : "border-gray-200"
              } flex-row items-center justify-between`}
            >
              <View className="flex-row items-center">
                <Smartphone
                  size={20}
                  color={isDarkMode ? "#d1d5db" : "#6b7280"}
                />
                <Text
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } ml-3`}
                >
                  Use System Theme
                </Text>
              </View>
              <Switch
                value={themeMode === "system"}
                onValueChange={handleSystemThemeToggle}
                trackColor={{
                  false: isDarkMode ? "#4b5563" : "#d1d5db",
                  true: colors.secondary,
                }}
                thumbColor={
                  themeMode === "system"
                    ? colors.primary
                    : isDarkMode
                    ? "#d1d5db"
                    : "#f4f4f5"
                }
                ios_backgroundColor={isDarkMode ? "#4b5563" : "#d1d5db"}
              />
            </View>

            <View
              className={`p-4 py-6 border-b ${
                isDarkMode ? "border-gray-600" : "border-gray-200"
              } flex-row items-center justify-between`}
            >
              <View className="flex-row items-center">
                <Sun size={20} color={isDarkMode ? "#d1d5db" : "#6b7280"} />
                <Text
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } ml-3`}
                >
                  Light Mode
                </Text>
              </View>
              <View>
                {themeMode === "light" && (
                  <View className="p-1 bg-blue-500 rounded-full">
                    <Check size={16} color="#FFFFFF" />
                  </View>
                )}
                {themeMode === "system" && (
                  <Text
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    System Controlled
                  </Text>
                )}
                {themeMode === "dark" && (
                  <TouchableOpacity
                    onPress={handleDarkModeToggle}
                    className={`px-3 py-1 ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-50"
                    } rounded-full`}
                  >
                    <Text
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Enable
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View
              className={`p-4 py-6 border-b ${
                isDarkMode ? "border-gray-600" : "border-gray-200"
              } flex-row items-center justify-between`}
            >
              <View className="flex-row items-center">
                <Moon size={20} color={isDarkMode ? "#d1d5db" : "#6b7280"} />
                <Text
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } ml-3`}
                >
                  Dark Mode
                </Text>
              </View>
              <View>
                {themeMode === "dark" && (
                  <View className="p-1 bg-blue-500 rounded-full">
                    <Check size={16} color="#FFFFFF" />
                  </View>
                )}
                {themeMode === "system" && (
                  <Text
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    System Controlled
                  </Text>
                )}
                {themeMode === "light" && (
                  <TouchableOpacity
                    onPress={handleDarkModeToggle}
                    className={`px-3 py-1 ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-50"
                    } rounded-full`}
                  >
                    <Text
                      className={`text-xs ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Enable
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          <View
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            } rounded-2xl shadow-sm overflow-hidden`}
          >
            <View
              className={`p-4 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <View className="flex-row items-center">
                <Palette size={20} color={isDarkMode ? "#d1d5db" : "#6b7280"} />
                <Text
                  className={`text-base font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } ml-3`}
                >
                  App Color Theme
                </Text>
              </View>
              <Text
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } mt-1 ml-8`}
              >
                Select a primary color for the app interface
              </Text>
            </View>

            <View className="p-4">
              <View className="flex-row flex-wrap justify-between">
                {themeColors.map((color) => (
                  <TouchableOpacity
                    key={color.id}
                    onPress={() => handleColorSelect(color.id)}
                    className="mb-4 items-center"
                    style={{ width: "33%" }}
                  >
                    <View className="relative">
                      <View
                        className="w-16 h-16 rounded-full mb-2"
                        style={{ backgroundColor: color.primary }}
                      />
                      {themeColor === color.id && (
                        <View
                          className={`absolute bottom-2 right-0 ${
                            isDarkMode ? "bg-gray-900" : "bg-white"
                          } p-1 rounded-full border-2`}
                          style={{ borderColor: color.primary }}
                        >
                          <Check size={16} color={color.primary} />
                        </View>
                      )}
                    </View>
                    <Text
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {color.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={saveThemeSettings}
            className="mt-6 p-4 rounded-xl"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold text-base text-center">
              Save Theme Settings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}