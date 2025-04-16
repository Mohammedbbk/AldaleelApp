import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AI_RESPONSE } from "../../config/AiResponse";

const InfoBaseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { contentKey } = route.params;
  const content = AI_RESPONSE.Information[contentKey];

  const handleClose = () => {
    navigation.navigate("InformationScreen");
  };

  return (
    <SafeAreaView className="flex-1 bg-white mt-[StatusBar.currentHeight]">
      <ScrollView>
        {/* Title */}
        <Text className="text-lg font-bold text-center mt-5 mb-5">
          {content.title}
        </Text>

        {/* Image */}
        <Image
          source={content.image}
          className="w-full h-[200px] my-[30px]"
          resizeMode="contain"
        />

        {/* Requirements content */}
        <View className="p-5 pb-[150px]">
          <Text className="text-sm leading-5 text-[#333]">
            {content.text.replace(/\./g, ".\n\n")}
          </Text>
        </View>
      </ScrollView>

      {/* Close Button */}
      <TouchableOpacity
        className="bg-[#24BAEC] mx-5 p-[15px] rounded-lg absolute bottom-[30px] left-0 right-0"
        activeOpacity={0.9}
        onPress={handleClose}
      >
        <Text className="text-white text-center text-base font-semibold">
          Close
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InfoBaseScreen;
