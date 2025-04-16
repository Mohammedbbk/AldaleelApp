import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export function CitySearchModal({
  visible,
  onClose,
  searchQuery,
  onSearchChange,
  isLoading,
  showSearchResults,
  searchResults,
  onSelectPlace,
}) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
      accessible={true}
      accessibilityLabel={t('citySearch.modal.label')}
      accessibilityHint={t('citySearch.modal.hint')}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Modal Header */}
        <View 
          className="flex-row items-center px-4 py-2.5 border-b border-gray-200"
          accessible={true}
          accessibilityLabel="Search header"
        >
          <TouchableOpacity
            onPress={onClose}
            className="p-1 mr-2.5"
            accessible={true}
            accessibilityLabel={t('citySearch.close.label')}
            accessibilityHint={t('citySearch.close.hint')}
          >
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          {/* Search Input inside Modal Header */}
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 h-10">
            <Ionicons name="search" size={20} color="#999" className="mr-1.5" />
            <TextInput
              className="flex-1 text-base text-gray-800 h-10"
              placeholder={t('citySearch.input.placeholder')}
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={onSearchChange}
              autoFocus={true}
              returnKeyType="search"
              onBlur={() => {}}
              accessible={true}
              accessibilityLabel={t('citySearch.input.label')}
              accessibilityHint={t('citySearch.input.hint')}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={() => onSearchChange('')} 
                className="p-1"
                accessible={true}
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results Area */}
        {renderSearchResults({
          showSearchResults,
          isLoading,
          searchResults,
          searchQuery,
          onSelectPlace,
        })}
      </SafeAreaView>
    </Modal>
  );
}

function renderSearchResults({
  showSearchResults,
  isLoading,
  searchResults,
  searchQuery,
  onSelectPlace,
}) {
  if (!showSearchResults) return null;

  if (isLoading) {
    return (
      <View 
        className="flex-1 justify-center items-center p-8"
        accessible={true}
        accessibilityLabel="Loading results"
      >
        <ActivityIndicator size="large" color="#00BFFF" />
        <Text className="mt-4 text-base text-gray-500">{t('citySearch.loading')}</Text>
      </View>
    );
  }

  if (!isLoading && searchResults.length === 0 && searchQuery.length > 1) {
    return (
      <View 
        className="flex-1 justify-center items-center p-12"
        accessible={true}
        accessibilityLabel="No results found"
      >
        <MaterialIcons name="search-off" size={60} color="#CCC" />
        <Text className="mt-5 text-lg text-gray-400">{t('citySearch.noResults')}</Text>
      </View>
    );
  }

  if (!isLoading && searchResults.length === 0 && searchQuery.length <= 1) {
    return (
      <View 
        className="flex-1 justify-center items-center p-12"
        accessible={true}
        accessibilityLabel="Enter more characters"
      >
        <Ionicons name="pencil-outline" size={60} color="#CCC" />
        <Text className="mt-5 text-lg text-gray-400">{t('citySearch.minCharacters')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pt-2.5">
      <ScrollView keyboardShouldPersistTaps="handled">
        {searchResults.map((item, index) => (
          <TouchableOpacity
            key={`${item.lat}-${item.lon}-${index}`}
            className="flex-row items-center py-4 px-5 border-b border-gray-100"
            onPress={() => onSelectPlace(item)}
            accessible={true}
            accessibilityLabel={t('citySearch.result.label', {
              name: item.name,
              state: item.state,
              country: item.country
            })}
            accessibilityHint={t('citySearch.result.hint', { name: item.name })}
          >
            <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-4">
              <MaterialCommunityIcons name="map-marker-outline" size={24} color="#666" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                {item.state ? `${item.state}, ` : ''}{item.country}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}