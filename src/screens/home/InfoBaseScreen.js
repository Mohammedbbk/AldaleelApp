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
import {
  WorkspaceVisaInfo,
  WorkspaceCultureInsights,
  WorkspaceCurrencyInfo,
  WorkspaceHealthInfo,
  WorkspaceTransportationInfo,
  WorkspaceLanguageInfo,
} from "../../services/tripService";

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

  // Add cache state at the top level
  const [cachedResponses, setCachedResponses] = React.useState({});

  // Attempt to load static fallback info (title/image) gracefully
  const staticInfo = (() => {
    try {
      // Make sure the path to AiResponse is correct relative to this file
      return require("../../config/AiResponse").AI_RESPONSE.Information[
        contentKey
      ];
    } catch {
      // Return null or a default object if AiResponse or the key doesn't exist
      return null;
    }
  })();

  // Effect to fetch dynamic content for specific keys
  React.useEffect(() => {
    let cancelled = false;

    async function fetchContent() {
      if (!nationality || !destination) {
        const missingFields = [];
        if (!nationality) missingFields.push("nationality");
        if (!destination) missingFields.push("destination");
        
        if (!cancelled) setError(`Please provide your ${missingFields.join(" and ")} to view this information.`);
        if (!cancelled) setIsLoading(false);
        return;
      }

      // Check cache first
      const cacheKey = `${contentKey}-${nationality}-${destination}`;
      if (cachedResponses[cacheKey]) {
        if (!cancelled) {
          setDynamicContent(cachedResponses[cacheKey]);
          setIsLoading(false);
          setError("");
        }
        return;
      }

      if (!cancelled) setIsLoading(true);
      if (!cancelled) setError("");
      if (!cancelled) setDynamicContent(null);

      try {
        let content;
        // Call the appropriate service function
        switch (contentKey) {
          case "visa":
            content = await WorkspaceVisaInfo(nationality, destination);
            break;
          case "local":
            content = await WorkspaceCultureInsights(nationality, destination);
            break;
          case "currency":
            content = await WorkspaceCurrencyInfo(nationality, destination);
            break;
          case "health":
            content = await WorkspaceHealthInfo(nationality, destination);
            break;
          case "transportation":
            content = await WorkspaceTransportationInfo(nationality, destination);
            break;
          case "language":
            content = await WorkspaceLanguageInfo(nationality, destination);
            break;
          default:
            throw new Error(`Unsupported content type: ${contentKey}`);
        }

        // Cache the response
        if (!cancelled) {
          setCachedResponses(prev => ({
            ...prev,
            [cacheKey]: content
          }));
          setDynamicContent(content);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || `Failed to fetch ${contentKey} information.`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchContent();

    return () => {
      cancelled = true;
    };
  }, [contentKey, nationality, destination]);

  // Handler to close the screen
  const handleClose = () => {
    // Consider navigation.goBack() if it's always modal-like,
    // or navigate specifically if needed.
    navigation.goBack();
  };

  // --- RENDER LOGIC ---

  // Determine Title: Use static title if available, otherwise generate default
  const screenTitle =
    staticInfo?.title ||
    (contentKey === "visa"
      ? "Visa Requirements"
      : contentKey === "local"
      ? "Local Customs"
      : "Information");

  // Determine Image: Use static image if available
  const screenImage = staticInfo?.image;

  // Update the content rendering section
  const renderContent = () => {
    if (!dynamicContent) return null;

    // If it's a string, render directly
    if (typeof dynamicContent === 'string') {
      return (
        <Text className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
          {dynamicContent}
        </Text>
      );
    }

    // Handle structured content based on contentKey
    switch (contentKey) {
      case 'currency':
        return (
          <View>
            {dynamicContent.currency && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Currency
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.currency}
                </Text>
              </View>
            )}
            {dynamicContent.exchangeRate && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Exchange Rate
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.exchangeRate}
                </Text>
              </View>
            )}
            {dynamicContent.paymentMethods && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Payment Methods
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.paymentMethods}
                </Text>
              </View>
            )}
            {dynamicContent.tipping && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Tipping Culture
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.tipping}
                </Text>
              </View>
            )}
          </View>
        );

      case 'health':
        return (
          <View>
            {dynamicContent.vaccinations && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Vaccinations
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.vaccinations}
                </Text>
              </View>
            )}
            {dynamicContent.precautions && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Health Precautions
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.precautions}
                </Text>
              </View>
            )}
            {dynamicContent.safetyTips && Array.isArray(dynamicContent.safetyTips) && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Safety Tips
                </Text>
                {dynamicContent.safetyTips.map((tip, index) => (
                  <Text key={index} className="text-base text-gray-700 dark:text-gray-300 mb-2">
                    • {tip}
                  </Text>
                ))}
              </View>
            )}
            {dynamicContent.emergencyContacts && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Emergency Contacts
                </Text>
                {Object.entries(dynamicContent.emergencyContacts).map(([key, value]) => (
                  <Text key={key} className="text-base text-gray-700 dark:text-gray-300 mb-1">
                    <Text className="font-medium">{key}:</Text> {value}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );

      case 'transportation':
        return (
          <View>
            {dynamicContent.gettingAround && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Getting Around
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.gettingAround}
                </Text>
              </View>
            )}
            {dynamicContent.options && Array.isArray(dynamicContent.options) && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Transportation Options
                </Text>
                {dynamicContent.options.map((option, index) => (
                  <Text key={index} className="text-base text-gray-700 dark:text-gray-300 mb-2">
                    • {option}
                  </Text>
                ))}
              </View>
            )}
            {dynamicContent.publicTransport && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Public Transport
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.publicTransport}
                </Text>
              </View>
            )}
            {dynamicContent.taxis && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Taxis and Ride-sharing
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.taxis}
                </Text>
              </View>
            )}
          </View>
        );

      case 'language':
        return (
          <View>
            {dynamicContent.officialLanguage && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Official Language
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.officialLanguage}
                </Text>
              </View>
            )}
            {dynamicContent.phrases && Array.isArray(dynamicContent.phrases) && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Common Phrases
                </Text>
                {dynamicContent.phrases.map((phrase, index) => (
                  <Text key={index} className="text-base text-gray-700 dark:text-gray-300 mb-2">
                    • {phrase}
                  </Text>
                ))}
              </View>
            )}
            {dynamicContent.communicationTips && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Communication Tips
                </Text>
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {dynamicContent.communicationTips}
                </Text>
              </View>
            )}
          </View>
        );

      // For visa and local customs, use the existing structured content rendering
      default:
        return (
          <View>
            {dynamicContent.content && (
              <Text className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                {dynamicContent.content}
              </Text>
            )}
            {dynamicContent.requirements && (
              <View className="mt-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Requirements:
                </Text>
                <Text className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {dynamicContent.requirements}
                </Text>
              </View>
            )}
            {dynamicContent.notes && (
              <View className="mt-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Additional Notes:
                </Text>
                <Text className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {dynamicContent.notes}
                </Text>
              </View>
            )}
            {dynamicContent.tips && Array.isArray(dynamicContent.tips) && (
              <View className="mt-4">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Tips:
                </Text>
                {dynamicContent.tips.map((tip, index) => (
                  <Text key={index} className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-2">
                    • {tip}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );
    }
  };

  return (
    // Use SafeAreaView for notches/status bars
    <SafeAreaView className="flex-1 bg-white pt-10">
      {/* // Use device status bar setting
      <StatusBar barStyle="dark-content" /> */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Add padding for Close button */}
        {/* Title */}
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {screenTitle}
          </Text>
        </View>
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
          {/* Logic for Dynamic Content */}
          {!error && (
            <>
              {isLoading ? (
                <View className="items-center justify-center py-10">
                  <ActivityIndicator size="large" color="#0EA5E9" />
                  <Text className="text-base text-sky-600 mt-3">Loading...</Text>
                </View>
              ) : dynamicContent ? (
                renderContent()
              ) : (
                <Text className="text-base text-gray-500 dark:text-gray-400">
                  No information available.
                </Text>
              )}
            </>
          )}

          {/* Display common error message */}
          {error && (
            <View className="items-center justify-center py-10 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <Text className="text-base text-red-600 dark:text-red-400 text-center">{error}</Text>
            </View>
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
