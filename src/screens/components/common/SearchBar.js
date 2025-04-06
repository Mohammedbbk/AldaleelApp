import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ 
    value, 
    onChangeText, 
    placeholder = 'Search...', 
    onSearchPress,
    containerClassName = '',
}) => {
    return (
        <View className={`flex-row items-center bg-white rounded-full px-4 py-2 shadow ${containerClassName}`}>
            <TextInput
                className="flex-1 text-base text-gray-800 mr-2"
                placeholder={placeholder}
                placeholderTextColor="#888"
                value={value}
                onChangeText={onChangeText}
            />
            <TouchableOpacity 
                className="bg-blue-500 rounded-full p-1.5"
                onPress={onSearchPress}
            >
                <Icon name="search" size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchBar;