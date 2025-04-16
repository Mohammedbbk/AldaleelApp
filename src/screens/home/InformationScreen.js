import React from "react";
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
  { number: 1, title: "Visa Requirements", image: visa, contentKey: 'visa', screen: 'VisaScreen' },
  { number: 2, title: "Local Customs", image: local, contentKey: 'local', screen: 'LocalScreen' },
  { number: 3, title: "Currency Information", image: currency, contentKey: 'currency', screen: 'CurrencyScreen' },
  { number: 4, title: "Health & Safety", image: health, contentKey: 'health', screen: 'HealthScreen' },
  { number: 5, title: "Transportation", image: transportation, contentKey: 'transportation', screen: 'TransportationScreen' },
  { number: 6, title: "Language Basics", image: language, contentKey: 'language', screen: 'LanguageScreen' },
];

const InformationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // Extract nationality and destination, providing defaults if undefined
  const { nationality, destination } = route.params || {};

  // --- Handlers ---
  const handleBack = () => {
    // Go back if possible, otherwise maybe navigate to a default screen like Home or UserPlanScreen
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("UserPlanScreen"); // Or 'Home' if more appropriate
    }
  };

  const handleHome = () => {
    // Navigate to the main Home screen
    navigation.navigate("Home");
  };

  const handleEditPlan = () => {
    // Navigate to Assistant screen - make sure this screen exists and handles context
    navigation.navigate("AssistantScreen");
  };

  const handleShare = async () => {
    // Basic Share functionality
    try {
      await Share.share({
        message: 'Check out this travel information from Aldaleel!',
        // You could add a URL here if applicable: url: 'https://yourapp.com/info'
        title: 'Aldaleel Travel Info'
      });
    } catch (error) {
      Alert.alert("Share Error", "Could not share information at this time.");
    }
  };

  const handleSubScreens = (item) => {
    const params = {
        contentKey: item.contentKey,
        // Only pass nationality and destination if they exist and are needed
        ...( (item.contentKey === 'visa' || item.contentKey === 'local') && nationality && destination
            ? { nationality, destination }
            : {}
        ),
        // Pass static title/image info for InfoBaseScreen to use immediately
        staticTitle: item.title,
        staticImage: item.image,
    };

    if (item.screen) {
        navigation.navigate(item.screen, params);
    } else {
        // Fallback or generic screen if specific one isn't defined
        Alert.alert("Error", "Navigation target not defined for this item.");
    }
  };


  // --- Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Section - Refactored for better layout */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Information Hub</Text>
        {/* // Placeholder View to balance the title correctly with one button */}
        {/* <View style={{ width: 40 }} /> */}
        {/* Or add other buttons here */}
        <View style={styles.headerRightButtons}>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                <Ionicons name="share-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
            {/* You might only need Edit Plan if coming from UserPlanScreen contextually */}
            {/* <TouchableOpacity onPress={handleEditPlan} style={styles.headerButton}>
                 <Ionicons name="pencil-outline" size={24} color="#007AFF" />
            </TouchableOpacity> */}
             <TouchableOpacity onPress={handleHome} style={styles.headerButton}>
                <Ionicons name="home-outline" size={24} color="#007AFF"/>
             </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
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
                <Text style={styles.itemTitle}>
                 {item.title}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={"#007AFF"} style={styles.itemChevron} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Removed the incorrect "Next" button */}

    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Use hex color
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Adjust as needed
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerButton: {
        padding: 5, // Add padding for easier tapping
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600', // Semibold is common for iOS titles
        color: 'black',
        textAlign: 'center',
        flex: 1, // Allow title to take space but center
        marginHorizontal: 10, // Add horizontal margin
    },
     headerRightButtons: {
        flexDirection: 'row',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10, // Use consistent padding
        backgroundColor: 'white',
        borderRadius: 12, // Slightly less rounding
        marginBottom: 15, // Replaced gap with marginBottom
        // iOS Shadow (optional)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        // Android Shadow (optional)
        elevation: 3,
        overflow: 'hidden', // Keep overflow hidden
    },
    itemImage: {
        height: 80, // Adjust size as needed
        width: 80, // Adjust size as needed
        borderRadius: 8, // Match container rounding
        backgroundColor: '#E5E7EB', // Placeholder color
    },
    itemTextContainer: {
        flex: 1,
        alignItems: 'center', // Center text horizontally
        paddingHorizontal: 15, // Add padding around text
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: '400', // Normal weight
        textAlign: 'center',
        color: 'black',
    },
    itemChevron: {
        // No specific style needed unless padding is desired
         marginRight: 5, // Add slight margin
    },
});


export default InformationScreen;