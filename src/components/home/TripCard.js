import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Pencil, Share2, Trash2, Calendar, Clock } from 'lucide-react-native';

const TripCard = ({ item, onViewPress, onEditPress, onSharePress, onDeletePress }) => {
  return (
    <View className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
      {item.thumbnail && (
        <Image
          source={item.thumbnail}
          className="w-full h-32 object-cover"
          resizeMode="cover"
        />
      )}
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-semibold text-gray-900">{item.destination}</Text>
          <View className={`px-2 py-1 rounded-full ${item.status === 'upcoming' ? 'bg-green-100' : item.status === 'planning' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Text className={`text-xs font-medium ${item.status === 'upcoming' ? 'text-green-700' : item.status === 'planning' ? 'text-blue-700' : 'text-gray-700'}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center mb-3">
          <Clock size={16} className="text-gray-500 mr-2" />
          <Text className="text-sm text-gray-600 mr-4">{item.duration}</Text>
          <Calendar size={16} className="text-gray-500 mr-2" />
          <Text className="text-sm text-gray-600">{item.startDate} - {item.endDate}</Text>
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