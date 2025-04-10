// src/screens/user-plan/user-plan-screen.jsx

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AI_RESPONSE } from '../../config/AiResponse';

// Import new components
import { VisaRequirements } from '../../components/trips/VisaRequirements';
import { NearbyEvents } from '../../components/trips/NearbyEvents';
import { TravelRecommendations } from '../../components/trips/TravelRecommendations';

// --- Static Content / Maps ---

const detailEmojis = {
  Destination: '✈️',
  Duration: '⏳',
  Expenses: '💵',
};

// --- Helper Functions ---

function usePlanData(route) {
  return useMemo(() => {
    if (route.params?.tripData) {
      const tripData = route.params.tripData;
      const planData = {
        details: [
          { name: 'Destination', value: tripData.destinationCity },
          { name: 'Duration', value: `${tripData.month} ${tripData.year}` },
          { name: 'Expenses', value: tripData.budgetLevel || 'Moderate' },
        ],
        days: [],
        visaRequirements: tripData.visaRequirements,
        nearbyEvents: tripData.nearbyEvents,
        recommendations: {
          places: tripData.recommendations?.places || [],
          tips: tripData.recommendations?.tips || [],
          culturalNotes: tripData.recommendations?.culturalNotes || [],
          safetyTips: tripData.recommendations?.safetyTips || []
        }
      };

      if (tripData.aiGenerationFailed) {
        planData.days = [
          {
            day: 1,
            activities: [
              {
                time: 'All day',
                name: 'Custom itinerary will be generated',
              },
            ],
            plan: [
              {
                time: 'Note',
                event:
                  'Your custom itinerary will be generated soon. Check back later!',
              },
            ],
          },
        ];
      } else {
        const aiPlan = AI_RESPONSE.UserPlan;
        return {
          ...aiPlan,
          visaRequirements: tripData.visaRequirements,
          nearbyEvents: tripData.nearbyEvents,
          recommendations: {
            places: tripData.recommendations?.places || [],
            tips: tripData.recommendations?.tips || [],
            culturalNotes: tripData.recommendations?.culturalNotes || [],
            safetyTips: tripData.recommendations?.safetyTips || []
          }
        };
      }
      return planData;
    }
    return AI_RESPONSE.UserPlan;
  }, [route.params]);
}

