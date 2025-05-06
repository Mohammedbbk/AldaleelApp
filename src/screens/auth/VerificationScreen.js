import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useTheme } from "../../../ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

export default function VerificationScreen({ navigation, route }) {
  const { verificationType = "email", contact = "" } = route.params || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    const timer =
      timeLeft > 0 &&
      !isResendActive &&
      setInterval(() => setTimeLeft((current) => current - 1), 1000);
    if (timeLeft === 0) setIsResendActive(true);
    return () => clearInterval(timer);
  }, [timeLeft, isResendActive]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError("");

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendCode = async () => {
    if (!isResendActive) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimeLeft(60);
      setIsResendActive(false);
      Alert.alert("Success", "Verification code has been resent.");
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    Keyboard.dismiss();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all digits");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigation.replace("Home");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#111827" : "#fff"}
      />

      <View className="px-6 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity className="p-2" onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold text-[#1b1e28] -ml-8">
            Verification
          </Text>
        </View>
      </View>

      <View className="px-6 pt-8">
        <Text className="text-2xl font-bold text-[#1b1e28] mb-3">
          Enter verification code
        </Text>
        <Text className="text-gray-500 mb-8">
          We've sent a verification code to your {verificationType}:
          <Text className="font-medium text-[#1b1e28]"> {contact}</Text>
        </Text>

        <View className="flex-row justify-between mb-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl
                ${error ? "border-2 border-red-400" : "border border-gray-200"}
                ${digit ? "bg-gray-50" : "bg-white"}`}
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>

        {error ? (
          <Text className="text-red-500 text-center mb-4">{error}</Text>
        ) : null}

        <View className="flex-row justify-center items-center mb-8">
          <Text className="text-gray-500">Didn't receive the code?</Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={!isResendActive || loading}
          >
            <Text
              className={`font-medium ${
                isResendActive ? "text-[#24baec]" : "text-gray-400"
              }`}
            >
              {isResendActive ? " Resend" : ` Wait ${timeLeft}s`}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className={`py-4 rounded-xl items-center
            ${loading ? "bg-gray-100" : "bg-[#24baec]"}`}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#24baec" />
          ) : (
            <Text className="text-white font-semibold text-lg">Verify</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}