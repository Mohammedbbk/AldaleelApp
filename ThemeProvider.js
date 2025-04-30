import React, { createContext, useState, useEffect, useContext } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create theme context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState("system"); // 'system', 'light', or 'dark'
  const [themeColor, setThemeColor] = useState("blue"); // default theme color
  const [isLoading, setIsLoading] = useState(true);

  // Calculate the actual theme based on preferences
  const isDarkMode = themeMode === "system" 
    ? deviceColorScheme === "dark" 
    : themeMode === "dark";

  // Define the theme colors
  const themeColors = {
    blue: {
      primary: '#3b82f6',
      secondary: '#93c5fd',
    },
    green: {
      primary: '#10b981',
      secondary: '#a7f3d0',
    },
    purple: {
      primary: '#8b5cf6',
      secondary: '#c4b5fd',
    },
    pink: {
      primary: '#ec4899',
      secondary: '#fbcfe8',
    },
    orange: {
      primary: '#f97316',
      secondary: '#fed7aa',
    },
    teal: {
      primary: '#14b8a6',
      secondary: '#99f6e4',
    },
  };
  
  // Load theme preferences from AsyncStorage
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const storedThemeMode = await AsyncStorage.getItem("themeMode");
        const storedThemeColor = await AsyncStorage.getItem("themeColor");
        
        if (storedThemeMode) {
          setThemeMode(storedThemeMode);
        }
        
        if (storedThemeColor) {
          setThemeColor(storedThemeColor);
        }
      } catch (error) {
        console.error("Error loading theme settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemeSettings();
  }, []);

  // Function to change theme mode
  const setThemeModeAndStore = async (mode) => {
    try {
      await AsyncStorage.setItem("themeMode", mode);
      setThemeMode(mode);
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  };

  // Function to change theme color
  const setThemeColorAndStore = async (color) => {
    try {
      await AsyncStorage.setItem("themeColor", color);
      setThemeColor(color);
    } catch (error) {
      console.error("Error saving theme color:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode: setThemeModeAndStore,
        themeColor,
        setThemeColor: setThemeColorAndStore,
        isDarkMode,
        colors: themeColors[themeColor],
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider; 