function generatePdfContent(plan) {
    const destination = plan.details.find((d) => d.name === 'Destination')?.value || 'N/A';
    const duration = plan.details.find((d) => d.name === 'Duration')?.value || 'N/A';
    const expenses = plan.details.find((d) => d.name === 'Expenses')?.value || 'N/A';

    // (Keep the same HTML/CSS structure)
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${destination} Travel Plan</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #f5f5f5, #e8e8e8); }
          /* ... rest of the styles ... */
           .container { margin: 40px auto; max-width: 800px; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #00adef; }
          .header h1 { margin: 0; font-size: 32px; color: #007aff; }
          .header p { margin: 5px 0 0; font-size: 18px; color: #555; }
          .details { display: flex; justify-content: space-around; margin-bottom: 30px; border-bottom: 1px solid #e5e5ea; padding-bottom: 20px; }
          .detail { text-align: center; }
          .detail h3 { margin: 0; font-size: 16px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail p { margin: 5px 0 0; font-size: 20px; font-weight: 500; color: #333; }
          .day-section { margin-bottom: 40px; }
          .day-section h2 { font-size: 24px; color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px dashed #00adef; }
          .plan-item { margin-bottom: 15px; padding: 15px; background: #f9f9f9; border-left: 5px solid #00adef; border-radius: 8px; transition: background 0.3s ease; }
          .plan-item:hover { background: #f1faff; }
          .plan-item span.time { font-weight: 700; color: #007aff; margin-right: 15px; display: inline-block; width: 90px; }
          .plan-item span.event { color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${destination} Travel Plan</h1>
            <p>Embark on a journey to ${destination}</p>
          </div>
          <div class="details">
            <div class="detail"><h3>Destination</h3><p>${destination}</p></div>
            <div class="detail"><h3>Duration</h3><p>${duration}</p></div>
            <div class="detail"><h3>Expenses</h3><p>${expenses}</p></div>
          </div>
          ${plan.days.map((day) => `
            <div class="day-section">
              <h2>Day ${day.day}: ${day.activities[0]?.name || 'Activities'}</h2>
              ${day.plan.map((item) => `
                <div class="plan-item">
                  <span class="time">${item.time}</span>
                  <span class="event">${item.event}</span>
                </div>`).join('')}
            </div>`).join('')}
        </div>
      </body>
    </html>`;
    return htmlContent;
}

// --- Subcomponents ---

// No longer needs to be wrapped with `styled`
function DetailItem({ label, value }) {
  return (
      <View className="flex-row p-2.5">
          {label && <Text className="text-sm text-neutral-500 mb-1">{label}</Text>}
          {value && <Text className="text-base font-medium text-neutral-700">{value}</Text>}
      </View>
  );
}

// No longer needs to be wrapped with `styled`
function ActivityItem({ time, name }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [hasFetchError, setHasFetchError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function fetchImage() {
      // ... (fetch logic remains the same) ...
      setIsLoadingImage(true);
      setHasFetchError(false);
      setImageUrl(null);

      if (!name) {
          setIsLoadingImage(false);
          return;
      }

      try {
        const encodedName = encodeURIComponent(name);
        const apiKey = "48791338-871e8e68f968c04f8f6fb8343"; // Replace with process.env.EXPO_PUBLIC_PIXABAY_KEY later
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodedName}&image_type=photo`;

        const response = await fetch(url, { signal });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();

        if (!signal.aborted) {
            if (json.hits && json.hits.length > 0) {
              setImageUrl(json.hits[0].largeImageURL);
            } else {
              console.log('No images found for:', name);
              setHasFetchError(true);
            }
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !signal.aborted) {
             console.error('Error fetching image for:', name, error);
             setHasFetchError(true);
        }
      } finally {
         if (!signal.aborted) {
            setIsLoadingImage(false);
         }
      }
    }

    fetchImage();

    return () => {
      abortController.abort();
    };
  }, [name]);

  return (
    <View className="relative"> {/* Use standard View */}
      <View className="bg-neutral-600 w-full h-48 items-center justify-center">
        {isLoadingImage && <ActivityIndicator color="white" size="large"/>}
        {!isLoadingImage && imageUrl && (
          <Image // Use standard Image
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
            source={{ uri: imageUrl }}
            resizeMode="cover"
            accessibilityLabel={`Image for ${name}`}
          />
        )}
        {!isLoadingImage && (hasFetchError || !imageUrl) && (
            <Ionicons name="image-outline" size={60} color="rgba(255,255,255,0.5)" />
        )}
      </View>
      <View className="p-5 absolute bottom-0 left-0 right-0 bg-black/40">
        <Text className="text-sm text-white font-normal mb-1">{time}</Text>
        <Text className="text-lg font-medium text-white">{name}</Text>
      </View>
    </View>
  );
}

// No longer needs to be wrapped with `styled`
function Accordion({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const isMeasured = useRef(false);

  const handleLayout = useCallback((event) => {
    if (!isMeasured.current && event.nativeEvent.layout.height > 0) {
        setContentHeight(event.nativeEvent.layout.height);
        isMeasured.current = true;
    }
  }, []);


  const toggleAccordion = useCallback(() => {
    if (!isMeasured.current || contentHeight <= 0) return;

    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 0 : contentHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
        setIsExpanded(!isExpanded);
    });
  }, [isExpanded, contentHeight, animatedHeight]);

  const measurementStyle = {
     opacity: 0, position: 'absolute', zIndex: -1, width: '100%'
  };

  return (
    <View> {/* Use standard View */}
      {/* Measurement View */}
      {!isMeasured.current && (
          <View style={measurementStyle} onLayout={handleLayout} pointerEvents="none">
              <View className="bg-white border-t border-neutral-300">
                 {children}
              </View>
          </View>
      )}

      {/* Clickable Header */}
      <TouchableOpacity onPress={toggleAccordion} activeOpacity={0.8}> {/* Use standard TouchableOpacity */}
        {title}
      </TouchableOpacity>

      {/* Animated Content */}
      <Animated.View // Use standard Animated.View
        style={{ height: animatedHeight, overflow: 'hidden' }}
        className="bg-white border-t border-neutral-300"
      >
        {children}
      </Animated.View>
    </View>
  );
}

// --- Main Component ---

export function UserPlanScreen() {
  // Hooks
  const navigation = useNavigation();
  const route = useRoute();
  const plan = usePlanData(route);

  // Handlers (remain the same)
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('MainScreen');
  }, [navigation]);

  const handleHome = useCallback(() => navigation.navigate('MainScreen'), [navigation]);
  const handleEditPlan = useCallback(() => navigation.navigate('AssistantScreen'), [navigation]);
  const handleNext = useCallback(() => navigation.navigate('InformationScreen'), [navigation]);

  const handleShare = useCallback(async () => {
    // ... (sharing logic remains the same) ...
     if (!plan) return;

    const htmlContent = generatePdfContent(plan);
    try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });

        const destinationName = plan.details.find(d => d.name === 'Destination')?.value || 'TravelPlan';
        const safeFilename = destinationName.replace(/[^a-zA-Z0-9]/g, '');
        const newPath = `${FileSystem.documentDirectory}AlDaleel_${safeFilename}.pdf`;

        await FileSystem.moveAsync({ from: uri, to: newPath });
        await Sharing.shareAsync(newPath, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share your Travel Plan',
        });
    } catch (error) {
        console.error("Error sharing PDF:", error);
    }
  }, [plan]);

  // Render using standard components with `className`
  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="bg-white flex-row items-center justify-between py-2 px-4 border-b border-neutral-200">
         <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="chevron-back" size={24} className="text-blue-600" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHome} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="home-outline" size={24} className="text-blue-600" />
            </TouchableOpacity>
        </View>

        <View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center pointer-events-none">
          <Text className="text-lg font-semibold text-black">
            Your Plan
          </Text>
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={handleShare} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="share-outline" size={24} className="text-blue-600" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEditPlan} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="pencil-outline" size={24} className="text-blue-600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Details */}
        <View className="flex-row justify-center bg-white p-3 my-3 rounded-lg shadow-md">
          <View className="flex-col justify-between items-start">
            {plan?.details?.map((detail, index) => (
              <DetailItem key={`${index}-label`} label={detail.name} value={null} />
            ))}
          </View>
          <View className="flex-col justify-between items-center px-3">
             {plan?.details?.map((detail, index) => (
               <View key={`${index}-emoji`} className="p-2.5 items-center justify-center h-[44px]">
                  <Text className="text-base">{detailEmojis[detail.name] || ''}</Text>
               </View>
             ))}
          </View>
          <View className="flex-col justify-between items-start">
            {plan?.details?.map((detail, index) => (
              <DetailItem key={`${index}-value`} label={null} value={detail.value} />
            ))}
          </View>
        </View>

        {/* Visa Requirements */}
        <VisaRequirements
          visaData={plan?.visaRequirements}
          isLoading={false}
          error={null}
        />

        {/* Travel Recommendations */}
        <TravelRecommendations
          recommendations={plan?.recommendations}
          isLoading={false}
          error={null}
        />

        {/* Nearby Events */}
        <NearbyEvents
          eventsData={plan?.nearbyEvents}
          isLoading={false}
          error={null}
        />

        {/* Itinerary Days */}
        {plan?.days?.map((day, index) => (
          <View key={index} className="mb-5">
            <Text className="text-sm font-normal text-neutral-700 mb-1.5 ml-1">
              Day {day.day}
            </Text>
            <View className="bg-cyan-500 rounded-lg overflow-hidden shadow-md">
              {day.activities.map((activity, idx) => (
                <Accordion
                  key={idx}
                  title={
                    <ActivityItem time={activity.time} name={activity.name} />
                  }
                >
                  {/* Accordion Content */}
                  {day.plan.map((item, i) => (
                    <View
                      key={i}
                      className="flex-row gap-2 justify-between p-3 border-b border-neutral-200 last:border-b-0"
                    >
                      <Text className="text-neutral-500 w-16 pr-2 border-r border-neutral-300">
                        {item.time}
                      </Text>
                      <Text className="flex-1 text-neutral-800">
                        {item.event}
                      </Text>
                    </View>
                  ))}
                 </Accordion>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Next Button */}
      <View className="absolute bottom-0 left-0 right-0 p-5 pb-8 bg-transparent">
          <TouchableOpacity
            className="bg-sky-500 py-4 px-5 rounded-lg shadow"
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center text-base font-semibold">
              Next
            </Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Add default export
export default UserPlanScreen;