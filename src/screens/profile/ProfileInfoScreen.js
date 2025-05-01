// screens/ProfileInfoScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../../ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Mail, Plane, Star } from "lucide-react-native";

export default function ProfileInfoScreen() {
  const navigation = useNavigation();
  const { isDarkMode, colors } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // adjust to your emulator/device
  const BASE_URL = "http://10.0.2.2:5000";

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load profile");

        setUserData(json);
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${
          isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }
  if (!userData) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Unable to load profile.</Text>
      </SafeAreaView>
    );
  }

  // Format joined date
  const joinedDate = new Date(userData.joinedAt);
  const joinedStr = joinedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <SafeAreaView
      className={`flex-1 ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } pt-5`}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />

      {/* Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          backgroundColor: isDarkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={isDarkMode ? "#fff" : "#111"} />
        </TouchableOpacity>
        <Text
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-gray-800"
          } ml-2`}
        >
          Profile Info
        </Text>
        {/* empty placeholder to balance layout */}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <View
          className={` rounded-xl overflow-hidden ${
            isDarkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Avatar + Name + Joined */}
          <View
            style={styles.header}
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Image
              source={
                userData.avatarUrl
                  ? { uri: userData.avatarUrl }
                  : require("../../../assets/onboard/beachAdventure.png")
              }
              style={styles.avatar}
            />
            <View style={styles.nameBlock}>
              <Text
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {userData.name}
              </Text>
              <Text
                className={`text-sm ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Joined {joinedStr}
              </Text>
            </View>
          </View>

          {/* Basic Information */}
          <View
            style={styles.section}
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Text
              style={styles.sectionTitle}
              className={`${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Basic Information
            </Text>
            <View style={styles.row}>
              <Mail size={18} color={isDarkMode ? "#fff" : "#111"} />
              <Text
                className={`text-base ml-2 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {userData.email}
              </Text>
            </View>
          </View>

          {/* Travel Statistics */}
          <View
            style={styles.section}
            className={`${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Text
              style={styles.sectionTitle}
              className={`${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              Travel Statistics
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Plane size={18} color={isDarkMode ? "#fff" : "#111"} />
                <Text
                  className={` text-sm ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Completed Trips
                </Text>
                <Text
                  className={` text-base ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {userData.completedTrips}
                </Text>
              </View>
              <View style={styles.stat}>
                <Star size={18} color={isDarkMode ? "#fff" : "#111"} />
                <Text
                  className={` text-sm ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  Reviews
                </Text>
                <Text
                  className={` text-base ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {userData.reviews}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#374151" },

  scroll: { padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#bfdbfe",
  },
  nameBlock: { marginLeft: 16 },
  name: { fontSize: 20, fontWeight: "bold", color: "#1f2937" },
  joined: { fontSize: 14, color: "#6b7280", marginTop: 4 },

  section: { padding: 16, borderBottomWidth: 1 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 8, fontSize: 14, color: "#374151" },

  statsRow: { flexDirection: "row", flexWrap: "wrap" },
  stat: { width: "50%", alignItems: "center", marginBottom: 16 },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  statValue: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
});
