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

// Sample data - replace with actual data from API
const plan = {
  details: [
    { name: "Destination", value: "New York" },
    { name: "Duration", value: "5 Days" },
    { name: "Expenses", value: "1500 USD" },
  ],
  days: [
    {
      day: 1,
      activities: [{ time: "7:00AM-8:00PM", name: "Chinatown" }],
      plan: [
        {
          time: "8:00AM",
          event:
            "Breakfast at Eggloo, a popular spot for Hong Kong-style egg waffles.",
        },
        {
          time: "9:30AM",
          event:
            "Stroll through Chinatown’s bustling streets and visit the markets for unique souvenirs.",
        },
        {
          time: "11:00AM",
          event:
            "Stop by cultural landmarks like Columbus Park and Chatham Square.",
        },
        {
          time: "12:30PM",
          event:
            "Have lunch at Nom Wah Tea Parlor, a historic dim sum restaurant.",
        },
        {
          time: "2:00PM",
          event:
            "Visit nearby attractions like Little Italy or explore street art in the area.",
        },
        {
          time: "5:00PM",
          event:
            "Enjoy dinner at Jing Fong or another authentic restaurant in Chinatown.",
        },
        {
          time: "7:00PM",
          event:
            "End the day with bubble tea from a local shop and enjoy the vibrant nighttime atmosphere of the neighborhood.",
        },
      ],
    },
    {
      day: 2,
      activities: [{ time: "7:30AM-8:00PM", name: "Central Park" }],
      plan: [
        {
          time: "8:00AM",
          event:
            "Breakfast at Eggloo, a popular spot for Hong Kong-style egg waffles.",
        },
        {
          time: "9:30AM",
          event:
            "Stroll through Chinatown’s bustling streets and visit the markets for unique souvenirs.",
        },
        {
          time: "11:00AM",
          event:
            "Stop by cultural landmarks like Columbus Park and Chatham Square.",
        },
        {
          time: "12:30PM",
          event:
            "Have lunch at Nom Wah Tea Parlor, a historic dim sum restaurant.",
        },
        {
          time: "2:00PM",
          event:
            "Visit nearby attractions like Little Italy or explore street art in the area.",
        },
        {
          time: "5:00PM",
          event:
            "Enjoy dinner at Jing Fong or another authentic restaurant in Chinatown.",
        },
        {
          time: "7:00PM",
          event:
            "End the day with bubble tea from a local shop and enjoy the vibrant nighttime atmosphere of the neighborhood.",
        },
      ],
    },
    {
      day: 3,
      activities: [{ time: "8:00AM-8:30PM", name: "Times Square" }],
      plan: [
        {
          time: "8:00AM",
          event:
            "Breakfast at Eggloo, a popular spot for Hong Kong-style egg waffles.",
        },
        {
          time: "9:30AM",
          event:
            "Stroll through Chinatown’s bustling streets and visit the markets for unique souvenirs.",
        },
        {
          time: "11:00AM",
          event:
            "Stop by cultural landmarks like Columbus Park and Chatham Square.",
        },
        {
          time: "12:30PM",
          event:
            "Have lunch at Nom Wah Tea Parlor, a historic dim sum restaurant.",
        },
        {
          time: "2:00PM",
          event:
            "Visit nearby attractions like Little Italy or explore street art in the area.",
        },
        {
          time: "5:00PM",
          event:
            "Enjoy dinner at Jing Fong or another authentic restaurant in Chinatown.",
        },
        {
          time: "7:00PM",
          event:
            "End the day with bubble tea from a local shop and enjoy the vibrant nighttime atmosphere of the neighborhood.",
        },
      ],
    },
    {
      day: 4,
      activities: [{ time: "7:00AM-8:00PM", name: "Statue of Liberty" }],
      plan: [
        {
          time: "8:00AM",
          event:
            "Breakfast at Eggloo, a popular spot for Hong Kong-style egg waffles.",
        },
        {
          time: "9:30AM",
          event:
            "Stroll through Chinatown’s bustling streets and visit the markets for unique souvenirs.",
        },
        {
          time: "11:00AM",
          event:
            "Stop by cultural landmarks like Columbus Park and Chatham Square.",
        },
        {
          time: "12:30PM",
          event:
            "Have lunch at Nom Wah Tea Parlor, a historic dim sum restaurant.",
        },
        {
          time: "2:00PM",
          event:
            "Visit nearby attractions like Little Italy or explore street art in the area.",
        },
        {
          time: "5:00PM",
          event:
            "Enjoy dinner at Jing Fong or another authentic restaurant in Chinatown.",
        },
        {
          time: "7:00PM",
          event:
            "End the day with bubble tea from a local shop and enjoy the vibrant nighttime atmosphere of the neighborhood.",
        },
      ],
    },
    {
      day: 5,
      activities: [{ time: "7:30AM-8:00PM", name: "Museum of Modern Art" }],
      plan: [
        {
          time: "8:00AM",
          event:
            "Breakfast at Eggloo, a popular spot for Hong Kong-style egg waffles.",
        },
        {
          time: "9:30AM",
          event:
            "Stroll through Chinatown’s bustling streets and visit the markets for unique souvenirs.",
        },
        {
          time: "11:00AM",
          event:
            "Stop by cultural landmarks like Columbus Park and Chatham Square.",
        },
        {
          time: "12:30PM",
          event:
            "Have lunch at Nom Wah Tea Parlor, a historic dim sum restaurant.",
        },
        {
          time: "2:00PM",
          event:
            "Visit nearby attractions like Little Italy or explore street art in the area.",
        },
        {
          time: "5:00PM",
          event:
            "Enjoy dinner at Jing Fong or another authentic restaurant in Chinatown.",
        },
        {
          time: "7:00PM",
          event:
            "End the day with bubble tea from a local shop and enjoy the vibrant nighttime atmosphere of the neighborhood.",
        },
      ],
    },
  ],
};

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

class UserPlan extends React.Component {
  //handlers
  handleBack = () => {
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={this.handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
export default UserPlan;

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
