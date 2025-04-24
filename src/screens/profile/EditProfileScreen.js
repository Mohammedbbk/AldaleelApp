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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Check,
  Camera,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [emailError, setEmailError] = useState('');

  const BASE_URL = 'http://localhost:5000'; // Backend port

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) return Alert.alert('Error', 'No token found');

        setToken(storedToken);

        const res = await fetch(`${BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');

        setFormData({
          name: data.name || '',
          email: data.email || '',
          avatarUrl: data.avatarUrl || '',
        });
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setIsValidEmail(isValid);
    setEmailError(isValid ? '' : 'Please enter a valid email address');
    return isValid;
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return Alert.alert('Permission required', 'Allow photo library access');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData({ ...formData, avatarUrl: uri });
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      return Alert.alert('Permission required', 'Allow camera access');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData({ ...formData, avatarUrl: uri });
    }
  };

  const saveChanges = async () => {
    if (!validateEmail(formData.email)) return;

    try {
      const res = await fetch(`${BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Failed to update profile');

      Alert.alert('Success', 'Profile updated');
      navigation.navigate('Profile');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="rgb(249 250 251)" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">Edit Profile</Text>
        <TouchableOpacity onPress={saveChanges} className="p-2 bg-blue-500 rounded-full">
          <Check size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 pb-8">
          {/* Profile Image */}
          <View className="items-center mb-8">
            <View className="relative">
              <Image
                source={formData.avatarUrl ? { uri: formData.avatarUrl } : require('../../../assets/onboard/beachAdventure.png')}
                className="w-28 h-28 rounded-full border-4 border-blue-100"
              />
              <View className="absolute bottom-0 right-0 flex-row">
                <TouchableOpacity onPress={pickImage} className="bg-blue-500 p-2 rounded-full mr-2">
                  <Camera size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePhoto} className="bg-green-500 p-2 rounded-full">
                  <Camera size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
            <Text className="text-gray-500 mt-2 text-sm">Tap camera icon to change photo</Text>
          </View>

          {/* Info Form */}
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            {/* Name */}
            <View className="p-4 border-b border-gray-100">
              <Text className="text-sm text-gray-500 mb-1">Name</Text>
              <View className="flex-row items-center">
                <User size={18} color="#6b7280" className="mr-2" />
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  className="flex-1 text-gray-800 text-base py-1"
                  placeholder="Enter your full name"
                />
              </View>
            </View>

            {/* Email */}
            <View className="p-4">
              <Text className="text-sm text-gray-500 mb-1">Email</Text>
              <View className="flex-row items-center">
                <Mail size={18} color="#6b7280" className="mr-2" />
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    validateEmail(text);
                  }}
                  keyboardType="email-address"
                  className={`flex-1 text-gray-800 text-base py-1 ${!isValidEmail ? 'text-red-500' : ''}`}
                  placeholder="Enter your email address"
                />
              </View>
              {!isValidEmail && <Text className="text-red-500 text-xs mt-1">{emailError}</Text>}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
