import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

export function ActivityItem({ time, name }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [hasFetchError, setHasFetchError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function fetchImage() {
      setIsLoadingImage(true);
      setHasFetchError(false);
      setImageUrl(null);

      if (!name) {
        setIsLoadingImage(false);
        return;
      }

      try {
        const encodedName = encodeURIComponent(name);
        const apiKey = Constants.expoConfig.extra.pixabayApiKey;
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodedName}&image_type=photo`;

        const response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();

        if (!signal.aborted) {
          if (json.hits && json.hits.length > 0) {
            setImageUrl(json.hits[0].largeImageURL);
          } else {
            console.log('No images found for:', name);
            setHasFetchError(true);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !signal.aborted) {
          console.error('Error fetching image for:', name, error);
          setHasFetchError(true);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoadingImage(false);
        }
      }
    }

    fetchImage();

    return () => {
      abortController.abort();
    };
  }, [name]);

  return (
    <View className="relative">
      <View className="bg-neutral-600 w-full h-48 items-center justify-center">
        {isLoadingImage && <ActivityIndicator color="white" size="large" />}
        {!isLoadingImage && imageUrl && (
          <Image
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full"
            source={{ uri: imageUrl }}
            resizeMode="cover"
            accessibilityLabel={`Image for ${name}`}
          />
        )}
        {!isLoadingImage && (hasFetchError || !imageUrl) && (
          <Ionicons name="image-outline" size={60} color="rgba(255,255,255,0.5)" />
        )}
      </View>
      <View className="p-5 absolute bottom-0 left-0 right-0 bg-black/40">
        <Text className="text-sm text-white font-normal mb-1">{time}</Text>
        <Text className="text-lg font-medium text-white">{name}</Text>
      </View>
    </View>
  );
}

export default ActivityItem;