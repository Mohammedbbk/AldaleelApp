import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

//pictures
import visa from "../../assets/Information_pictures/Visa.png";
import health from "../../assets/Information_pictures/Health.png";
import language from "../../assets/Information_pictures/Language.png";
import local from "../../assets/Information_pictures/Local.png";
import transportation from "../../assets/Information_pictures/Transportation.png";
import currency from "../../assets/Information_pictures/Currency.png";

const titles = [
  {
    title: "Visa Requirements",
    image: visa,
  },
  {
    title: "Local Customs",
    image: local,
  },
  {
    title: "Currency Information",
    image: currency,
  },
  {
    title: "Health & Safety",
    image: health,
  },
  {
    title: "Transportation",
    image: transportation,
  },
  {
    title: "Language Basics",
    image: language,
  },
];

class InformationScreen extends React.Component {
  //handlers
  handleBack = () => {
    this.props.navigation.navigate("UserPlanScreen");
  };
  handleHome = () => {
    //TBD
  };
  handleEditPlan = () => {
    this.props.navigation.navigate("AssistantScreen");
  };
  handleNext = () => {
    this.props.navigation.navigate("InformationScreen");
  };
  handleShare = () => {};

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>Information Hub</Text>
          <View style={styles.headerButton}>
            <TouchableOpacity>
              <Ionicons
                name="chevron-back"
                size={24}
                color="#007AFF"
                onPress={this.handleBack}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="home-outline"
                size={24}
                color="#007AFF"
                onPress={this.handleHome}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerButton}>
            <TouchableOpacity>
              <Ionicons
                name="share-outline"
                size={24}
                color="#007AFF"
                onPress={this.handleShare}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="pencil-outline"
                size={24}
                color="#007AFF"
                onPress={this.handleEditPlan}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.informationWrapper}>
            {titles.map((item) => (
              <TouchableOpacity
                style={styles.informationContainer}
                activeOpacity={0.9}
              >
                <Image style={styles.informationImage} source={item.image} />
                <Text style={styles.informationTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={24} color={"#007AFF"} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={this.handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
export default InformationScreen;

// Styles
const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
    backgroundColor: "#f5f5f5",
  },
  container: {
    paddingBottom: 200,
    paddingInline: 10,
  },
  headerContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  titleContainer: {
    position: "absolute",
    right: "0",
    left: "0",
  },
  titleText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },
  headerButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexShrink: 1,
    padding: 8,
    gap: 20,
  },
  informationWrapper: {
    flexDirection: "column",
    alignItems: "strech",
    paddingTop: 20,
    gap: 20,
  },
  informationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowRadius: 6,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    elevation: 3,
  },
  informationImage: {
    borderRadius: 20,
    backgroundColor: "#555",
    height: 130,
    width: 100,
  },
  informationTitle: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: "center",
    color: "black",
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 1,
    bottom: 100,
    width: "100%",
    alignItems: "center",
  },
  nextButton: {
    height: 57,
    width: 122,
    backgroundColor: "#24BAEC",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
});
