import React from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet, // Import StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from '../../../ThemeProvider'; // Import ThemeProvider

// Pictures - Make sure these paths are correct
import visa from "../../../assets/Information_pictures/Visa.png";
import health from "../../../assets/Information_pictures/Health.png";
import language from "../../../assets/Information_pictures/Language.png";
import local from "../../../assets/Information_pictures/Local.png";
import transportation from "../../../assets/Information_pictures/Transportation.png";
import currency from "../../../assets/Information_pictures/Currency.png";

// Fallback image for loading errors
import placeholderImage from "../../../assets/Information_pictures/Language.png";

const titles = [
  {
    number: 1,
    title: "Visa Requirements",
    image: visa,
    contentKey: "visa",
    screen: "VisaScreen",
  },
  {
    number: 2,
    title: "Local Customs",
    image: local,
    contentKey: "local",
    screen: "LocalScreen",
  },
  {
    number: 3,
    title: "Currency Information",
    image: currency,
    contentKey: "currency",
    screen: "CurrencyScreen",
  },
  {
    number: 4,
    title: "Health & Safety",
    image: health,
    contentKey: "health",
    screen: "HealthScreen",
  },
  {
    number: 5,
    title: "Transportation",
    image: transportation,
    contentKey: "transportation",
    screen: "TransportationScreen",
  },
  {
    number: 6,
    title: "Language Basics",
    image: language,
    contentKey: "language",
    screen: "LanguageScreen",
  },
];

const InformationScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { isDarkMode } = useTheme();
  
  // Get nationality and destination from route params
  const { nationality, destination } = route.params || {};

  const handleBack = () => {
    navigation.navigate("UserPlanScreen");
  };

  const handleHome = () => {
    navigation.navigate("Home");
  };

  const handleShare = () => {
    Alert.alert(
      "Share Feature",
      "Sharing functionality will be available in the next update.",
      [{ text: "OK", onPress: () => console.log("Share alert closed") }]
    );
  };

  const handleEditPlan = () => {
    navigation.navigate("AssistantScreen");
  };

  const handleSubScreens = (item) => {
    if (!nationality || !destination) {
      const missingParams = [];
      if (!nationality) missingParams.push("nationality");
      if (!destination) missingParams.push("destination");
      
      Alert.alert(
        "Missing Information", 
        `Please provide your ${missingParams.join(" and ")} to view this information.`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Go to Trip Creation", 
            onPress: () => navigation.navigate("CreateTrip") 
          }
        ]
      );
      return;
    }
    
    // Navigate to the appropriate screen with all necessary parameters
    try {
      navigation.navigate(item.screen, {
        contentKey: item.contentKey,
        nationality,
        destination
      });
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert(
        "Navigation Error",
        "An error occurred while navigating to the information screen. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-[#f5f5f5]'}`}>
      {/* Header Section */}
      <View className={`flex-row items-center justify-between py-2.5 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E5E5EA]'} border-b`}>
        <Text className={`text-[17px] font-semibold ${isDarkMode ? 'text-white' : 'text-black'} text-center absolute left-0 right-0`}>
          Information Hub
        </Text>
        <View className="flex-row justify-end p-2.5 px-[15px] gap-5">
          <TouchableOpacity 
            onPress={handleBack}
            accessibilityRole="button"
            accessibilityLabel="Go back to trip"
            className="p-1.5" // Increased touch target
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={isDarkMode ? "#4B97EE" : "#007AFF"}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleHome}
            accessibilityRole="button"
            accessibilityLabel="Go to home screen"
            className="p-1.5" // Increased touch target
          >
            <Ionicons
              name="home-outline"
              size={24}
              color={isDarkMode ? "#4B97EE" : "#007AFF"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-end p-2.5 px-[15px] gap-5">
          <TouchableOpacity 
            onPress={handleShare}
            accessibilityRole="button"
            accessibilityLabel="Share information"
            className="p-1.5" // Increased touch target
          >
            <Ionicons
              name="share-outline"
              size={24}
              color={isDarkMode ? "#4B97EE" : "#007AFF"}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleEditPlan}
            accessibilityRole="button"
            accessibilityLabel="Edit plan"
            className="p-1.5" // Increased touch target
          >
            <Ionicons
              name="pencil-outline"
              size={24}
              color={isDarkMode ? "#4B97EE" : "#007AFF"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="pb-[100px] px-2.5" // Reduced padding
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col items-stretch pt-5 gap-5">
          {titles.map((item) => (
            <TouchableOpacity
              key={item.number}
              className={`flex-row justify-between items-center p-[5px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-[20px] overflow-hidden shadow-md`}
              activeOpacity={0.9}
              onPress={() => handleSubScreens(item)}
              accessibilityRole="button"
              accessibilityLabel={`View ${item.title}`}
            >
              <Image
                className="rounded-[20px] bg-[#555] h-[130px] w-[100px]"
                source={item.image}
                defaultSource={placeholderImage}
                onError={(e) => console.warn(`Image load error for ${item.title}:`, e.nativeEvent.error)}
                resizeMode="cover"
              />
              <Text className={`text-[18px] font-normal text-center ${isDarkMode ? 'text-white' : 'text-black'} flex-1 p-2.5`}>
                {item.title}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={isDarkMode ? "#4B97EE" : "#007AFF"} 
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Back to Trip Button - Using handleBack to consolidate navigation logic */}
      <TouchableOpacity
        className={`${isDarkMode ? 'bg-blue-600' : 'bg-[#24BAEC]'} mx-5 p-[15px] rounded-lg absolute bottom-[30px] left-0 right-0`}
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Back to trip"
      >
        <Text className="text-white text-center text-base font-semibold">
          Back to Trip
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Use hex color
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adjust as needed
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerButton: {
    padding: 5, // Add padding for easier tapping
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600", // Semibold is common for iOS titles
    color: "black",
    textAlign: "center",
    flex: 1, // Allow title to take space but center
    marginHorizontal: 10, // Add horizontal margin
  },
  headerRightButtons: {
    flexDirection: "row",
    // Add gap if needed: gap: 15,
  },
  scrollView: {
    flex: 1, // Ensure ScrollView takes available space
  },
  scrollViewContent: {
    paddingHorizontal: 10, // Use consistent padding
    paddingVertical: 20, // Add vertical padding
    paddingBottom: 40, // Ensure space at the bottom
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10, // Use consistent padding
    backgroundColor: "white",
    borderRadius: 12, // Slightly less rounding
    marginBottom: 15, // Replaced gap with marginBottom
    // iOS Shadow (optional)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Android Shadow (optional)
    elevation: 3,
    overflow: "hidden", // Keep overflow hidden
  },
  itemImage: {
    height: 80, // Adjust size as needed
    width: 80, // Adjust size as needed
    borderRadius: 8, // Match container rounding
    backgroundColor: "#E5E7EB", // Placeholder color
  },
  itemTextContainer: {
    flex: 1,
    alignItems: "center", // Center text horizontally
    paddingHorizontal: 15, // Add padding around text
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "400", // Normal weight
    textAlign: "center",
    color: "black",
  },
  itemChevron: {
    // No specific style needed unless padding is desired
    marginRight: 5, // Add slight margin
  },
});

export default InformationScreen;
