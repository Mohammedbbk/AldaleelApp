// src/screens/trips/TripListScreen.js
import React, { useState, useCallback, useEffect } from "react";
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
import { Filter, AlertCircle } from "lucide-react-native";
import { useColorScheme } from "react-native";
import SearchBar from "../../components/common/SearchBar";
import TripCard from "../../components/home/TripCard";
import FloatingBottomNav from "../../components/navigation/FloatingBottomNav";
import i18n from "../../config/appConfig";
// ---> IMPORT getTrips FROM tripService <---
import { getTrips } from "../../services/tripService";
// Keep constants import if needed elsewhere, but API/ENDPOINTS not used directly now
import { API, ENDPOINTS } from "../../config/constants";

// Define filter options
const filterOptions = [
  { id: "all", i18nKey: "all" },
  { id: "upcoming", i18nKey: "upcoming" },
  { id: "past", i18nKey: "past" },
  // Add more filters as needed (e.g., shared, favorite)
];

function TripListScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // 'date' or 'destination'
  // Add state for pagination if you implement infinite scroll/load more
  // const [currentPage, setCurrentPage] = useState(1);
  // const [paginationInfo, setPaginationInfo] = useState(null);

  const colorScheme = useColorScheme();

  // --- Updated fetchTrips using getTrips service ---
  const fetchTripsData = useCallback(
    async (options = {}) => {
      const {
        page = 1, // Default to page 1
        limit = 10, // Default limit
        filter = selectedFilter,
        sort = sortBy,
        search = searchText,
        append = false, // Flag to append results for load more
      } = options;

      setIsLoading(true);
      setError("");
      try {
        const result = await getTrips({ page, limit, filter, sort, search });

        if (result && result.data) {
          if (append) {
            // Logic for appending data (Load More) - ensure no duplicates
            setTrips((prevTrips) => {
              const existingIds = new Set(prevTrips.map((t) => t.id));
              const newTrips = result.data.filter(
                (t) => !existingIds.has(t.id)
              );
              return [...prevTrips, ...newTrips];
            });
          } else {
            setTrips(result.data); // Replace data for initial load/filter/sort/search
          }
          // setPaginationInfo(result.pagination); // Store pagination info
          // setCurrentPage(page);
        } else {
          // Handle case where API returns success but no data
          if (!append) setTrips([]);
          // setPaginationInfo(null);
        }
      } catch (err) {
        console.error("Error fetching trips in screen:", err);
        setError(err.message || i18n.t("trips.list.errors.fetchFailed"));
        if (!append) setTrips([]); // Clear trips on error if not appending
      } finally {
        setIsLoading(false);
      }
    },
    [selectedFilter, sortBy, searchText]
  ); // Dependencies for useCallback

  // Initial fetch on mount
  useEffect(() => {
    fetchTripsData({ page: 1 }); // Fetch initial data
  }, []); // Run only once on mount

  // --- Handlers for Search, Filter, Sort ---

  // Debounced effect for search triggering
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // Trigger fetch only when searchText changes (or filter/sort change via handlers)
      // Pass current filter/sort state along with search text
      fetchTripsData({
        page: 1,
        search: searchText,
        filter: selectedFilter,
        sort: sortBy,
      });
    }, 500); // Adjust debounce delay as needed

    return () => clearTimeout(debounceTimer);
  }, [searchText, selectedFilter, sortBy, fetchTripsData]); // Re-run if search, filter, sort, or the fetch function itself changes

  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
    // fetchTripsData will be triggered by the useEffect above because selectedFilter changed
  };

  const handleSort = () => {
    const newSortBy = sortBy === "date" ? "destination" : "date";
    setSortBy(newSortBy);
    // fetchTripsData will be triggered by the useEffect above because sortBy changed
  };

  // --- Other functions (handleTripAction, renderTripItem) remain the same ---
  const handleTripAction = (actionType, tripId) => {
    switch (actionType) {
      case "view":
        // Assuming UserPlanScreen displays details based on passed tripData?
        // If you need to fetch details by ID, navigate differently
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
        console.log("Delete trip:", tripId);
        Alert.alert("Delete", "Delete functionality not yet implemented.");
        break;
      default:
        break;
    }
  };

  const renderTripItem = ({ item }) => (
    <TripCard
      item={item} // Pass the whole item
      // Pass handlers
      onViewPress={() => handleTripAction("view", item.id)}
      onEditPress={() => handleTripAction("edit", item.id)}
      onSharePress={() => handleTripAction("share", item.id)}
      onDeletePress={() => handleTripAction("delete", item.id)}
    />
  );

  const { isDarkMode, colors } = useTheme();

  // --- Render logic remains largely the same ---
  // Use `WorkspaceTripsData` in the retry button
  return (
    <SafeAreaView
      className={`flex-1 ${
        isDarkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* StatusBar */}
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />

      {/* Header - Containts search bar and filters */}
      <View className="px-4 mb-2">
        {/* Search Bar - Positioned above the list */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder={i18n.t("trips.list.searchPlaceholder")}
          // onSearchPress removed as search triggers via useEffect
          containerClassName="mt-4 mb-2 h-16"
        />

        {/* Filter and Sort Options - Positioned above the list */}
        <View
          className={`${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"
          } rounded-3xl shadow py-2 px-4 gap-2`}
        >
          {/* Title and Sort Button */}
          <View className="flex-row justify-between items-center ">
            <Text
              className={`text-xl font-bold ${
                isDarkMode ? "text-gray-200" : "text-gray-800"
              }`}
              accessibilityRole="header"
            >
              {i18n.t("trips.list.title")}
            </Text>
            <TouchableOpacity
              onPress={handleSort}
              className="flex-row items-center p-1"
            >
              <Filter size={20} color="#3B82F6" />
              <Text className="text-sm text-blue-500 font-medium ml-1.5">
                {i18n.t("trips.list.sortBy")}{" "}
                {i18n.t(
                  `trips.list.sortOptions.${
                    sortBy === "date" ? "date" : "destination"
                  }`
                )}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-1 mb-2" // Add negative margin to align edges visually
            contentContainerStyle={{ paddingHorizontal: 4 }} // Add padding inside scroll
          >
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleFilterChange(option.id)}
                className={`px-4 py-2 rounded-full mx-1 ${
                  selectedFilter === option.id
                    ? "bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                <Text
                  className={`${
                    selectedFilter === option.id
                      ? "text-white"
                      : colorScheme === "dark"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {i18n.t(`trips.list.filters.${option.id}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Body - Contains List aria */}
      <View className="flex-1 px-4">
        {/* List Area */}
        {isLoading && trips.length === 0 ? ( // Show loader only on initial load
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : !isLoading && trips.length === 0 ? ( // Show empty/error state
          <View className="flex-1 justify-center items-center">
            <AlertCircle
              size={40}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6b7280"}
            />
            <Text
              className={`text-lg mt-4 text-center ${
                colorScheme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {error ? error : i18n.t("trips.list.noTripsFound")}
            </Text>
            {error ? (
              <TouchableOpacity
                className="mt-6 bg-blue-500 px-5 py-2.5 rounded-lg shadow"
                onPress={() => fetchTripsData({ page: 1 })} // Retry initial fetch
              >
                <Text className="text-white font-medium">
                  {i18n.t("trips.list.retry")}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          // Show list
          <FlatList
            data={trips}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id?.toString()} // Ensure key is string
            contentContainerStyle={{ paddingBottom: 180 }}
            showsVerticalScrollIndicator={false}
            // Add onRefresh and onEndReached for pull-to-refresh/load-more
            // onRefresh={() => fetchTripsData({ page: 1 })}
            // refreshing={isLoading}
            // onEndReached={() => {
            //    if (paginationInfo && currentPage < paginationInfo.total) {
            //        fetchTripsData({ page: currentPage + 1, append: true });
            //    }
            // }}
            // onEndReachedThreshold={0.5}
            // ListFooterComponent={isLoading && trips.length > 0 ? <ActivityIndicator /> : null}
          />
        )}
      </View>

      {/* Create Button - Outside FlatList, Positioned relative to SafeAreaView */}
      <TouchableOpacity
        className="bg-blue-500 absolute bottom-36 w-auto right-4 left-4 py-3.5 rounded-full items-center shadow mx-4" // Adjust margins
        onPress={() => navigation.navigate("CreateTrip")}
      >
        <Text className="text-white text-lg font-bold">
          {i18n.t("trips.list.createNew")}
        </Text>
      </TouchableOpacity>

      {/* Floating Nav - Positioned relative to SafeAreaView */}
      <FloatingBottomNav activeRouteName="Trips" />
    </SafeAreaView>
  );
}

export default TripListScreen;
