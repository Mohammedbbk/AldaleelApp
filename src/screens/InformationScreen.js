import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
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

  handleSubScreens = (pageNumber) => {
    switch (pageNumber) {
      case 1:
        this.props.navigation.navigate("VisaScreen");
        break;
      case 2:
        this.props.navigation.navigate("LocalScreen");
        break;
      case 3:
        this.props.navigation.navigate("CurrencyScreen");
        break;
      case 4:
        this.props.navigation.navigate("HealthScreen");
        break;
      case 5:
        this.props.navigation.navigate("TransportationScreen");
        break;
      case 6:
        this.props.navigation.navigate("LanguageScreen");
        break;

      default:
        Alert.alert("Error", "Something went wrong, try again later");
        break;
    }
  };

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
                key={item.number}
                style={styles.informationContainer}
                activeOpacity={0.9}
                onPress={() => this.handleSubScreens(item.number)}
              >
                <Image style={styles.informationImage} source={item.image} />
                <Text style={styles.informationTitle}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={24} color={"#007AFF"} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={this.handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
export default InformationScreen;

// Styles
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#f5f5f5",
    flex: 1,
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
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
    padding: 10,
    paddingHorizontal: 15,
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
    backgroundColor: "#24BAEC",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  nextButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
