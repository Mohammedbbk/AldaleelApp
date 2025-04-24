import React from 'react';  
import { View, Text, TouchableOpacity } from 'react-native';  
import { useNavigation } from '@react-navigation/native';  
import { LinearGradient } from 'expo-linear-gradient'; // Import if using gradient for center button  
import {  
  HomeIcon,  
  ListChecksIcon,  
  SearchIcon,  
  MessageSquareIcon,  
  UserIcon,  
} from 'lucide-react-native';  

// Define the component, accepting activeRouteName as a prop  
export default function FloatingBottomNav({ activeRouteName }) {  
  const navigation = useNavigation();  

  // Helper function to determine if a route is active  
  const isActive = (routeName) => activeRouteName === routeName;  

  // Define colors for active/inactive states  
  const activeColor = '#24baec';  
  const inactiveColor = '#1b1f26b8'; // A slightly transparent dark color  
  const activeBgColor = '#e0f4ff'; // Light blue background for active icon  

  return (  
    // Absolute positioning to float above content  
    <View className="absolute bottom-6 left-6 right-6 z-50">  
      {/* Container with shadow and rounded corners */}  
      <View className="bg-white rounded-3xl shadow-xl py-4 px-6">  
        <View className="flex-row justify-between items-center">  

          {/* Home Tab */}  
          <TouchableOpacity  
            className="items-center flex-1" // Use flex-1 for even spacing  
            onPress={() => navigation.navigate('Home')}  
          >  
            <View className={`p-2 rounded-full ${isActive('Home') ? `bg-[${activeBgColor}]` : ''}`}>  
              <HomeIcon size={22} color={isActive('Home') ? activeColor : inactiveColor} strokeWidth={isActive('Home') ? 2.5 : 1.5} />  
            </View>  
            <Text className={`text-xs mt-1 font-medium ${isActive('Home') ? `text-[${activeColor}]` : `text-[${inactiveColor}]`}`}>Home</Text>  
          </TouchableOpacity>  

          {/* Trips Tab */}  
          <TouchableOpacity  
            className="items-center flex-1"  
            onPress={() => navigation.navigate('Trips')}  
          >  
            <View className={`p-2 rounded-full ${isActive('Trips') ? `bg-[${activeBgColor}]` : ''}`}>  
              <ListChecksIcon size={22} color={isActive('Trips') ? activeColor : inactiveColor} strokeWidth={1.5} />  
            </View>  
            <Text className={`text-xs mt-1 ${isActive('Trips') ? `text-[${activeColor}]` : `text-[${inactiveColor}]`}`}>Trips</Text>  
          </TouchableOpacity>  

          {/* Center Search Button */}  
          {/* Added flex-1 to maintain spacing, adjust alignment if needed */}  
          <View className="items-center flex-1">  
            <TouchableOpacity  
              // Raised position using negative margin  
              className="-mt-8 bg-gradient-to-r from-[#24baec] to-[#1a8bec] w-16 h-16 rounded-full justify-center items-center shadow-lg"  
              onPress={() => navigation.navigate('CreateTrip')} // Or specific search screen  
            >  
              <SearchIcon size={28} color="#fff" strokeWidth={2} />  
            </TouchableOpacity>  
          </View>  


          {/* AI Chat Tab - تم تغيير الاسم من AIChat إلى AssistantScreen */}  
          <TouchableOpacity  
            className="items-center flex-1"  
            onPress={() => navigation.navigate('AssistantScreen')}  
          >  
            <View className={`p-2 rounded-full ${isActive('AssistantScreen') ? `bg-[${activeBgColor}]` : ''}`}>  
              <MessageSquareIcon size={22} color={isActive('AssistantScreen') ? activeColor : inactiveColor} strokeWidth={1.5} />  
            </View>  
            <Text className={`text-xs mt-1 ${isActive('AssistantScreen') ? `text-[${activeColor}]` : `text-[${inactiveColor}]`}`}>AI Chat</Text>  
          </TouchableOpacity>  

          {/* Profile Tab - تم تغيير الاسم من Profile إلى ProfileSetting */}  
          <TouchableOpacity  
            className="items-center flex-1"  
            onPress={() => navigation.navigate('ProfileSetting')}  
          >  
            <View className={`p-2 rounded-full ${isActive('ProfileSetting') ? `bg-[${activeBgColor}]` : ''}`}>  
              <UserIcon size={22} color={isActive('ProfileSetting') ? activeColor : inactiveColor} strokeWidth={1.5} />  
            </View>  
            <Text className={`text-xs mt-1 ${isActive('ProfileSetting') ? `text-[${activeColor}]` : `text-[${inactiveColor}]`}`}>Profile</Text>  
          </TouchableOpacity>  

        </View>  
      </View>  
    </View>  
  );  
}  