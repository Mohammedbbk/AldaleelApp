// src/screens/profile/EditProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, User, Check, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({ name: "", avatarUrl: "" });
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const BASE = "http://10.0.2.2:5000/api/users";

  // fetch profile on mount
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem("userToken");
        if (!t) throw new Error("No token found");
        setToken(t);

        const res = await fetch(`${BASE}/profile`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Fetch failed");

        const payload = {
          name: data.name,
          avatarUrl: data.avatarUrl || "",
        };
        setForm(payload);
        setInitial(payload);
      } catch (err) {
        Alert.alert("Error", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // photo pickers
  const pickImage = async () => {
    let { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return Alert.alert("Permission required");
    let { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!canceled) setForm({ ...form, avatarUrl: assets[0].uri });
  };
  const takePhoto = async () => {
    let { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) return Alert.alert("Permission required");
    let { assets, canceled } = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!canceled) setForm({ ...form, avatarUrl: assets[0].uri });
  };

  // detect if anything changed
  const changed =
    initial &&
    (form.name !== initial.name || form.avatarUrl !== initial.avatarUrl);

  const saveChanges = async () => {
    if (!form.name.trim()) return Alert.alert("Name cannot be empty");
    try {
      const res = await fetch(`${BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      Alert.alert("Saved!", "Your profile has been updated.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 12,
          backgroundColor: "#fff",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#374151" }}>
          Edit Profile
        </Text>
        <TouchableOpacity
          onPress={saveChanges}
          disabled={!changed}
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: changed ? "#3B82F6" : "#d1d5db",
          }}
        >
          <Check size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Avatar */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Image
            source={
              form.avatarUrl
                ? { uri: form.avatarUrl }
                : require("../../../assets/onboard/beachAdventure.png")
            }
            style={{
              width: 112,
              height: 112,
              borderRadius: 56,
              borderWidth: 2,
              borderColor: "#bfdbfe",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={{
                backgroundColor: "#3B82F6",
                padding: 8,
                borderRadius: 20,
                marginRight: 8,
              }}
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePhoto}
              style={{
                backgroundColor: "#10b981",
                padding: 8,
                borderRadius: 20,
              }}
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name input */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 6 }}>
            Name
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <User size={20} color="#6b7280" style={{ marginRight: 8 }} />
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: "#111",
                paddingVertical: 4,
              }}
              value={form.name}
              onChangeText={(name) => setForm({ ...form, name })}
              placeholder="Your Name"
            />
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={saveChanges}
          disabled={!changed}
          style={{
            backgroundColor: changed ? "#3B82F6" : "#d1d5db",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
