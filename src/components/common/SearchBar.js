import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../ThemeProvider";
const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search...",
  onSearchPress,
  containerClassName = "",
}) => {
  const { isDarkMode, colors } = useTheme();
  return (
    <View
      className={`flex-row items-center ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-50 border-gray-200"
      } rounded-full px-4 shadow ${containerClassName}`}
    >
      <TextInput
        className="flex-1 text-base text-gray-800 mr-2"
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#fff" : "#111"}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        className="bg-blue-500 rounded-full p-3 -mr-2"
        onPress={onSearchPress}
      >
        <Icon name="search" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
