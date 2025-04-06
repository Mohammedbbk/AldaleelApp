import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StatusBar,
} from 'react-native';

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
        thumbnail: '../../../assets/tokyo.jpg', // Replace with actual image URL
    },
];

const TripScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');

    const handleSearch = () => {
        // Implement search functionality
        console.log('Searching for:', searchText);
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

                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold text-black">Created Trips</Text>
                    <TouchableOpacity>
                        <Text className="text-sm text-blue-500 font-medium">View all</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={createdTripsData}
                    renderItem={renderTripItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                />

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