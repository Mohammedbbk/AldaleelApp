// screens/ThemeSettingsScreen.js  
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
  ArrowLeft,  
  Sun,  
  Moon,  
  Smartphone,  
  Check,  
  Palette,  
} from 'lucide-react-native';  

export default function ThemeSettingsScreen() {  
  const navigation = useNavigation();  
  
  // Theme States - would connect to a theme context in a real app  
  const [darkMode, setDarkMode] = useState(false);  
  const [useSystemTheme, setUseSystemTheme] = useState(true);  
  const [selectedColor, setSelectedColor] = useState('blue');  

  // Theme color options  
  const themeColors = [  
    { id: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#93c5fd' },  
    { id: 'green', name: 'Green', primary: '#10b981', secondary: '#a7f3d0' },  
    { id: 'purple', name: 'Purple', primary: '#8b5cf6', secondary: '#c4b5fd' },  
    { id: 'pink', name: 'Pink', primary: '#ec4899', secondary: '#fbcfe8' },  
    { id: 'orange', name: 'Orange', primary: '#f97316', secondary: '#fed7aa' },  
    { id: 'teal', name: 'Teal', primary: '#14b8a6', secondary: '#99f6e4' },  
  ];  

  // Toggle dark mode  
  const handleDarkModeToggle = () => {  
    if (useSystemTheme) {  
      // If system theme is enabled, disable it first  
      setUseSystemTheme(false);  
    }  
    setDarkMode(!darkMode);  
  };  

  // Toggle system theme  
  const handleSystemThemeToggle = () => {  
    setUseSystemTheme(!useSystemTheme);  
    if (!useSystemTheme) {  
      // When enabling system theme, reset manual dark mode selection  
      setDarkMode(false);  
    }  
  };  

  // Select theme color  
  const handleColorSelect = (colorId) => {  
    setSelectedColor(colorId);  
  };  

  // Save theme settings and go back  
  const saveThemeSettings = () => {  
    // In a real app, this would save to context/storage  
    // For now, just navigate back  
    navigation.goBack();  
  };  

  return (  
    <SafeAreaView className="flex-1 bg-gray-50">  
      <StatusBar barStyle="dark-content" backgroundColor="rgb(249 250 251)" />  

      {/* Top navigation bar */}  
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">  
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">  
          <ArrowLeft size={24} color="#374151" />  
        </TouchableOpacity>  
        <Text className="text-lg font-bold text-gray-800 ml-2">Theme Settings</Text>  
      </View>  

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>  
        <View className="p-6 pb-8">  
          
          {/* Theme Mode Section */}  
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">  
            <View className="p-4 border-b border-gray-100 flex-row items-center justify-between">  
              <View className="flex-row items-center">  
                <Smartphone size={20} color="#6b7280" />  
                <Text className="text-base font-medium text-gray-800 ml-3">Use System Theme</Text>  
              </View>  
              <Switch  
                value={useSystemTheme}  
                onValueChange={handleSystemThemeToggle}  
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}  
                thumbColor={useSystemTheme ? '#3b82f6' : '#f4f4f5'}  
                ios_backgroundColor="#d1d5db"  
              />  
            </View>  
            
            <View className="p-4 border-b border-gray-100 flex-row items-center justify-between">  
              <View className="flex-row items-center">  
                <Sun size={20} color="#6b7280" />  
                <Text className="text-base font-medium text-gray-800 ml-3">Light Mode</Text>  
              </View>  
              <View>  
                {!darkMode && !useSystemTheme && (  
                  <View className="p-1 bg-blue-500 rounded-full">  
                    <Check size={16} color="#FFFFFF" />  
                  </View>  
                )}  
                {useSystemTheme && (  
                  <Text className="text-xs text-gray-400">System Controlled</Text>  
                )}  
              </View>  
            </View>  
            
            <View className="p-4 flex-row items-center justify-between">  
              <View className="flex-row items-center">  
                <Moon size={20} color="#6b7280" />  
                <Text className="text-base font-medium text-gray-800 ml-3">Dark Mode</Text>  
              </View>  
              <View>  
                {darkMode && !useSystemTheme && (  
                  <View className="p-1 bg-blue-500 rounded-full">  
                    <Check size={16} color="#FFFFFF" />  
                  </View>  
                )}  
                {!darkMode && !useSystemTheme && (  
                  <TouchableOpacity   
                    onPress={handleDarkModeToggle}  
                    className="px-3 py-1 bg-gray-100 rounded-full"  
                  >  
                    <Text className="text-xs text-gray-500">Enable</Text>  
                  </TouchableOpacity>  
                )}  
                {useSystemTheme && (  
                  <Text className="text-xs text-gray-400">System Controlled</Text>  
                )}  
              </View>  
            </View>  
          </View>  
          
          {/* Theme Color Section */}  
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">  
            <View className="p-4 border-b border-gray-100">  
              <View className="flex-row items-center">  
                <Palette size={20} color="#6b7280" />  
                <Text className="text-base font-medium text-gray-800 ml-3">App Color Theme</Text>  
              </View>  
              <Text className="text-xs text-gray-500 mt-1 ml-8">  
                Select a primary color for the app interface  
              </Text>  
            </View>  
            
            <View className="p-4">  
              <View className="flex-row flex-wrap justify-between">  
                {themeColors.map((color) => (  
                  <TouchableOpacity  
                    key={color.id}  
                    onPress={() => handleColorSelect(color.id)}  
                    className="mb-4 items-center"  
                    style={{ width: '33%' }}  
                  >  
                    <View className="relative">  
                      <View   
                        className="w-16 h-16 rounded-full mb-2"  
                        style={{ backgroundColor: color.primary }}  
                      />  
                      {selectedColor === color.id && (  
                        <View className="absolute bottom-2 right-0 bg-white p-1 rounded-full border-2" style={{ borderColor: color.primary }}>  
                          <Check size={16} color={color.primary} />  
                        </View>  
                      )}  
                    </View>  
                    <Text className="text-sm text-gray-700">{color.name}</Text>  
                  </TouchableOpacity>  
                ))}  
              </View>  
            </View>  
          </View>  

          {/* Save button */}  
          <TouchableOpacity  
            onPress={saveThemeSettings}  
            className="mt-6 p-4 bg-blue-500 rounded-xl"  
          >  
            <Text className="text-white font-semibold text-base text-center">  
              Save Theme Settings  
            </Text>  
          </TouchableOpacity>  

        </View>  
      </ScrollView>  
    </SafeAreaView>  
  );  
}  