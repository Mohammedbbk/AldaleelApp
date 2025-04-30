import React from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Share, // Import Share API
  StyleSheet, // Import StyleSheet
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// Pictures - Make sure these paths are correct
import visa from "../../../assets/Information_pictures/Visa.png";
import health from "../../../assets/Information_pictures/Health.png";
import language from "../../../assets/Information_pictures/Language.png";
import local from "../../../assets/Information_pictures/Local.png";
import transportation from "../../../assets/Information_pictures/Transportation.png";
import currency from "../../../assets/Information_pictures/Currency.png";

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
  const { t } = useTranslation(); // Hook called at top level - OK
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get nationality and destination from route params
  const { nationality, destination } = route.params || {};
  
  // Debug logging
  console.log("InformationScreen received params:", { nationality, destination });

  const handleBack = () => {
    navigation.navigate("UserPlanScreen");
  };

  const handleHome = () => {
    //TBD
  };
  const handleBackToTrips = () => {
    // Navigate to the main Home screen
    navigation.navigate("Trips");
  };

  const handleEditPlan = () => {
    navigation.navigate("AssistantScreen");
  };

  const handleShare = () => {
    // Implementation pending
  };

  const handleSubScreens = (item) => {
    if (!nationality || !destination) {
      const missingParams = [];
      if (!nationality) missingParams.push("nationality");
      if (!destination) missingParams.push("destination");
      
      Alert.alert(
        "Missing Information", 
        `Please provide your ${missingParams.join(" and ")} to view this information.`
      );
      return;
    }
    
    // Navigate to the appropriate screen with all necessary parameters
    navigation.navigate(item.screen, {
      contentKey: item.contentKey,
      nationality,
      destination
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      {/* Header Section */}
      <View className="flex-row items-center justify-between py-2.5 bg-white border-b border-[#E5E5EA]">
        <Text className="text-[17px] font-semibold text-black text-center absolute left-0 right-0">
          Information Hub
        </Text>
        <View className="flex-row justify-end p-2.5 px-[15px] gap-5">
          <TouchableOpacity>
            <Ionicons
              name="chevron-back"
              size={24}
              color="#007AFF"
              onPress={handleBack}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="home-outline"
              size={24}
              color="#007AFF"
              onPress={handleHome}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-end p-2.5 px-[15px] gap-5">
          <TouchableOpacity>
            <Ionicons
              name="share-outline"
              size={24}
              color="#007AFF"
              onPress={handleShare}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="pencil-outline"
              size={24}
              color="#007AFF"
              onPress={handleEditPlan}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="pb-[200px] px-2.5"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col items-stretch pt-5 gap-5">
          {titles.map((item) => (
            <TouchableOpacity
              key={item.number}
              className="flex-row justify-between items-center p-[5px] bg-white rounded-[20px] overflow-hidden shadow-md"
              activeOpacity={0.9}
              onPress={() => handleSubScreens(item)}
            >
              <Image
                className="rounded-[20px] bg-[#555] h-[130px] w-[100px]"
                source={item.image}
              />
              <Text className="text-[18px] font-normal text-center text-black flex-1 p-2.5">
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={24} color={"#007AFF"} />
            </TouchableOpacity>
          ))}
        </View>
        {titles.map((item) => (
          <TouchableOpacity
            key={item.number}
            style={styles.itemContainer}
            activeOpacity={0.8} // Slightly less opacity change
            onPress={() => handleSubScreens(item)}
          >
            <Image
              style={styles.itemImage}
              source={item.image} // Assumes images are loaded correctly via require
              resizeMode="cover" // Cover might look better than default stretch
            />
            {/* // Added a View for better text centering if needed */}
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={"#007AFF"}
              style={styles.itemChevron}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Next Button */}
      <TouchableOpacity
        className="bg-[#24BAEC] mx-5 p-[15px] rounded-lg absolute bottom-[30px] left-0 right-0"
        onPress={() => navigation.navigate("InformationScreen")}
      >
        <Text className="text-white text-center text-base font-semibold">
          Next
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
