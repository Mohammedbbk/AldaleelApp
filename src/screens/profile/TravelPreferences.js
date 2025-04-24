// screens/TravelPreferences.js  
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
    ChevronLeft,  
    CheckCircle,  
    Circle,  
} from 'lucide-react-native';  

export default function TravelPreferences() {  
    const navigation = useNavigation();  
    
    // Default travel preferences state  
    const [preferences, setPreferences] = useState({  
        interests: {  
            culture: true,  
            nature: true,  
            food: true,  
            shopping: false,  
            adventure: false,  
            relaxation: true,  
        },  
        pace: 'balanced', // 'relaxed', 'balanced', 'intense'  
        requirements: {  
            halalFood: true,  
            wheelchairAccessible: false,  
            kidFriendly: false,  
            petFriendly: false,  
        },  
        transportation: 'mix', // 'public', 'private', 'walking', 'mix'  
    });  

    // Function to navigate back to ProfileSetting  
    const navigateToProfileSetting = () => {  
        navigation.navigate('ProfileSetting');  
    };  

    // Toggle boolean preferences  
    const toggleInterest = (key) => {  
        setPreferences(prev => ({  
            ...prev,  
            interests: {  
                ...prev.interests,  
                [key]: !prev.interests[key]  
            }  
        }));  
    };  

    const toggleRequirement = (key) => {  
        setPreferences(prev => ({  
            ...prev,  
            requirements: {  
                ...prev.requirements,  
                [key]: !prev.requirements[key]  
            }  
        }));  
    };  

    // Set single-choice preferences  
    const setPace = (value) => {  
        setPreferences(prev => ({  
            ...prev,  
            pace: value  
        }));  
    };  

    const setTransportation = (value) => {  
        setPreferences(prev => ({  
            ...prev,  
            transportation: value  
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
                <Text className="text-xl font-bold text-gray-800 ml-2">Default Travel Preferences</Text>  
            </View>  

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>  
                <View className="p-6">  
                    {/* Description */}  
                    <View className="mb-6">  
                        <Text className="text-base text-gray-600">  
                            Set your default travel preferences. These will be applied automatically when creating new trips, but you can always customize them for each trip.  
                        </Text>  
                    </View>  

                    {/* Interests Section */}  
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">  
                        <View className="p-4 border-b border-gray-100">  
                            <Text className="text-lg font-semibold text-gray-800 mb-1">Travel Interests</Text>  
                            <Text className="text-sm text-gray-500">Select what you typically enjoy during your trips</Text>  
                        </View>  

                        <View className="p-2">  
                            <View className="flex-row flex-wrap">  
                                {/* Interest Items */}  
                                <InterestItem   
                                    label="Culture"   
                                    emoji="🏛"   
                                    selected={preferences.interests.culture}  
                                    onPress={() => toggleInterest('culture')}  
                                />  
                                <InterestItem   
                                    label="Nature"   
                                    emoji="🌲"   
                                    selected={preferences.interests.nature}  
                                    onPress={() => toggleInterest('nature')}  
                                />  
                                <InterestItem   
                                    label="Food"   
                                    emoji="🍽"   
                                    selected={preferences.interests.food}  
                                    onPress={() => toggleInterest('food')}  
                                />  
                                <InterestItem   
                                    label="Shopping"   
                                    emoji="🛍"   
                                    selected={preferences.interests.shopping}  
                                    onPress={() => toggleInterest('shopping')}  
                                />  
                                <InterestItem   
                                    label="Adventure"   
                                    emoji="🗺"   
                                    selected={preferences.interests.adventure}  
                                    onPress={() => toggleInterest('adventure')}  
                                />  
                                <InterestItem   
                                    label="Relaxation"   
                                    emoji="🧘"   
                                    selected={preferences.interests.relaxation}  
                                    onPress={() => toggleInterest('relaxation')}  
                                />  
                            </View>  
                        </View>  
                    </View>  

                    {/* Trip Pace Section */}  
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">  
                        <View className="p-4 border-b border-gray-100">  
                            <Text className="text-lg font-semibold text-gray-800 mb-1">Trip Pace</Text>  
                            <Text className="text-sm text-gray-500">How do you prefer to explore?</Text>  
                        </View>  

                        <View className="p-4">  
                            <View className="flex-row justify-between">  
                                <PaceOption   
                                    label="Relaxed"   
                                    selected={preferences.pace === 'relaxed'}  
                                    onPress={() => setPace('relaxed')}  
                                />  
                                <PaceOption   
                                    label="Balanced"   
                                    selected={preferences.pace === 'balanced'}  
                                    onPress={() => setPace('balanced')}  
                                />  
                                <PaceOption   
                                    label="Intense"   
                                    selected={preferences.pace === 'intense'}  
                                    onPress={() => setPace('intense')}  
                                />  
                            </View>  
                        </View>  
                    </View>  

                    {/* Special Requirements */}  
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">  
                        <View className="p-4 border-b border-gray-100">  
                            <Text className="text-lg font-semibold text-gray-800 mb-1">Special Requirements</Text>  
                            <Text className="text-sm text-gray-500">Your typical travel needs</Text>  
                        </View>  

                        <View>  
                            <RequirementItem   
                                label="Halal Food Required"   
                                value={preferences.requirements.halalFood}  
                                onToggle={() => toggleRequirement('halalFood')}  
                            />  
                            <RequirementItem   
                                label="Wheelchair Accessible"   
                                value={preferences.requirements.wheelchairAccessible}  
                                onToggle={() => toggleRequirement('wheelchairAccessible')}  
                            />  
                            <RequirementItem   
                                label="Kid-Friendly"   
                                value={preferences.requirements.kidFriendly}  
                                onToggle={() => toggleRequirement('kidFriendly')}  
                            />  
                            <RequirementItem   
                                label="Pet-Friendly"   
                                value={preferences.requirements.petFriendly}  
                                onToggle={() => toggleRequirement('petFriendly')}  
                                noBorder  
                            />  
                        </View>  
                    </View>  

                    {/* Transportation Preference */}  
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">  
                        <View className="p-4 border-b border-gray-100">  
                            <Text className="text-lg font-semibold text-gray-800 mb-1">Transportation Preference</Text>  
                            <Text className="text-sm text-gray-500">How do you prefer to get around?</Text>  
                        </View>  

                        <View className="p-4">  
                            <RadioOption   
                                label="Public Transport"   
                                selected={preferences.transportation === 'public'}  
                                onPress={() => setTransportation('public')}  
                            />  
                            <RadioOption   
                                label="Private Car"   
                                selected={preferences.transportation === 'private'}  
                                onPress={() => setTransportation('private')}  
                            />  
                            <RadioOption   
                                label="Walking/Biking"   
                                selected={preferences.transportation === 'walking'}  
                                onPress={() => setTransportation('walking')}  
                            />  
                            <RadioOption   
                                label="Mix of all"   
                                selected={preferences.transportation === 'mix'}  
                                onPress={() => setTransportation('mix')}  
                                noBorder  
                            />  
                        </View>  
                    </View>  

                    {/* Save Button */}  
                    <TouchableOpacity   
                        className="bg-blue-500 py-4 rounded-xl items-center"  
                        onPress={() => {  
                            // Here you would implement saving the settings  
                            // Save logic here...  
                            
                            // Then navigate to ProfileSetting  
                            navigateToProfileSetting();  
                        }}  
                    >  
                        <Text className="text-white font-semibold text-base">Save Default Preferences</Text>  
                    </TouchableOpacity>  
                </View>  
                
                {/* Bottom spacing */}  
                <View className="h-8" />  
            </ScrollView>  
        </SafeAreaView>  
    );  
}  

// Component for interest item  
const InterestItem = ({ label, emoji, selected, onPress }) => (  
    <TouchableOpacity   
        className={`m-2 p-3 rounded-xl border ${selected ? 'bg-blue-50 border-blue-500' : 'border-gray-200'}`}  
        onPress={onPress}  
    >  
        <View className="items-center">  
            <Text className="text-2xl mb-1">{emoji}</Text>  
            <Text className={`text-sm ${selected ? 'text-blue-500 font-medium' : 'text-gray-700'}`}>{label}</Text>  
        </View>  
    </TouchableOpacity>  
);  

// Component for pace option  
const PaceOption = ({ label, selected, onPress }) => (  
    <TouchableOpacity   
        className={`px-5 py-3 rounded-xl ${selected ? 'bg-blue-500' : 'bg-gray-100'}`}  
        onPress={onPress}  
    >  
        <Text className={`text-center ${selected ? 'text-white font-medium' : 'text-gray-700'}`}>  
            {label}  
        </Text>  
    </TouchableOpacity>  
);  

// Component for requirement item with switch  
const RequirementItem = ({ label, value, onToggle, noBorder = false }) => (  
    <View className={`flex-row items-center justify-between p-4 ${!noBorder ? 'border-b border-gray-100' : ''}`}>  
        <Text className="text-base text-gray-700">{label}</Text>  
        <Switch  
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}  
            thumbColor={value ? "#3b82f6" : "#f4f4f5"}  
            onValueChange={onToggle}  
            value={value}  
        />  
    </View>  
);  

// Component for radio option  
const RadioOption = ({ label, selected, onPress, noBorder = false }) => (  
    <TouchableOpacity   
        className={`flex-row items-center py-3 ${!noBorder ? 'border-b border-gray-100' : ''}`}  
        onPress={onPress}  
    >  
        {selected ?   
            <CheckCircle size={20} color="#3b82f6" /> :   
            <Circle size={20} color="#9ca3af" />  
        }  
        <Text className={`ml-3 text-base ${selected ? 'text-blue-500 font-medium' : 'text-gray-700'}`}>  
            {label}  
        </Text>  
    </TouchableOpacity>  
);  