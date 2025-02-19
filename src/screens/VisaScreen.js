import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollViewBase,
  ScrollView,
} from "react-native";

//mock data
const content = {
  text: "A visa is required to enter the United States. You need to apply for a B1/B2 visa through the US Embassy.Your passport must be valid for at least six months beyond the date of travel.Not applicable, as this is outside the Schengen zone.Suggested documents include proof of employment, a bank statement for the last six months, a preliminary flight booking, and comprehensive travel insuranceYour passport must be valid for at least six months beyond the date of travel.Not applicable, as this is outside the Schengen zone.Suggested documents include proof of employment, a bank statement for the last six months, a preliminary flight booking, and comprehensive travel insuranceYour passport must be valid for at least six months beyond the date of travel.Not applicable, as this is outside the Schengen zonenSuggested documents include proof of employment, a bank statement for the last six months, a preliminary flight booking, and comprehensive travel insuranceYour passport must be valid for at least six months beyond the date of travel.Not applicable, as this is outside the Schengen zone.Suggested documents include proof of employment, a bank statement for the last six months, a preliminary flight booking, and comprehensive travel insuranceYour passport must be valid for at least six months beyond the date of travel.Not applicable, as this is outside the Schengen zone.Suggested documents include proof of employment, a bank statement for the last six months, a preliminary flight booking, and comprehensive travel insurance",
};

class VisaScreen extends React.Component {
  handleClose = () => {
    this.props.navigation.navigate("InformationScreen");
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Title */}
          <Text style={styles.title}>VISA REQUIREMENTS</Text>

          {/* Image */}
          <Image
            source={require("../../assets/Information_pictures/Visa.png")}
            style={styles.image}
            resizeMode="contain"
          />

          {/* Requirements content */}
          <View style={styles.contentContainer}>
            <Text style={styles.requirementText}>
              {content.text.replace(/\./g, ".\n\n")}
            </Text>
          </View>
        </ScrollView>

        {/* Export Button */}
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.9}
          onPress={() => this.handleClose}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: "600",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  signalIcon: {
    width: 17,
    height: 11,
    backgroundColor: "#000",
    marginRight: 5,
  },
  wifiIcon: {
    width: 15,
    height: 11,
    backgroundColor: "#000",
    marginRight: 5,
  },
  batteryIcon: {
    width: 24,
    height: 11,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    marginVertical: 30,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 150,
  },
  requirementText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#00A6FF",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default VisaScreen;
