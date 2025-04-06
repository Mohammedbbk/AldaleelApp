import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Pencil, Share2, Trash2 } from 'lucide-react-native';

const TripCard = ({ item, onViewPress, onEditPress, onSharePress, onDeletePress }) => {
  return (
    <View className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold text-gray-900">{item.destination}</Text>
          <Text className="text-sm text-blue-500">{item.status}</Text>
        </View>
        
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-gray-600">{item.duration}</Text>
          <Text className="text-gray-600">{item.startDate} - {item.endDate}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <TouchableOpacity 
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={onViewPress}
          >
            <Text className="text-white font-medium">VIEW</Text>
          </TouchableOpacity>

          <View className="flex-row gap-4">
            <TouchableOpacity onPress={onEditPress}>
              <Pencil size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSharePress}>
              <Share2 size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDeletePress}>
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TripCard;