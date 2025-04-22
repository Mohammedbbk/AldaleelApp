// screens/ProfileInfoScreen.js  
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
  ArrowLeft,  
  Mail,  
  MapPin,  
  Plane,  
  Clock,  
  Star,  
  Map,  
  Edit3, // Added Edit icon  
} from 'lucide-react-native';  

export default function ProfileInfoScreen() {  
  const navigation = useNavigation();  

  // User data (could be retrieved from a context or API)  
  const userData = {  
    name: 'Nawaf Fahad',  
    email: 'nawaf@gmail.com',  
    location: 'Riyadh, Saudi Arabia',  

    //الصورة هنا!!!
    avatar: require('../../../assets/onboard/beachAdventure.png'),  
    memberSince: 'March 2022',  
    tripStats: {  
      completedTrips: 15,  
      plannedTrips: 3,  
      totalCountries: 8,  
      averageRating: 4.8,  
    }  
  };  

  return (  
    <SafeAreaView className="flex-1 bg-gray-50">  
      <StatusBar barStyle="dark-content" backgroundColor="rgb(249 250 251)" />  

      {/* Top navigation bar */}  
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">  
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">  
          <ArrowLeft size={24} color="#374151" />  
        </TouchableOpacity>  
        <Text className="text-lg font-bold text-gray-800">Profile Info</Text>  
        {/* Edit button added to top right */}  
        <TouchableOpacity   
          onPress={() => navigation.navigate('EditProfile')}   
          className="p-2"  
        >  
          <Edit3 size={24} color="#3b82f6" />  
        </TouchableOpacity>  
      </View>  

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>  
        <View className="p-6 pb-8">  
          
          {/* Profile Overview Card */}  
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">  
            <View className="p-5 border-b border-gray-100 flex-row items-center">  
              <Image  
                source={userData.avatar}  
                className="w-20 h-20 rounded-full border-2 border-blue-100"  
              />  
              <View className="ml-4">  
                <Text className="text-xl font-bold text-gray-800">{userData.name}</Text>  
                <Text className="text-sm text-gray-500">Member since {userData.memberSince}</Text>  
              </View>  
            </View>  
            
            {/* Basic Info */}  
            <View className="p-4 border-b border-gray-100">  
              <Text className="text-base font-semibold text-gray-700 mb-3">Basic Information</Text>  
              
              <View className="space-y-3">  
                <View className="flex-row items-center">  
                  <Mail size={18} color="#6b7280" className="mr-3" />  
                  <View>  
                    <Text className="text-xs text-gray-500">Email</Text>  
                    <Text className="text-sm text-gray-700">{userData.email}</Text>  
                  </View>  
                </View>  
                
                <View className="flex-row items-center">  
                  <MapPin size={18} color="#6b7280" className="mr-3" />  
                  <View>  
                    <Text className="text-xs text-gray-500">Location</Text>  
                    <Text className="text-sm text-gray-700">{userData.location}</Text>  
                  </View>  
                </View>  
              </View>  
            </View>  
            
            {/* Travel Stats */}  
            <View className="p-4">  
              <Text className="text-base font-semibold text-gray-700 mb-3">Travel Statistics</Text>  
              
              <View className="flex-row flex-wrap">  
                <View className="w-1/2 mb-4">  
                  <View className="flex-row items-center">  
                    <Plane size={18} color="#3b82f6" className="mr-2" />  
                    <Text className="text-xs text-gray-500">Completed Trips</Text>  
                  </View>  
                  <Text className="text-lg font-bold text-gray-800 ml-6">{userData.tripStats.completedTrips}</Text>  
                </View>  
                
                <View className="w-1/2 mb-4">  
                  <View className="flex-row items-center">  
                    <Clock size={18} color="#3b82f6" className="mr-2" />  
                    <Text className="text-xs text-gray-500">Planned Trips</Text>  
                  </View>  
                  <Text className="text-lg font-bold text-gray-800 ml-6">{userData.tripStats.plannedTrips}</Text>  
                </View>  
                
                <View className="w-1/2 mb-4">  
                  <View className="flex-row items-center">  
                    <Map size={18} color="#3b82f6" className="mr-2" />  
                    <Text className="text-xs text-gray-500">Countries Visited</Text>  
                  </View>  
                  <Text className="text-lg font-bold text-gray-800 ml-6">{userData.tripStats.totalCountries}</Text>  
                </View>  
                
                <View className="w-1/2 mb-4">  
                  <View className="flex-row items-center">  
                    <Star size={18} color="#3b82f6" className="mr-2" />  
                    <Text className="text-xs text-gray-500">Average Rating</Text>  
                  </View>  
                  <Text className="text-lg font-bold text-gray-800 ml-6">{userData.tripStats.averageRating}</Text>  
                </View>  
              </View>  
            </View>  
          </View>  
        </View>  
      </ScrollView>  
    </SafeAreaView>  
  );  
}  