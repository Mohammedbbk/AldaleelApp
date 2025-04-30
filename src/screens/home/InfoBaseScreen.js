import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator, // Added ActivityIndicator import
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Assuming these helpers are correctly defined in tripService.js
import { WorkspaceVisaInfo, WorkspaceCultureInsights } from '../../services/tripService';

const InfoBaseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // Default to empty object if route.params is undefined
  const { contentKey, nationality, destination } = route.params || {};

  // Debug log parameters
  console.log("InfoBaseScreen params:", { contentKey, nationality, destination });

  // State for dynamic content fetching
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dynamicContent, setDynamicContent] = React.useState(null);

  // Attempt to load static fallback info (title/image) gracefully
  const staticInfo = (() => {
    try {
      // Make sure the path to AiResponse is correct relative to this file
      return require('../../config/AiResponse').AI_RESPONSE.Information[contentKey];
    } catch {
      // Return null or a default object if AiResponse or the key doesn't exist
      return null;
    }
  })();

  // Effect to fetch dynamic content for specific keys
  React.useEffect(() => {
    let cancelled = false; // Flag to prevent state update on unmounted component

    async function fetchContent() {
      // Check if required context is available for ALL content keys
      if (!nationality || !destination) {
        // More helpful error message that tells exactly what's missing
        const missingFields = [];
        if (!nationality) missingFields.push("nationality");
        if (!destination) missingFields.push("destination");
        
        if (!cancelled) setError(`Please provide your ${missingFields.join(" and ")} to view this information.`);
        if (!cancelled) setIsLoading(false);
        return;
      }

      // Only fetch for 'visa' or 'local' keys
      if (contentKey === 'visa' || contentKey === 'local') {
        // Reset state and start loading
        if (!cancelled) setIsLoading(true);
        if (!cancelled) setError("");
        if (!cancelled) setDynamicContent(null);

        try {
          let content;
          // Call the appropriate service function
          if (contentKey === 'visa') {
            content = await WorkspaceVisaInfo(nationality, destination);
          } else { // contentKey === 'local'
            content = await WorkspaceCultureInsights(nationality, destination);
          }
          if (!cancelled) setDynamicContent(content); // Update state with fetched content
        } catch (e) {
          if (!cancelled) setError(e.message || `Failed to fetch ${contentKey} information.`);
        } finally {
          if (!cancelled) setIsLoading(false); // Stop loading regardless of outcome
        }
      } else {
        // For other contentKeys, show a generic message but don't show an error
        if (!cancelled) setDynamicContent(null);
        if (!cancelled) setError("");
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchContent();

    // Cleanup function to set cancelled flag when component unmounts
    return () => {
      cancelled = true;
    };
  }, [contentKey, nationality, destination]); // Dependencies for the effect

  // Handler to close the screen
  const handleClose = () => {
    // Consider navigation.goBack() if it's always modal-like,
    // or navigate specifically if needed.
    navigation.navigate("InformationScreen");
  };

  // --- RENDER LOGIC ---

  // Determine Title: Use static title if available, otherwise generate default
  const screenTitle = staticInfo?.title || (contentKey === 'visa' ? 'Visa Requirements' : contentKey === 'local' ? 'Local Customs' : 'Information');

  // Determine Image: Use static image if available
  const screenImage = staticInfo?.image;

  return (
    // Use SafeAreaView for notches/status bars
    <SafeAreaView className="flex-1 bg-white">
      {/* // Use device status bar setting
      <StatusBar barStyle="dark-content" /> */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}> {/* Add padding for Close button */}
        {/* Title */}
        <Text className="text-xl font-bold text-center mt-5 mb-5 px-4">
          {screenTitle}
        </Text>

        {/* Image (Optional) */}
        {screenImage && (
          <Image
            source={screenImage} // Use require() for local images
            className="w-full h-[200px] my-[20px]" // Adjusted margin
            resizeMode="contain"
          />
        )}

        {/* Content Area */}
        <View className="p-5">
          {/* Logic for Visa/Local (Dynamic) */}
          {(contentKey === 'visa' || contentKey === 'local') && !error && (
            <>
              {isLoading ? (
                <View className="items-center justify-center py-10">
                  <ActivityIndicator size="large" color="#0EA5E9" />
                  <Text className="text-base text-sky-600 mt-3">Loading...</Text>
                </View>
              ) : dynamicContent ? (
                // Display fetched dynamic content
                <Text className="text-base leading-relaxed text-gray-700">
                  {dynamicContent}
                </Text>
              ) : (
                 // Should ideally not be reached if loading/error/content covers all cases
                <Text className="text-base text-gray-500">No information available.</Text>
              )}
            </>
          )}

          {/* Display common error message */}
          {error && (
            <View className="items-center justify-center py-10 px-4 bg-red-50 rounded-lg border border-red-200">
              <Text className="text-base text-red-600 text-center">{error}</Text>
            </View>
          )}

          {/* Logic for Other Keys (Static Fallback) */}
          {contentKey !== 'visa' && contentKey !== 'local' && !error && (
            <Text className="text-base text-gray-500 italic">
              Detailed information about {
                contentKey === 'currency' ? 'currency' : 
                contentKey === 'health' ? 'health and safety' :
                contentKey === 'transportation' ? 'transportation' :
                contentKey === 'language' ? 'language basics' :
                'this topic'
              } for {destination} will be available soon.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Close Button (Positioned) */}
      <TouchableOpacity
        className="bg-[#24BAEC] mx-5 p-[15px] rounded-lg absolute bottom-[30px] left-0 right-0 shadow-md" // Added shadow
        activeOpacity={0.8} // Slightly less opacity change
        onPress={handleClose}
      >
        <Text className="text-white text-center text-base font-semibold">
          Close
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InfoBaseScreen;