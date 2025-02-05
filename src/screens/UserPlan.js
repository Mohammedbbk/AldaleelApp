import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TravelPlanScreen() {
  // Sample data - replace actual data
  const plan = {
    destination: "New York",
    duration: "5 Days",
    expenses: "1500 USD",
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

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View>
          <Text style={styles.title}>Your Plan</Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <DetailItem label="Destination" value={plan.destination} />
            <DetailItem label="Duration" value={plan.duration} />
          </View>
          <DetailItem label="Expenses" value={plan.expenses} />
        </View>

        {/* Itinerary Sections */}
        {plan.days.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayHeader}>Day{day.day}</Text>
            {day.activities.map((activity, idx) => (
              <ActivityItem
                key={idx}
                time={activity.time}
                name={activity.name}
                isLast={idx === day.activities.length - 1}
              />
            ))}
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

const ActivityItem = ({ time, name, isLast }) => (
  <View style={[styles.activityItem, !isLast && styles.activityBorder]}>
    <Text style={styles.activityTime}>{time}</Text>
    <Text style={styles.activityName}>{name}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
    marginHorizontal: 8,
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
  dayContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  activityItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    flex: 1, // Takes full screen height
    justifyContent: "center", // Vertical centering
    alignItems: "center", // Horizontal centering
    bottom: "50",
  },
  nextButton: {
    height: "57",
    width: "122",
    backgroundColor: "#24BAEC",
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
});
