import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

class InformationScreen extends React.Component {
  //handlers
  handleBack = () => {
    this.props.navigation.navigate("UserPlanScreen");
  };
  handleHome = () => {
    this.props.navigation.navigate("MainScreen");
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
      <SafeAreaView>
        {/* Header Section */}

        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>Your Plan</Text>
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
      </SafeAreaView>
    );
  }
}

export default InformationScreen;

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
  icon: {
    width: 44,
    height: 44,
  },
  overallReview: {
    flexDirection: "row",
    justifyContent: "center",
    shadowRadius: 6,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    elevation: 3,
    backgroundColor: "white",
    padding: 10,
    marginBlock: 10,
    borderRadius: 10,
  },
  detailCol: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailColSeperator: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailItem: {
    flexDirection: "row",
    padding: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itineraryWrapper: {
    flexDirection: "column",
    alignItems: "strech",
  },
  dayHeader: {
    fontSize: 13,
    fontWeight: "400",
    color: "#333",
    marginBottom: 5,
  },
  dayContainer: {
    padding: 0,
    position: "relative",
    backgroundColor: "#00ADEF",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
    marginBottom: 20,
    shadowRadius: 6,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    elevation: 3,
  },
  activityImage: {
    backgroundColor: "#555",
    width: "100%",
    height: 200,
  },
  activityItem: {},
  activityDetails: {
    padding: 20,
  },
  activityTime: {
    fontSize: 14,
    color: "white",
    fontWeight: 400,
    marginBottom: 4,
  },
  activityName: {
    fontSize: 18,
    fontWeight: 500,
    color: "white",
  },
  accordianContent: {
    borderColor: "#3333",
    backgroundColor: "white",
  },
  planItem: {
    flexDirection: "row",
    gap: 5,
    justifyContent: "space-between",
    padding: 10,
  },
  planTime: {
    color: "#666",
    width: 70,
    borderRightWidth: 1,
    borderColor: "#666",
  },
  planEvent: {
    flex: 2,
    flexWrap: 1,
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
