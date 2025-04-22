// screens/TravelPreferences.js  
import React from 'react';  
import {  
    SafeAreaView,  
    View,  
    Text,  
    TouchableOpacity,  
    StatusBar,  
    ScrollView,  
} from 'react-native';  
import { useNavigation } from '@react-navigation/native';  
import {  
    ChevronLeft,  
    ChevronRight,  
    Coffee,  
    Map,  
    ShoppingBag,  
    Utensils,  
    Tent,  
    Landmark,  
    Clock,  
    Heart,  
} from 'lucide-react-native';  

export default function TravelPreferences() {  
    const navigation = useNavigation();  
    
    // مثال لتفضيلات السفر المحفوظة مسبقًا  
    // في التطبيق الحقيقي، هذه البيانات ستأتي من API أو مخزن الحالة  
    const userPreferences = {  
        interests: ['Culture', 'Food', 'Adventure'],  
        pace: 'Balanced',  
        requirements: ['Halal Food Required'],  
        transportation: 'Mix of all',  
        lastUpdated: '15 Apr 2025',  
    };  

    // تحويل المصالح إلى رموز تعبيرية  
    const interestIcons = {  
        'Culture': { icon: Landmark, emoji: '🏛' },  
        'Nature': { icon: Tent, emoji: '🌲' },  
        'Food': { icon: Utensils, emoji: '🍽' },  
        'Shopping': { icon: ShoppingBag, emoji: '🛍' },  
        'Adventure': { icon: Map, emoji: '🗺' },  
        'Relaxation': { icon: Coffee, emoji: '🧘' },  
    };  

    return (  
        <SafeAreaView className="flex-1 bg-gray-50">  
            <StatusBar barStyle="dark-content" backgroundColor="rgb(249 250 251)" />  

            {/* Header with back button */}  
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">  
                <TouchableOpacity   
                    onPress={() => navigation.goBack()}  
                    className="p-2"  
                >  
                    <ChevronLeft size={24} color="#4b5563" />  
                </TouchableOpacity>  
                <Text className="text-xl font-bold text-gray-800 ml-2">Travel Preferences</Text>  
            </View>  

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>  
                <View className="p-6">  
                    {/* Description */}  
                    <View className="mb-6">  
                        <Text className="text-base text-gray-600">  
                            Review your travel preferences that help our AI create personalized trip plans for you.  
                        </Text>  
                    </View>  

                    {/* Current Preferences Summary */}  
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">  
                        <View className="p-4 border-b border-gray-100">  
                            <Text className="text-base font-semibold text-gray-800 mb-1">Your Current Preferences</Text>  
                            <Text className="text-sm text-gray-500">Last updated: {userPreferences.lastUpdated}</Text>  
                        </View>  

                        {/* Interests */}  
                        <View className="p-4 border-b border-gray-100">  
                            <Text className="text-sm text-gray-500 mb-2">Interests</Text>  
                            <View className="flex-row flex-wrap">  
                                {userPreferences.interests.map((interest) => (  
                                    <View key={interest} className="bg-blue-50 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">  
                                        <Text className="mr-1">{interestIcons[interest]?.emoji}</Text>  
                                        <Text className="text-blue-600">{interest}</Text>  
                                    </View>  
                                ))}  
                            </View>  
                        </View>  

                        {/* Trip Pace */}  
                        <View className="p-4 border-b border-gray-100">  
                            <Text className="text-sm text-gray-500 mb-2">Trip Pace</Text>  
                            <View className="flex-row items-center">  
                                <Clock size={16} color="#4b5563" className="mr-2" />  
                                <Text className="text-gray-800">{userPreferences.pace}</Text>  
                            </View>  
                        </View>  

                        {/* Special Requirements */}  
                        <View className="p-4 border-b border-gray-100">  
                            <Text className="text-sm text-gray-500 mb-2">Special Requirements</Text>  
                            {userPreferences.requirements.length > 0 ? (  
                                <View className="flex-row flex-wrap">  
                                    {userPreferences.requirements.map((req) => (  
                                        <View key={req} className="bg-green-50 rounded-full px-3 py-1 mr-2 mb-2">  
                                            <Text className="text-green-600">{req}</Text>  
                                        </View>  
                                    ))}  
                                </View>  
                            ) : (  
                                <Text className="text-gray-800">None specified</Text>  
                            )}  
                        </View>  

                        {/* Transportation */}  
                        <View className="p-4">  
                            <Text className="text-sm text-gray-500 mb-2">Transportation Preference</Text>  
                            <Text className="text-gray-800">{userPreferences.transportation}</Text>  
                        </View>  
                    </View>  

                    {/* Edit Button */}  
                    <TouchableOpacity   
                        className="bg-white border border-blue-500 mb-4 py-4 rounded-xl flex-row items-center justify-center"  
                        onPress={() => {  
                            // هنا يتم توجيه المستخدم إلى صفحة تعديل التفضيلات (الصفحة الموجودة بالفعل)  
                            navigation.navigate('EditTravelPreferences'); // استبدلها باسم الصفحة الفعلية  
                        }}  
                    >  
                        <Heart size={20} color="#3b82f6" />  
                        <Text className="text-blue-500 font-semibold text-base ml-2">Edit Preferences</Text>  
                    </TouchableOpacity>  
                    
                    {/* Apply to Current Trip */}  
                    <TouchableOpacity   
                        className="bg-blue-500 py-4 rounded-xl items-center"  
                        onPress={() => {  
                            // تطبيق التفضيلات على الرحلة الحالية  
                            // ثم العودة إلى صفحة الرحلة  
                            navigation.navigate('CurrentTrip'); // استبدلها باسم الصفحة الفعلية  
                        }}  
                    >  
                        <Text className="text-white font-semibold text-base">Apply to Current Trip</Text>  
                    </TouchableOpacity>  
                </View>  

                {/* Information Card */}  
                <View className="mx-6 mb-8 p-4 bg-amber-50 rounded-xl border border-amber-200">  
                    <Text className="text-amber-800 text-sm">  
                        Your travel preferences help our AI understand what matters most to you. We use these settings to generate personalized trip plans that match your unique travel style.  
                    </Text>  
                </View>  
            </ScrollView>  
        </SafeAreaView>  
    );  
}  