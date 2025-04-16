import React, { useState, useCallback, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StatusBar,
    ActivityIndicator,
    ScrollView,
    Alert
} from 'react-native';
import { Filter, AlertCircle } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
// import { supabase } from '../../config/supabaseClient';
import SearchBar from '../../components/common/SearchBar';
import TripCard from '../../components/home/TripCard';
import FloatingBottomNav from '../../components/navigation/FloatingBottomNav';
import i18n from '../../config/appConfig';
import { fetchWithTimeout, API, ENDPOINTS } from '../../services/tripService';

// Temporary mock data until API is ready
const mockTripsData = [
    {
        id: '1',
        destination: 'New York',
        duration: '5 Days',
        startDate: '2024-06-15',
        endDate: '2024-06-20',
        status: 'upcoming',
        thumbnail: require('../../../assets/dubai.jpeg'),
    },
    {
        id: '2',
        destination: 'Paris',
        duration: '7 Days',
        startDate: '2024-07-01',
        endDate: '2024-07-08',
        status: 'planning',
        thumbnail: require('../../../assets/paris.jpg'),
    },
    {
        id: '3',
        destination: 'Tokyo',
        duration: '10 Days',
        startDate: '2024-08-15',
        endDate: '2024-08-25',
        status: 'completed',
        thumbnail: require('../../../assets/tokyo.jpg'),        // Replace with actual image URL
    },
];
function TripListScreen({ navigation }) {
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState('');
    const colorScheme = useColorScheme();
    
    // Fetch trips data
    const fetchTrips = async () => {
        setIsLoading(true);
        setError('');
        try {
            // When ready, replace with this Supabase query
            // const { data, error } = await supabase
            //     .from('trips')
            //     .select('*')
            //     .order('created_at', { ascending: false });
            
            // if (error) throw error;
            
            // For now, using mock data
            const response = await fetchWithTimeout(ENDPOINTS.TRIPS);
            setTrips(response.data || mockTripsData);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError(i18n.t('trips.list.errors.fetchFailed'));
            setTrips(mockTripsData); // Fallback to mock data
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date'); // 'date' or 'destination'

    const filterOptions = [
        { id: 'all', label: 'All' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'planning', label: 'Planning' },
        { id: 'completed', label: 'Completed' }
    ];

    const handleSearch = useCallback(() => {
        setIsLoading(true);
        const filteredTrips = trips.filter(trip => 
            trip.destination.toLowerCase().includes(searchText.toLowerCase()) ||
            trip.duration.toLowerCase().includes(searchText.toLowerCase())
        );
        setTimeout(() => {
            setTrips(filteredTrips);
            setIsLoading(false);
        }, 500);
    }, [searchText, trips]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchText) handleSearch();
            else fetchTrips(); // Reset to original data when search is empty
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchText, handleSearch]);

    const handleFilterChange = (filterId) => {
        setSelectedFilter(filterId);
        if (filterId === 'all') {
            fetchTrips(); // Reset to original data
            return;
        }
        const filteredTrips = trips.filter(trip => trip.status === filterId);
        setTrips(filteredTrips);
    };

    const handleSort = () => {
        const sortedTrips = [...trips];
        if (sortBy === 'date') {
            sortedTrips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setSortBy('destination');
        } else {
            sortedTrips.sort((a, b) => a.destination.localeCompare(b.destination));
            setSortBy('date');
        }
        setTrips(sortedTrips);
    };

    const handleTripAction = (actionType, tripId) => {
        switch (actionType) {
            case 'view':
                navigation.navigate('TripDetailsScreen', { tripId });
                break;
            case 'edit':
                console.log('Edit trip:', tripId);
                break;
            case 'share':
                console.log('Share trip:', tripId);
                break;
            case 'delete':
                console.log('Delete trip:', tripId);
                break;
            default:
                break;
        }
    };

    const renderTripItem = ({ item }) => (
        <TripCard
            item={item}
            onViewPress={() => handleTripAction('view', item.id)}
            onEditPress={() => handleTripAction('edit', item.id)}
            onSharePress={() => handleTripAction('share', item.id)}
            onDeletePress={() => handleTripAction('delete', item.id)}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="rgb(249 250 251)" />
            <View className="flex-1 px-4 pb-20">
                <SearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search for a trip..."
                    onSearchPress={handleSearch}
                    containerClassName="my-4"
                />

                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text 
                            className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}
                            accessibilityRole="header"
                        >
                            {i18n.t('trips.list.title')}
                        </Text>
                        <TouchableOpacity onPress={handleSort} className="flex-row items-center">
                            <Filter size={20} color="#3B82F6" />
                            <Text className="text-sm text-blue-500 font-medium ml-2">
                                {i18n.t('trips.list.sortBy')} {i18n.t(`trips.list.sortOptions.${sortBy}`)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false} 
                        className="mb-4"
                    >
                        {filterOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => handleFilterChange(option.id)}
                                className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === option.id ? 'bg-blue-500' : 'bg-gray-200'}`}
                            >
                                <Text 
                                    className={`${selectedFilter === option.id ? 'text-white' : colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                                    accessibilityRole="button"
                                    accessibilityState={{ selected: selectedFilter === option.id }}
                                    accessibilityLabel={i18n.t(`trips.list.filters.${option.id}`)}
                                >
                                    {i18n.t(`trips.list.filters.${option.id}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#3B82F6" />
                    </View>
                ) : trips.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <View className="flex-1 justify-center items-center">
                            <AlertCircle size={40} color={colorScheme === 'dark' ? '#fff' : '#6b7280'} />
                            <Text className={`text-lg mt-4 ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                {i18n.t('trips.list.noTripsFound')}
                            </Text>
                            {error ? (
                                <TouchableOpacity 
                                    className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                                    onPress={fetchTrips}
                                    accessibilityRole="button"
                                    accessibilityLabel={i18n.t('trips.list.retry')}
                                >
                                    <Text className="text-white font-medium">{i18n.t('trips.list.retry')}</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={trips}
                        renderItem={renderTripItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}

                <TouchableOpacity 
                    className="bg-blue-500 py-4 rounded-full items-center my-5 shadow-lg"
                    onPress={() => navigation.navigate('CreateTrip')}
                    style={{ marginBottom: 70 }}
                >
                    <Text 
                        className="text-white text-lg font-bold"
                        accessibilityRole="button"
                    >
                        {i18n.t('trips.list.createNew')}
                    </Text>
                </TouchableOpacity>

                <FloatingBottomNav activeRouteName="Trips" />
            </View>
        </SafeAreaView>
    );
};

export default TripListScreen;