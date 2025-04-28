import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  BookmarkIcon,
  HomeIcon,
  ListChecksIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
  SearchIcon,
  MessageSquareIcon,
  BellIcon,
  CalendarIcon,
  TrendingUpIcon,
  PalmtreeIcon,
  MountainIcon,
  BuildingIcon,
  LandmarkIcon,
  AlertCircle,
} from "lucide-react-native";

import FloatingBottomNav from "../../components/navigation/FloatingBottomNav"; // Kept from stash
const { width } = Dimensions.get("window");
const cardWidth = width * 0.75;

// Move these to inside the component as they'll be loaded via state
const tripData = [
  {
    id: 1,
    title: "Dubai Adventure",
    location: "Dubai, UAE",
    rating: 4.9,
    image: require("../../../assets/dubai.jpeg"),
    hasCreateButton: true,
    duration: "5 days",
    price: "$1,200",
    description: "Experience the perfect blend of luxury and adventure",
  },
  {
    id: 2,
    title: "Paris Getaway",
    location: "Paris, France",
    rating: 4.7,
    image: require("../../../assets/eiffel.jpg"),
    hasCreateButton: false,
    duration: "7 days",
    price: "$2,100",
    description: "Discover the city of lights and romance",
  },
  {
    id: 3,
    title: "Bali Retreat",
    location: "Bali, Indonesia",
    rating: 4.8,
    image: require("../../../assets/bali.jpg"),
    hasCreateButton: true,
    duration: "6 days",
    price: "$1,500",
    description: "Relax and rejuvenate in tropical paradise",
  },
];

// Combined data definitions from both versions
const destinationData = [
  {
    id: 1,
    name: "Maldives",
    image: require("../../../assets/maldives.jpg"),
    count: "1,200+ trips",
  },
  {
    id: 2,
    name: "Tokyo",
    image: require("../../../assets/tokyo.jpg"),
    count: "950+ trips",
  },
  {
    id: 3,
    name: "New York",
    image: require("../../../assets/newyork.jpg"),
    count: "1,500+ trips",
  },
];

