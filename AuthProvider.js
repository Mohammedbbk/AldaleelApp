// handling token
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserTokenState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from AsyncStorage on app start
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setUserTokenState(token);
          console.log("Loaded token:", token);
        } else {
          console.log("No token found in AsyncStorage.");
        }
      } catch (e) {
        console.error("Error loading token", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Save token to state & AsyncStorage
  const setUserToken = async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem("userToken", token);
        console.log("Token saved:", token);
      } else {
        await AsyncStorage.removeItem("userToken");
        console.log("Token removed from AsyncStorage.");
      }
      setUserTokenState(token);
    } catch (e) {
      console.error("Error saving token:", e);
    }
  };

  // Logout function
  const logout = async () => {
    await setUserToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ userToken, setUserToken, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
