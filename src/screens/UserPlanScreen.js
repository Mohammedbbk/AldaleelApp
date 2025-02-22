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
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { AI_RESPONSE } from "./config/AiResponse";

// Sample data - replace with actual data from API
const plan = AI_RESPONSE.UserPlan;

const emojis = [
  { name: "Destination", emoji: "✈️" },
  { name: "Duration", emoji: "⏳" },
  { name: "Expenses", emoji: "💵" },
];

// Reusable Components
const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const ActivityItem = ({ time, name }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const encodedName = encodeURIComponent(name);
        const url = `https://pixabay.com/api/?key=48791338-871e8e68f968c04f8f6fb8343&q=${encodedName}&image_type=photo`;

        const response = await fetch(url);
        const json = await response.json();

        if (json.hits && json.hits.length > 0) {
          setImageUrl(json.hits[0].largeImageURL);
        } else {
          console.log("No images found for:", name);
        }
      } catch (error) {
        console.error("Error fetching image for:", name, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [name]);

  return (
    <View style={styles.activityItem}>
      {isLoading ? (
        <ActivityIndicator style={styles.activityImage} />
      ) : (
        imageUrl && (
          <Image
            style={styles.activityImage}
            source={{ uri: imageUrl }}
            resizeMode="cover"
          />
        )
      )}

      <View style={styles.activityDetails}>
        <Text style={styles.activityTime}>{time}</Text>
        <Text style={styles.activityName}>{name}</Text>
      </View>
    </View>
  );
};

const Accordion = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // Measure content height once on initial render
  const measureContent = (event) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const toggleAccordion = () => {
    if (!contentHeight) return;

    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : contentHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setExpanded(!expanded);
    });
  };

  return (
    <View>
      {/* Measurement view (hidden off-screen) */}
      <View
        style={[
          {
            position: "absolute",
            left: -500,
          },
          styles.accordianContent,
        ]}
        onLayout={measureContent}
      >
        <View style={styles.content}>{children}</View>
      </View>

      {/* Clickable header */}
      <TouchableOpacity onPress={toggleAccordion} activeOpacity={0.9}>
        {title}
        {/* Animated content */}
        <Animated.View
          style={{
            height: animatedHeight,
            overflow: "hidden",
            style: styles.accordianContent,
          }}
        >
          <View style={styles.accordianContent}>{children}</View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

class UserPlanScreen extends React.Component {
  //handlers
  handleBack = () => {
    //TBD
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
  handleShare = async () => {
    const htmlContent = this.generatePdfContent();
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
  };
  generatePdfContent = () => {
    // Extract plan details
    const destination = plan.details.find(
      (d) => d.name === "Destination"
    ).value;
    const duration = plan.details.find((d) => d.name === "Duration").value;
    const expenses = plan.details.find((d) => d.name === "Expenses").value;

    const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Your Travel Plan</title>
      <style>
        /* Import Roboto from Google Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        body {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
        }
        .container {
          margin: 40px auto;
          max-width: 800px;
          background: #ffffff;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #00adef;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          color: #007aff;
        }
        .header p {
          margin: 5px 0 0;
          font-size: 18px;
          color: #555;
        }
        .details {
          display: flex;
          justify-content: space-around;
          margin-bottom: 30px;
          border-bottom: 1px solid #e5e5ea;
          padding-bottom: 20px;
        }
        .detail {
          text-align: center;
        }
        .detail h3 {
          margin: 0;
          font-size: 16px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail p {
          margin: 5px 0 0;
          font-size: 20px;
          font-weight: 500;
          color: #333;
        }
        .day-section {
          margin-bottom: 40px;
        }
        .day-section h2 {
          font-size: 24px;
          color: #333;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px dashed #00adef;
        }
        .plan-item {
          margin-bottom: 15px;
          padding: 15px;
          background: #f9f9f9;
          border-left: 5px solid #00adef;
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        .plan-item:hover {
          background: #f1faff;
        }
        .plan-item span.time {
          font-weight: 700;
          color: #007aff;
          margin-right: 15px;
          display: inline-block;
          width: 90px;
        }
        .plan-item span.event {
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Travel Plan</h1>
          <p>Embark on a journey to ${destination}</p>
        </div>
        <div class="details">
          <div class="detail">
            <h3>Destination</h3>
            <p>${destination}</p>
          </div>
          <div class="detail">
            <h3>Duration</h3>
            <p>${duration}</p>
          </div>
          <div class="detail">
            <h3>Expenses</h3>
            <p>${expenses}</p>
          </div>
        </div>
        ${plan.days
          .map(
            (day) => `
          <div class="day-section">
            <h2>Day ${day.day}: ${day.activities[0].name}</h2>
            ${day.plan
              .map(
                (item) => `
              <div class="plan-item">
                <span class="time">${item.time}</span>
                <span class="event">${item.event}</span>
              </div>
            `
              )
              .join("")}
          </div>
        `
          )
          .join("")}
      </div>
    </body>
  </html>
  `;

    return htmlContent;
  };

  render() {
    return (
      <SafeAreaView style={styles.wrapper}>
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

        {/* Body */}
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Plan Details Section */}
          <View style={styles.overallReview}>
            <View style={styles.detailCol}>
              {plan.details.map((detail, index) => (
                <DetailItem key={index} label={detail.name} value={null} />
              ))}
            </View>
            <View style={styles.detailColSeperator}>
              {plan.details.map((detail, index) => (
                <View key={index} style={styles.detailItem}>
                  <Text style={styles.detailValue}>
                    {emojis.find((emoji) => emoji.name === detail.name)?.emoji}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.detailCol}>
              {plan.details.map((detail, index) => (
                <DetailItem key={index} label={null} value={detail.value} />
              ))}
            </View>
          </View>

          {/* Itinerary Section */}
          {plan.days.map((day, index) => (
            <View key={index} style={styles.itineraryWrapper}>
              <Text style={styles.dayHeader}>Day {day.day}</Text>
              <View style={styles.dayContainer}>
                {day.activities.map((activity, idx) => (
                  <Accordion
                    key={idx}
                    title={
                      <ActivityItem time={activity.time} name={activity.name} />
                    }
                  >
                    {day.plan.map((item, i) => (
                      <View key={i} style={styles.planItem}>
                        <Text style={styles.planTime}>{item.time}</Text>
                        <Text style={styles.planEvent}>{item.event}</Text>
                      </View>
                    ))}
                  </Accordion>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={this.handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
export default UserPlanScreen;

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
    padding: 10,
    paddingHorizontal: 15,
    gap: 20,
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