const searchData = [
  { id: 1, query: "Beach resorts in Bali", date: "March 15 - March 22" },
  { id: 2, query: "Hotels in Dubai", date: "April 2 - April 7" },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  // State variables
  const [userName, setUserName] = useState(null);
  const [recommendedTrips, setRecommendedTrips] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Simulate API calls to fetch data
        setUserName("Nawaf");
        setRecommendedTrips(tripData);
        setPopularDestinations(destinationData);
        setRecentSearches(searchData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading home data:", err);
        setError("Failed to load home data. Please try again.");
        setIsLoading(false);
      }
    }, 1500); // 1.5 second delay to simulate network request

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <ActivityIndicator size="large" color="#24baec" />
        <Text className="mt-4 text-gray-600">
          Loading your travel inspiration...
        </Text>
        <FloatingBottomNav activeRouteName="Home" />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <AlertCircle size={40} color="#ef4444" />
        <Text className="mt-4 text-red-500 font-medium">{error}</Text>
        <TouchableOpacity
          className="mt-4 bg-[#24baec] px-4 py-2 rounded-lg"
          onPress={() => {
            setIsLoading(true);
            setError(null);
            // Retry loading data
            setTimeout(() => {
              try {
                setUserName("Nawaf");
                setRecommendedTrips(tripData);
                setPopularDestinations(destinationData);
                setRecentSearches(searchData);
                setIsLoading(false);
              } catch (err) {
                setError("Failed to load home data. Please try again.");
                setIsLoading(false);
              }
            }, 1500);
          }}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
        <FloatingBottomNav activeRouteName="Home" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header Section */}
      <View className="px-6 pt-4 pb-2 mt-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => navigation.navigate("ProfileSetting")}
          >
            <View className="w-12 h-12 bg-[#f0f8ff] rounded-full items-center justify-center border-2 border-[#e0f0ff]">
              <UserIcon size={20} color="#24baec" />
            </View>
            <View className="ml-3">
              <Text className="text-sm text-gray-500 font-medium">
                Welcome back
              </Text>
              <Text className="text-lg font-bold text-[#1b1e28]">
                {userName}
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row">
            <TouchableOpacity
              className="w-12 h-12 bg-[#f7f7f9] rounded-full items-center justify-center mr-3"
              onPress={() => navigation.navigate("Bookmarks")}
            >
              <BookmarkIcon size={20} color="#1b1e28" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-12 h-12 bg-[#f7f7f9] rounded-full items-center justify-center relative"
              onPress={() => navigation.navigate("Notifications")}
            >
              <BellIcon size={20} color="#1b1e28" />
              <View className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section with Search */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={["#e0f4ff", "#f7f7f9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 32,
              paddingHorizontal: 24,
              borderRadius: 24,
            }}
          >
            <Text className="text-3xl leading-tight mb-4">
              <Text className="font-light text-[#2d323d]">Explore the </Text>
              <Text className="font-bold text-[#1b1e28]">Beautiful </Text>
              <Text className="font-bold text-[#24baec]">world!</Text>
            </Text>

            <TouchableOpacity
              className="flex-row items-center bg-white p-4 rounded-2xl shadow-sm"
              onPress={() => navigation.navigate("Search")}
            >
              <SearchIcon size={20} color="#7c838d" />
              <Text className="ml-3 text-[#7c838d] flex-1">
                Where do you want to go?
              </Text>
              <View className="bg-[#f7f7f9] p-2 rounded-xl">
                <MapPinIcon size={16} color="#24baec" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Travel Categories */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-[#1b1e28] mb-4">
            Explore by Category
          </Text>

          <View className="flex-row justify-between">
            <TouchableOpacity className="items-center">
              <View className="w-16 h-16 bg-[#e0f4ff] rounded-2xl items-center justify-center mb-2">
                <PalmtreeIcon size={24} color="#24baec" />
              </View>
              <Text className="text-sm text-[#1b1e28]">Beach</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-16 h-16 bg-[#fff4e0] rounded-2xl items-center justify-center mb-2">
                <MountainIcon size={24} color="#ff9500" />
              </View>
              <Text className="text-sm text-[#1b1e28]">Mountain</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-16 h-16 bg-[#f0ffe0] rounded-2xl items-center justify-center mb-2">
                <BuildingIcon size={24} color="#4caf50" />
              </View>
              <Text className="text-sm text-[#1b1e28]">City</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center">
              <View className="w-16 h-16 bg-[#ffe0f4] rounded-2xl items-center justify-center mb-2">
                <LandmarkIcon size={24} color="#e91e63" />
              </View>
              <Text className="text-sm text-[#1b1e28]">Cultural</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Trips Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-6 mb-4">
            <Text className="text-xl font-bold text-[#1b1e28]">
              Recommended For You
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => navigation.navigate("AllTrips")}
            >
              <Text className="text-[#ff7029] mr-1 font-semibold">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {recommendedTrips.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500">
                No recommendations available
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 12 }}
              decelerationRate="fast"
              snapToInterval={cardWidth + 12}
              snapToAlignment="start"
            >
              {recommendedTrips.map((trip) => (
                <TouchableOpacity
                  key={trip.id}
                  className="bg-white rounded-3xl shadow-lg mb-4 overflow-hidden mr-4"
                  style={{ width: cardWidth }}
                  onPress={() =>
                    navigation.navigate("TripDetails", { tripId: trip.id })
                  }
                >
                  <View className="relative">
                    <Image
                      source={trip.image}
                      className="w-full h-56 rounded-t-3xl"
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.35)"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 80,
                      }}
                    />
                    <View className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-full">
                      <StarIcon size={14} color="#ffd336" fill="#ffd336" />
                    </View>
                    <View className="absolute top-4 left-4 bg-white/90 px-3 py-2 rounded-full">
                      <Text className="font-bold text-[#1b1e28]">
                        {trip.price}
                      </Text>
                    </View>
                    <View className="absolute bottom-4 left-4">
                      <Text className="text-white font-bold text-xl">
                        {trip.title}
                      </Text>
                      <View className="flex-row items-center">
                        <MapPinIcon size={14} color="#ffffff" />
                        <Text className="ml-1 text-white">{trip.location}</Text>
                      </View>
                    </View>
                  </View>

                  <View className="p-4">
                    <Text className="text-[#7d848d] mb-3">
                      {trip.description}
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center">
                        <CalendarIcon size={16} color="#24baec" />
                        <Text className="ml-2 text-[#1b1e28] font-semibold">
                          {trip.duration}
                        </Text>
                      </View>

                      {trip.hasCreateButton ? (
                        <TouchableOpacity
                          className="bg-[#24baec] px-4 py-2 rounded-full"
                          onPress={() =>
                            navigation.navigate("CreateTrip", {
                              baseTrip: trip,
                            })
                          }
                        >
                          <Text className="text-white font-semibold">
                            Create Trip
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity className="border border-[#24baec] px-4 py-2 rounded-full">
                          <Text className="text-[#24baec] font-semibold">
                            Details
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Popular Destinations */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-[#1b1e28]">
              Popular Destinations
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => navigation.navigate("PopularDestinations")}
            >
              <Text className="text-[#ff7029] mr-1 font-semibold">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          {popularDestinations.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500">
                No popular destinations available
              </Text>
            </View>
          ) : (
            <View className="flex-row justify-between">
              {popularDestinations.map((destination) => (
                <TouchableOpacity
                  key={destination.id}
                  className="w-[31%] relative overflow-hidden rounded-2xl"
                  onPress={() =>
                    navigation.navigate("Destination", { destination })
                  }
                >
                  <Image
                    source={destination.image}
                    className="w-full h-32 rounded-2xl"
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.7)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 60,
                    }}
                  />
                  <View className="absolute bottom-2 left-2">
                    <Text className="text-white font-bold">
                      {destination.name}
                    </Text>
                    <Text className="text-white text-xs">
                      {destination.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Recent Searches Section */}
        <View className="px-6 mb-24">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-[#1b1e28]">
              Recent Searches
            </Text>
            <TouchableOpacity onPress={() => setRecentSearches([])}>
              <Text className="text-[#ff7029] mr-1 font-semibold">
                Clear all
              </Text>
            </TouchableOpacity>
          </View>

          {recentSearches.length === 0 ? (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500">No recent searches</Text>
            </View>
          ) : (
            <View className="space-y-3">
              {recentSearches.map((search) => (
                <TouchableOpacity
                  key={search.id}
                  className="flex-row bg-[#f7f7f9] p-4 rounded-2xl"
                >
                  <View className="bg-white p-3 rounded-xl mr-3">
                    <SearchIcon size={20} color="#24baec" />
                  </View>
                  <View>
                    <Text className="font-semibold text-[#1b1e28]">
                      {search.query}
                    </Text>
                    <Text className="text-[#7c838d] text-sm">
                      {search.date}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <FloatingBottomNav activeRouteName="Home" />
    </SafeAreaView>
  );
}
