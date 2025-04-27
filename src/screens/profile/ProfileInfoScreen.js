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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, Mail, Plane, Star } from "lucide-react-native";

export default function ProfileInfoScreen() {
  const navigation = useNavigation();
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
      <SafeAreaView style={styles.center}>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile Info</Text>
        {/* empty placeholder to balance layout */}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          {/* Avatar + Name + Joined */}
          <View style={styles.header}>
            <Image
              source={
                userData.avatarUrl
                  ? { uri: userData.avatarUrl }
                  : require("../../../assets/onboard/beachAdventure.png")
              }
              style={styles.avatar}
            />
            <View style={styles.nameBlock}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.joined}>Joined {joinedStr}</Text>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.row}>
              <Mail size={18} color="#6b7280" />
              <Text style={styles.infoText}>{userData.email}</Text>
            </View>
          </View>

          {/* Travel Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Plane size={18} color="#3b82f6" />
                <Text style={styles.statLabel}>Completed Trips</Text>
                <Text style={styles.statValue}>{userData.completedTrips}</Text>
              </View>
              <View style={styles.stat}>
                <Star size={18} color="#3b82f6" />
                <Text style={styles.statLabel}>Reviews</Text>
                <Text style={styles.statValue}>{userData.reviews}</Text>
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
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#374151" },

  scroll: { padding: 16 },
  card: { backgroundColor: "#fff", borderRadius: 12, overflow: "hidden" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
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

  section: { padding: 16, borderBottomWidth: 1, borderColor: "#e5e7eb" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },
  row: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 8, fontSize: 14, color: "#374151" },

  statsRow: { flexDirection: "row", flexWrap: "wrap" },
  stat: { width: "50%", alignItems: "center", marginBottom: 16 },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  statValue: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
});
