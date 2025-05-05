import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to extract user ID from JWT token
const extractUserIdFromToken = (token) => {
  if (!token) return null;

  try {
    // If it's a guest token, return as is
    if (token.startsWith("guest-")) return token;

    // If it's a JWT token, decode and extract the user ID
    const parts = token.split(".");
    if (parts.length !== 3) return null; // Not a valid JWT

    // Base64 decode the payload
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.sub || null;
  } catch (error) {
    console.error("Error extracting user ID from token:", error);
    return null;
  }
};

// Base64 decoding for React Native environment
const atob = (input = "") => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let str = input.replace(/=+$/, "");
  let output = "";

  if (str.length % 4 === 1) {
    throw new Error(
      "'atob' failed: The string to be decoded is not correctly encoded."
    );
  }

  for (
    let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return output;
};

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserTokenState] = useState(null);
  const [userId, setUserIdState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to check if the current user is a guest
  const isGuest = () => {
    return userToken && userToken.startsWith("guest-");
  };

  // Load token from AsyncStorage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setUserTokenState(token);

          // Extract and set user ID from the token
          const id = extractUserIdFromToken(token);
          setUserIdState(id);

          console.log("Loaded token from AsyncStorage:", token);
          console.log("Extracted user ID:", id);
        } else {
          console.log("No token found.");
        }
      } catch (e) {
        console.error("Error loading token:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Save or remove token
  const setUserToken = async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem("userToken", token);
        console.log("Token saved to AsyncStorage:", token);

        // Extract and set user ID from the token
        const id = extractUserIdFromToken(token);
        setUserIdState(id);
        console.log("Extracted user ID:", id);
      } else {
        await AsyncStorage.removeItem("userToken");
        setUserIdState(null);
        console.log("Token removed from AsyncStorage.");
      }
      setUserTokenState(token);
    } catch (e) {
      console.error("Error saving/removing token:", e);
    }
  };

  // Logout
  const logout = async () => {
    await setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ userToken, userId, setUserToken, logout, isLoading, isGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
