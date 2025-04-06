// screens/ProfileScreen.js
import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    Mail,
    Edit3, // Pencil icon
    User,
    Plane, // Airplane icon
    Globe,
    Bell,
    Palette, // Theme icon
    ChevronRight,
} from 'lucide-react-native';

// Import the shared bottom navigation component
import FloatingBottomNav from '../components/home/FloatingBottomNav'; // Adjust path as needed

// Define the options data
const profileOptions = [
    { id: 'edit', label: 'Edit Profile', icon: Edit3, screen: 'EditProfile' }, // Route names are examples
    { id: 'info', label: 'Profile Info', icon: User, screen: 'ProfileInfo' },
    { id: 'prefs', label: 'Travel Preferences', icon: Plane, screen: 'TravelPreferences' },
    { id: 'lang', label: 'Language', icon: Globe, screen: 'LanguageSettings' },
    { id: 'notif', label: 'Notifications', icon: Bell, screen: 'NotificationSettings' },
    { id: 'theme', label: 'Theme', icon: Palette, screen: 'ThemeSettings' },
];

export default function ProfileScreen() {
    const navigation = useNavigation();
    const currentRouteName = 'Profile'; // Set the active route for the bottom nav

    // Placeholder for user data
    const userData = {
        name: 'Nawaf Fahad',
        email: 'nawaf@gmail.com',
        avatar: require('../assets/placeholder-avatar.png'), // ** REPLACE with your actual avatar image **
        completedTrips: 15,
        reviews: 50,
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="rgb(249 250 251)" />{/* Match bg-gray-50 */}

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6 pb-8">

                    {/* --- Top Profile Info Section --- */}
                    <View className="flex-row items-center justify-between bg-white p-5 rounded-2xl shadow-sm mb-8">
                        {/* Left Side: Avatar, Name, Email */}
                        <View className="flex-row items-center flex-shrink mr-4">
                            <Image
                                source={userData.avatar} // Use the placeholder or actual user avatar
                                className="w-16 h-16 rounded-full mr-4 border-2 border-blue-100"
                            />
                            <View className="flex-shrink">
                                <Text className="text-lg font-bold text-gray-800">{userData.name}</Text>
                                <View className="flex-row items-center mt-1">
                                    <Mail size={14} color="#6b7280" />
                                    <Text className="text-sm text-gray-500 ml-1.5">{userData.email}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Right Side: Stats */}
                        <View className="items-end space-y-2">
                            <View className="items-center">
                                <Text className="text-xs text-gray-500">Completed Trips</Text>
                                <Text className="text-xl font-bold text-blue-500">{userData.completedTrips}</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-xs text-gray-500">Reviews</Text>
                                <Text className="text-xl font-bold text-blue-500">{userData.reviews}</Text>
                            </View>
                        </View>
                    </View>

                    {/* --- Profile Options List --- */}
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {profileOptions.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                className={`flex-row items-center justify-between p-4 ${
                                    index < profileOptions.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                                onPress={() => navigation.navigate(item.screen)} // Navigate to the defined screen
                            >
                                <View className="flex-row items-center">
                                    <item.icon size={20} color="#4b5563" /> {/* Use the icon component */}
                                    <Text className="text-base text-gray-700 ml-4">{item.label}</Text>
                                </View>
                                <ChevronRight size={18} color="#9ca3af" />
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
                 {/* Add padding at the bottom of scroll content to avoid overlap with nav */}
                 <View className="h-24" />
            </ScrollView>

            {/* --- Floating Bottom Navigation --- */}
            {/* Render the extracted component, passing the active route name */}
            <FloatingBottomNav activeRouteName={currentRouteName} />
        </SafeAreaView>
    );
}