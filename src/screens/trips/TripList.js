import React, { useState, useCallback, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StatusBar,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { Filter } from 'lucide-react-native';

import SearchBar from '../components/common/SearchBar';
import TripCard from '../components/home/TripCard';
import FloatingBottomNav from '../components/home/FloatingBottomNav';

// Mock data for trips
const createdTripsData = [
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

const TripScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [trips, setTrips] = useState(createdTripsData);
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
        const filteredTrips = createdTripsData.filter(trip => 
            trip.destination.toLowerCase().includes(searchText.toLowerCase()) ||
            trip.duration.toLowerCase().includes(searchText.toLowerCase())
        );
        setTimeout(() => {
            setTrips(filteredTrips);
            setIsLoading(false);
        }, 500);
    }, [searchText]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchText) handleSearch();
            else setTrips(createdTripsData);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchText, handleSearch]);

    const handleFilterChange = (filterId) => {
        setSelectedFilter(filterId);
        if (filterId === 'all') {
            setTrips(createdTripsData);
            return;
        }
        const filteredTrips = createdTripsData.filter(trip => trip.status === filterId);
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
                        <Text className="text-xl font-bold text-black">Created Trips</Text>
                        <TouchableOpacity onPress={handleSort} className="flex-row items-center">
                            <Filter size={20} color="#3B82F6" />
                            <Text className="text-sm text-blue-500 font-medium ml-2">
                                Sort by {sortBy === 'date' ? 'destination' : 'date'}
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
                                <Text className={`${selectedFilter === option.id ? 'text-white' : 'text-gray-700'}`}>
                                    {option.label}
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
                        <Text className="text-gray-500 text-lg">No trips found</Text>
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
                    <Text className="text-white text-lg font-bold">Create New</Text>
                </TouchableOpacity>

                <FloatingBottomNav activeRouteName="Trips" />
            </View>
        </SafeAreaView>
    );
};

export default TripScreen;