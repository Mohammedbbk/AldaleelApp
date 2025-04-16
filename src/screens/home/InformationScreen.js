import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

//pictures
import visa from "../../../assets/Information_pictures/Visa.png";
import health from "../../../assets/Information_pictures/Health.png";
import language from "../../../assets/Information_pictures/Language.png";
import local from "../../../assets/Information_pictures/Local.png";
import transportation from "../../../assets/Information_pictures/Transportation.png";
import currency from "../../../assets/Information_pictures/Currency.png";

const titles = [
  {
    number: 1,
    title: "Visa Requirements",
    image: visa,
  },
  {
    number: 2,
    title: "Local Customs",
    image: local,
  },
  {
    number: 3,
    title: "Currency Information",
    image: currency,
  },
  {
    number: 4,
    title: "Health & Safety",
    image: health,
  },
  {
    number: 5,
    title: "Transportation",
    image: transportation,
  },
  {
    number: 6,
    title: "Language Basics",
    image: language,
  },
];

const InformationScreen = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.navigate("UserPlanScreen");
  };

  const handleHome = () => {
    //TBD
  };

  const handleEditPlan = () => {
    navigation.navigate("AssistantScreen");
  };

  const handleShare = () => {
    // Implementation pending
  };

  const handleSubScreens = (pageNumber) => {
    switch (pageNumber) {
      case 1:
        navigation.navigate("VisaScreen");
        break;
      case 2:
        navigation.navigate("LocalScreen");
        break;
      case 3:
        navigation.navigate("CurrencyScreen");
        break;
      case 4:
        navigation.navigate("HealthScreen");
        break;
      case 5:
        navigation.navigate("TransportationScreen");
        break;
      case 6:
        navigation.navigate("LanguageScreen");
        break;
      default:
        Alert.alert("Error", "Something went wrong, try again later");
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      {/* Header Section */}
      <View className="flex-row items-center justify-between py-2.5 bg-white border-b border-[#E5E5EA]">
        <Text className="text-[17px] font-semibold text-black text-center absolute left-0 right-0">
          Information Hub
        </Text>
        <View className="flex-row justify-end p-2.5 px-[15px] gap-5">
          <TouchableOpacity>
            <Ionicons
              name="chevron-back"
              size={24}
              color="#007AFF"
              onPress={handleBack}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="home-outline"
              size={24}
              color="#007AFF"
              onPress={handleHome}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-end p-2.5 px-[15px] gap-5">
          <TouchableOpacity>
            <Ionicons
              name="share-outline"
              size={24}
              color="#007AFF"
              onPress={handleShare}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="pencil-outline"
              size={24}
              color="#007AFF"
              onPress={handleEditPlan}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="pb-[200px] px-2.5"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col items-stretch pt-5 gap-5">
          {titles.map((item) => (
            <TouchableOpacity
              key={item.number}
              className="flex-row justify-between items-center p-[5px] bg-white rounded-[20px] overflow-hidden shadow-md"
              activeOpacity={0.9}
              onPress={() => handleSubScreens(item.number)}
            >
              <Image
                className="rounded-[20px] bg-[#555] h-[130px] w-[100px]"
                source={item.image}
              />
              <Text className="text-[18px] font-normal text-center text-black flex-1 p-2.5">
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={24} color={"#007AFF"} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* Next Button */}
      <TouchableOpacity
        className="bg-[#24BAEC] mx-5 p-[15px] rounded-lg absolute bottom-[30px] left-0 right-0"
        onPress={() => navigation.navigate("InformationScreen")}
      >
        <Text className="text-white text-center text-base font-semibold">
          Next
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InformationScreen;
