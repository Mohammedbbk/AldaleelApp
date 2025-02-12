import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserPlan() {
  // Sample data - replace actual data from AI
  const plan = {
    details: [
      { name: "Destination", value: "New York" },
      { name: "Duration", value: "5 Days" },
      { name: "Expenses", value: "1500 USD" },
    ],

    days: [
      {
        day: 1,
        activities: [{ time: "7:00AM-8:00PM", name: "Statue of Liberty" }],
      },
      {
        day: 2,
        activities: [{ time: "7:30AM-8:00PM", name: "Central Park" }],
      },
      {
        day: 3,
        activities: [{ time: "8:00AM-8:30PM", name: "Times Square" }],
      },
      {
        day: 4,
        activities: [{ time: "7:00AM-8:00PM", name: "Statue of Liberty" }],
      },
      {
        day: 5,
        activities: [{ time: "7:30AM-8:00PM", name: "Central Park" }],
      },
      {
        day: 6,
        activities: [{ time: "8:00AM-8:30PM", name: "Times Square" }],
      },
    ],
  };

  const emojis = [
    { name: "Destination", emoji: "✈️" },
    { name: "Duration", emoji: "⏳" },
    { name: "Expenses", emoji: "💵" },
  ];

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Encode the activity name for the URL
        const encodedName = encodeURIComponent(plan.days[0].activities[0].name);
        const url = `https://pixabay.com/api/?key=48791338-871e8e68f968c04f8f6fb8343&q=${encodedName}&image_type=photo`;

        const response = await fetch(url);
        const json = await response.json();

        if (json.hits && json.hits.length > 0) {
          setData(json.hits);
        } else {
          console.log("No images found for:", plan.days[0].activities[0].name);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Your Plan</Text>
        </View>
        <View style={styles.iconsContainer}>
          <Image
            source={require("../../assets/Icons/Share.png")}
            style={styles.icon}
          />
          <Image
            source={require("../../assets/Icons/Edit.png")}
            style={styles.icon}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Overall Review Card */}
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

        {/* Itinerary Sections */}
        {plan.days.map((day, index) => (
          <View key={index} style={styles.itineraryWrapper}>
            <Text style={styles.dayHeader}>Day {day.day}</Text>
            <View style={styles.dayContainer}>
              {day.activities.map((activity, idx) => (
                <ActivityItem
                  key={idx}
                  time={activity.time}
                  name={activity.name}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  }, [name]); // Dependency on name ensures fetch happens when name changes

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
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  titleContainer: {
    position: "absolute",
    right: "0",
    left: "0",
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  iconsContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    right: 10,
    gap: 10,
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
  dayContainer: {
    padding: 0,
    backgroundColor: "white",
    borderRadius: 10,
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
  dayHeader: {
    fontSize: 13,
    fontWeight: "400",
    color: "#333",
    marginBottom: 5,
  },
  activityItem: {},
  activityDetails: {
    padding: 20,
  },
  activityTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  activityName: {
    fontSize: 16,
    color: "#333",
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
