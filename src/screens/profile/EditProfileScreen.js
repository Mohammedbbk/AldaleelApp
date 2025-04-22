import React, { useState, useEffect } from 'react';  
import {  
  SafeAreaView,  
  View,  
  Text,  
  TextInput,  
  TouchableOpacity,  
  Image,  
  ScrollView,  
  StatusBar,  
  Alert,  
  Platform,  
} from 'react-native';  
import { useNavigation } from '@react-navigation/native';  
import {  
  ArrowLeft,  
  User,  
  Mail,  
  MapPin,  
  Check,  
  Camera,  
  X  
} from 'lucide-react-native';  
import * as ImagePicker from 'expo-image-picker'; // You need to install this package  

export default function EditProfileScreen() {  
  const navigation = useNavigation();  

  // Initial user data  
  const [userData, setUserData] = useState({  
    name: 'Nawaf Fahad',  
    email: 'nawaf@gmail.com',  


    //الصورة هنا!!!
    avatar: require('../../../assets/onboard/beachAdventure.png'),  
    location: 'Riyadh, Saudi Arabia',  
  });  

  // Copy of data for editing  
  const [formData, setFormData] = useState({...userData});  
  
  // Email validation  
  const [isValidEmail, setIsValidEmail] = useState(true);  
  const [emailError, setEmailError] = useState('');  

  // Validate email  
  const validateEmail = (email) => {  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    const isValid = emailRegex.test(email);  
    setIsValidEmail(isValid);  
    
    if (!isValid) {  
      setEmailError('Please enter a valid email address');  
    } else {  
      setEmailError('');  
    }  
    
    return isValid;  
  };  

  // Pick image from gallery  
  const pickImage = async () => {  
    try {  
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();  
      
      if (permissionResult.granted === false) {  
        Alert.alert('Permission required', 'We need permission to access your photo library');  
        return;  
      }  

      const result = await ImagePicker.launchImageLibraryAsync({  
        mediaTypes: ImagePicker.MediaTypeOptions.Images,  
        allowsEditing: true,  
        aspect: [1, 1],  
        quality: 0.8,  
      });  

      if (!result.canceled) {  
        // Update selected image  
        setFormData({  
          ...formData,  
          avatar: { uri: result.assets[0].uri }  
        });  
      }  
    } catch (error) {  
      Alert.alert('Error', 'An error occurred while picking the image');  
    }  
  };  

  // Take photo using camera  
  const takePhoto = async () => {  
    try {  
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();  
      
      if (permissionResult.granted === false) {  
        Alert.alert('Permission required', 'We need permission to access your camera');  
        return;  
      }  

      const result = await ImagePicker.launchCameraAsync({  
        allowsEditing: true,  
        aspect: [1, 1],  
        quality: 0.8,  
      });  

      if (!result.canceled) {  
        setFormData({  
          ...formData,  
          avatar: { uri: result.assets[0].uri }  
        });  
      }  
    } catch (error) {  
      Alert.alert('Error', 'An error occurred while taking the photo');  
    }  
  };  

  // Save changes  
  const saveChanges = () => {  
    // Validate email before saving  
    if (!validateEmail(formData.email)) {  
      return;  
    }  
        
    // Navigate back to profile screen after saving  
    navigation.navigate('Profile');  
  };  

  return (  
    <SafeAreaView className="flex-1 bg-gray-50">  
      <StatusBar barStyle="dark-content" backgroundColor="rgb(249 250 251)" />  

      {/* Top navigation bar */}  
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">  
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">  
          <ArrowLeft size={24} color="#374151" />  
        </TouchableOpacity>  
        <Text className="text-lg font-bold text-gray-800">Edit Profile</Text>  
        <TouchableOpacity   
          onPress={saveChanges}  
          className="p-2 bg-blue-500 rounded-full"  
        >  
          <Check size={20} color="#FFFFFF" />  
        </TouchableOpacity>  
      </View>  

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>  
        <View className="p-6 pb-8">  

          {/* Profile Picture Section */}  
          <View className="items-center mb-8">  
            <View className="relative">  
              <Image  
                source={formData.avatar}  
                className="w-28 h-28 rounded-full border-4 border-blue-100"  
              />  
              <View className="absolute bottom-0 right-0 flex-row">  
                <TouchableOpacity   
                  onPress={pickImage}  
                  className="bg-blue-500 p-2 rounded-full mr-2"  
                >  
                  <Camera size={20} color="#FFFFFF" />  
                </TouchableOpacity>  
                <TouchableOpacity   
                  onPress={takePhoto}  
                  className="bg-green-500 p-2 rounded-full"  
                >  
                  <Camera size={20} color="#FFFFFF" />  
                </TouchableOpacity>  
              </View>  
            </View>  
            <Text className="text-gray-500 mt-2 text-sm">Tap on camera icon to change photo</Text>  
          </View>  

          {/* Personal Information Fields */}  
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">  
            {/* Name */}  
            <View className="p-4 border-b border-gray-100">  
              <Text className="text-sm text-gray-500 mb-1">Name</Text>  
              <View className="flex-row items-center">  
                <User size={18} color="#6b7280" className="mr-2" />  
                <TextInput  
                  value={formData.name}  
                  onChangeText={(text) => setFormData({...formData, name: text})}  
                  className="flex-1 text-gray-800 text-base py-1"  
                  placeholder="Enter your full name"  
                />  
              </View>  
            </View>  

            {/* Email */}  
            <View className="p-4 border-b border-gray-100">  
              <Text className="text-sm text-gray-500 mb-1">Email</Text>  
              <View className="flex-row items-center">  
                <Mail size={18} color="#6b7280" className="mr-2" />  
                <TextInput  
                  value={formData.email}  
                  onChangeText={(text) => {  
                    setFormData({...formData, email: text});  
                    validateEmail(text);  
                  }}  
                  keyboardType="email-address"  
                  className={`flex-1 text-gray-800 text-base py-1 ${!isValidEmail ? 'text-red-500' : ''}`}  
                  placeholder="Enter your email address"  
                />  
              </View>  
              {!isValidEmail && (  
                <Text className="text-red-500 text-xs mt-1">{emailError}</Text>  
              )}  
            </View>  

            {/* Location */}  
            <View className="p-4">  
              <Text className="text-sm text-gray-500 mb-1">Location</Text>  
              <View className="flex-row items-center">  
                <MapPin size={18} color="#6b7280" className="mr-2" />  
                <TextInput  
                  value={formData.location}  
                  onChangeText={(text) => setFormData({...formData, location: text})}  
                  className="flex-1 text-gray-800 text-base py-1"  
                  placeholder="Enter your location"  
                />  
              </View>  
            </View>  
          </View>  
        </View>  
      </ScrollView>  
    </SafeAreaView>  
  );  
}  