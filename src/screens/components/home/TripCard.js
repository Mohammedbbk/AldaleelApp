import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TripCard = ({ 
    item, 
    onViewPress, 
    onEditPress, 
    onSharePress, 
    onDeletePress 
}) => {
    return (
        <View className="flex-row bg-white rounded-lg p-2.5 mb-4 shadow-md mx-1">
            <Image
                source={{ uri: item.imageUrl }}
                className="w-[70px] h-[70px] rounded-md mr-4"
            />
            <View className="flex-1 justify-center">
                <Text className="text-base font-bold text-gray-800">{item.title}</Text>
                <Text className="text-sm text-gray-600 my-0.5">{item.price}</Text>
                <Text className="text-xs text-gray-500">{item.dates}</Text>
            </View>
            <View className="justify-between items-end">
                <TouchableOpacity 
                    className="bg-blue-500 px-4 py-2 rounded"
                    onPress={onViewPress}
                >
                    <Text className="text-white font-bold text-xs">VIEW</Text>
                </TouchableOpacity>
                <View className="flex-row mt-2">
                    <TouchableOpacity onPress={onEditPress}>
                        <MaterialIcons name="edit" size={20} color="#888" className="ml-2" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSharePress}>
                        <Icon name="share-social-outline" size={20} color="#888" className="ml-2" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDeletePress}>
                        <MaterialIcons name="delete" size={20} color="#f56c6c" className="ml-2" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default TripCard;