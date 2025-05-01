import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Dimensions, StatusBar } from "react-native";
import { useTheme } from "../../../ThemeProvider";

const { width } = Dimensions.get("window");
const { isDarkMode, colors } = useTheme();

const TRAVEL_QUOTES = [
  "Adventure is worthwhile in itself. - Amelia Earhart",
  "Travel makes one modest. You see what a tiny place you occupy in the world. - Gustave Flaubert",
  "The world is a book and those who do not travel read only one page. - Saint Augustine",
  "Life is either a daring adventure or nothing at all. - Helen Keller",
  "Travel far enough, you meet yourself. - David Mitchell",
];

export default function LoadingScreen({ progress = 0, message = "" }) {
  const [quote, setQuote] = useState(TRAVEL_QUOTES[0]);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const quoteIndex = useRef(0);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    // Change quote every 5 seconds with fade animation
    const quoteInterval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Update quote after fade out
      setTimeout(() => {
        quoteIndex.current = (quoteIndex.current + 1) % TRAVEL_QUOTES.length;
        setQuote(TRAVEL_QUOTES[quoteIndex.current]);
      }, 500);
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, [progress]);

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-white justify-center items-center px-8">
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />

      {/* Progress Bar */}
      <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-8">
        <Animated.View className="h-full bg-[#24baec]" style={{ width }} />
      </View>

      {/* Loading Message */}
      {message ? (
        <Text className="text-lg text-gray-800 text-center mb-8">
          {message}
        </Text>
      ) : null}

      {/* Animated Quote */}
      <Animated.View className="items-center" style={{ opacity: fadeAnim }}>
        <Text className="text-lg text-gray-600 text-center italic">
          {quote}
        </Text>
      </Animated.View>

      {/* Background Animation */}
      <View className="absolute inset-0 -z-10 opacity-5">
        <View className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#24baec]" />
        <View className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-[#FF8C00]" />
      </View>
    </View>
  );
}
