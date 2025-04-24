import React, { useState } from 'react';  
import {  
    SafeAreaView,  
    View,  
    Text,  
    TouchableOpacity,  
    StatusBar,  
    ScrollView,  
    Switch,  
} from 'react-native';  
import { useNavigation } from '@react-navigation/native';  
import {  
    Bell,  
    Calendar,  
    MessageSquare,  
    AlertTriangle,  
    ChevronLeft,  
} from 'lucide-react-native';  

export default function NotificationSettings() {  
    const navigation = useNavigation();  
    
    // Notification settings state  
    const [notificationSettings, setNotificationSettings] = useState({  
        tripUpdates: true,  
        chatMessages: true,  
        travelAlerts: false,  
        promotions: false,  
    });  

    // Function to navigate back to ProfileSetting  
    const navigateToProfileSetting = () => {  
        navigation.navigate('ProfileSetting');  
    };  

    // Toggle handler for switches  
    const toggleSwitch = (key) => {  
        setNotificationSettings(prevState => ({  
            ...prevState,  
            [key]: !prevState[key]  
        }));  
    };  

    return (  
        <SafeAreaView className="flex-1 bg-gray-50">  
            <StatusBar barStyle="dark-content" backgroundColor="rgb(249 250 251)" />  

            {/* Header with back button */}  
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">  
                <TouchableOpacity   
                    onPress={navigateToProfileSetting}  
                    className="p-2"  
                >  
                    <ChevronLeft size={24} color="#4b5563" />  
                </TouchableOpacity>  
                <Text className="text-xl font-bold text-gray-800 ml-2">Notifications</Text>  
            </View>  

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>  
                <View className="p-6">  
                    {/* Description */}  
                    <View className="mb-6">  
                        <Text className="text-base text-gray-600">  
                            Manage your notification preferences for AI Travel Planner. Choose which notifications you want to receive.  
                        </Text>  
                    </View>  

                    {/* Notification Options */}  
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">  
                        {/* Trip Updates */}  
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-100">  
                            <View className="flex-row items-center">  
                                <Calendar size={20} color="#4b5563" />  
                                <View className="ml-4">  
                                    <Text className="text-base font-medium text-gray-800">Trip Updates</Text>  
                                    <Text className="text-sm text-gray-500">Changes to your travel plans</Text>  
                                </View>  
                            </View>  
                            <Switch  
                                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}  
                                thumbColor={notificationSettings.tripUpdates ? "#3b82f6" : "#f4f4f5"}  
                                onValueChange={() => toggleSwitch('tripUpdates')}  
                                value={notificationSettings.tripUpdates}  
                            />  
                        </View>  

                        {/* Chat Messages */}  
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-100">  
                            <View className="flex-row items-center">  
                                <MessageSquare size={20} color="#4b5563" />  
                                <View className="ml-4">  
                                    <Text className="text-base font-medium text-gray-800">Chat Messages</Text>  
                                    <Text className="text-sm text-gray-500">AI planner responses and suggestions</Text>  
                                </View>  
                            </View>  
                            <Switch  
                                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}  
                                thumbColor={notificationSettings.chatMessages ? "#3b82f6" : "#f4f4f5"}  
                                onValueChange={() => toggleSwitch('chatMessages')}  
                                value={notificationSettings.chatMessages}  
                            />  
                        </View>  

                        {/* Travel Alerts */}  
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-100">  
                            <View className="flex-row items-center">  
                                <AlertTriangle size={20} color="#4b5563" />  
                                <View className="ml-4">  
                                    <Text className="text-base font-medium text-gray-800">Travel Alerts</Text>  
                                    <Text className="text-sm text-gray-500">Important travel advisories</Text>  
                                </View>  
                            </View>  
                            <Switch  
                                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}  
                                thumbColor={notificationSettings.travelAlerts ? "#3b82f6" : "#f4f4f5"}  
                                onValueChange={() => toggleSwitch('travelAlerts')}  
                                value={notificationSettings.travelAlerts}  
                            />  
                        </View>  

                        {/* Promotions */}  
                        <View className="flex-row items-center justify-between p-4">  
                            <View className="flex-row items-center">  
                                <Bell size={20} color="#4b5563" />  
                                <View className="ml-4">  
                                    <Text className="text-base font-medium text-gray-800">Promotions</Text>  
                                    <Text className="text-sm text-gray-500">New features and recommendations</Text>  
                                </View>  
                            </View>  
                            <Switch  
                                trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}  
                                thumbColor={notificationSettings.promotions ? "#3b82f6" : "#f4f4f5"}  
                                onValueChange={() => toggleSwitch('promotions')}  
                                value={notificationSettings.promotions}  
                            />  
                        </View>  
                    </View>  

                    {/* Save Button */}  
                    <TouchableOpacity   
                        className="bg-blue-500 py-4 rounded-xl items-center"  
                        onPress={() => {  
                            // Here you would implement saving the settings to a backend or local storage  
                            // Save logic here...  
                            
                            // Then navigate to ProfileSetting  
                            navigateToProfileSetting();  
                        }}  
                    >  
                        <Text className="text-white font-semibold text-base">Save Preferences</Text>  
                    </TouchableOpacity>  
                </View>  
            </ScrollView>  
        </SafeAreaView>  
    );  
}  