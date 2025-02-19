import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

import { SCREENS_CONTENT } from "./config/infoScreensContent";

class InfoBaseScreen extends React.Component {
  handleClose = () => {
    this.props.navigation.navigate("InformationScreen");
  };

  render() {
    const { contentKey } = this.props.route.params;
    const content = SCREENS_CONTENT[contentKey];
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Title */}
          <Text style={styles.title}>{content.title}</Text>

          {/* Image */}
          <Image
            source={content.image}
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

        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.9}
          onPress={() => this.handleClose()}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
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
    backgroundColor: "#24BAEC",
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

export default InfoBaseScreen;
