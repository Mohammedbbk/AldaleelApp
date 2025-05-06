import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../../../ThemeProvider";
import { Filter, AlertCircle, Plus } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../AuthProvider";
import SearchBar from "../../components/common/SearchBar";
import TripCard from "../../components/home/TripCard";
import FloatingBottomNav from "../../components/navigation/FloatingBottomNav";
import { getTrips } from "../../services/tripService";
import { LinearGradient } from "expo-linear-gradient";

const filterOptions = [
  { id: "all", translationKey: "trips.list.filters.all" },
  { id: "upcoming", translationKey: "trips.list.filters.upcoming" },
  { id: "past", translationKey: "trips.list.filters.past" },
];

function TripListScreen({ navigation }) {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const colorScheme = useColorScheme();

  const { userToken, userId } = useContext(AuthContext);

  const fetchTripsData = useCallback(
    async (options = {}) => {
      const {
        page = 1,
        limit = 10,
        filter = selectedFilter,
        sort = sortBy,
        search = searchText,
        append = false,
      } = options;

      if (!append) {
        setIsLoading(true);
      }
      setError("");

      try {
        console.log("[TripListScreen] Fetching trips with options:", {
          ...options,
          user_id: userId,
        });
        const result = await getTrips({
          page,
          limit,
          filter,
          sort,
          search,
          user_id: userId,
        });

        if (result && Array.isArray(result.data)) {
          if (append) {
            setTrips((prevTrips) => {
              const existingIds = new Set(prevTrips.map((t) => t.id));
              const newTrips = result.data.filter(
                (t) => !existingIds.has(t.id)
              );
              return [...prevTrips, ...newTrips];
            });
          } else {
            setTrips(result.data);
          }
        } else {
          console.error(
            "[TripListScreen] Invalid data format received:",
            result
          );
          throw new Error("Invalid data format received from server");
        }
      } catch (err) {
        console.error("[TripListScreen] Error fetching trips:", err);
        setError(err.message || t("trips.list.errors.fetchFailed"));
        if (!append) {
          setTrips([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedFilter, sortBy, searchText, t, userId]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTripsData({
        page: 1,
        search: searchText,
        filter: selectedFilter,
        sort: sortBy,
      });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchText, selectedFilter, sortBy, fetchTripsData]);

  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
  };

  const handleSort = () => {
    const newSortBy = sortBy === "date" ? "destination" : "date";
    setSortBy(newSortBy);
  };

  const handleTripAction = (actionType, tripId) => {
    switch (actionType) {
      case "view":
        const tripToView = trips.find((t) => t.id === tripId);
        if (tripToView) {
          navigation.navigate("UserPlanScreen", { tripData: tripToView });
        } else {
          Alert.alert("Error", "Could not find trip data.");
        }
        break;
      case "edit":
        console.log("Edit trip:", tripId);
        Alert.alert("Edit", "Edit functionality not yet implemented.");
        break;
      case "share":
        console.log("Share trip:", tripId);
        Alert.alert("Share", "Share functionality not yet implemented.");
        break;
      case "delete":
        Alert.alert(
          t("trips.list.deleteConfirmTitle"),
          t("trips.list.deleteConfirmMessage"),
          [
            {
              text: t("trips.list.cancel"),
              style: "cancel",
            },
            {
              text: t("trips.list.delete"),
              style: "destructive",
              onPress: () => {
                console.log("Delete trip:", tripId);
                setTrips((prevTrips) =>
                  prevTrips.filter((trip) => trip.id !== tripId)
                );
              },
            },
          ]
        );
        break;
      default:
        break;
    }
  };

  const renderTripItem = ({ item, index }) => (
    <TripCard
      item={item}
      index={index}
      onViewPress={() => handleTripAction("view", item.id)}
      onEditPress={() => handleTripAction("edit", item.id)}
      onSharePress={() => handleTripAction("share", item.id)}
      onDeletePress={() => handleTripAction("delete", item.id)}
    />
  );

  const { isDarkMode, colors } = useTheme();

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />

      <View className="px-4 mb-2">
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder={t("trips.list.searchPlaceholder")}
          containerClassName="mt-4 mb-2 h-16"
        />

        <View
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"
          } rounded-3xl shadow py-2 px-4 gap-2`}
        >
          <View className="flex-row justify-between items-center">
            <Text
              className={`text-xl font-bold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
              accessibilityRole="header"
            >
              {t("trips.list.title")}
            </Text>
            <TouchableOpacity
              onPress={handleSort}
              className="flex-row items-center p-1"
            >
              <Filter size={20} color="#3B82F6" />
              <Text className="text-sm text-blue-500 font-medium ml-1.5">
                {t("trips.list.sortBy")} {t(`trips.list.sortOptions.${sortBy}`)}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-1 mb-2"
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleFilterChange(option.id)}
                className={`px-4 py-2 rounded-full mx-1 ${
                  selectedFilter === option.id
                    ? isDarkMode
                      ? "bg-blue-600"
                      : "bg-blue-500"
                    : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}
              >
                <Text
                  className={`${
                    selectedFilter === option.id
                      ? "text-white font-medium"
                      : isDarkMode
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {t(option.translationKey)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View className="flex-1 px-4">
        {isLoading && trips.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : !isLoading && trips.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <AlertCircle
              size={50}
              color={isDarkMode ? "#9CA3AF" : "#6b7280"}
              strokeWidth={1.5}
            />
            <Text
              className={`text-lg mt-4 text-center mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {error ? error : t("trips.list.noTripsFound")}
            </Text>
            {error ? (
              <TouchableOpacity
                className="mt-2 shadow-lg"
                onPress={() => fetchTripsData({ page: 1 })}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isDarkMode ? ["#3B82F6", "#2563EB"] : ["#60A5FA", "#3B82F6"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="px-8 py-3.5 rounded-full flex-row items-center"
                >
                  <Text className="text-white font-semibold text-base">
                    {t("trips.list.retry")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="mt-2 shadow-lg bg-blue-500 rounded-2xl w-24 h-12 items-center justify-center"
                onPress={() => navigation.navigate("CreateTrip")}
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base">
                  {t("trips.list.retry")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={trips}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id?.toString()}
            contentContainerStyle={{ paddingBottom: 180 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity
        className="absolute bottom-36 right-6 bg-blue-500 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("CreateTrip")}
      >
        <Plus size={26} color="#FFFFFF" />
      </TouchableOpacity>

      <FloatingBottomNav activeRouteName="Trips" />
    </SafeAreaView>
  );
}

export default TripListScreen;