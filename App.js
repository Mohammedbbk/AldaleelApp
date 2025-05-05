// App.js
import React from "react";
import "./src/config/i18n";
import { ActivityIndicator, View } from "react-native";
import { I18nManager } from "react-native";
import { useTranslation } from "react-i18next";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./global.css";

// Import screens - Onboarding
import SplashScreen from "./src/screens/onboarding/SplashScreen";
import OnboardScreen from "./src/screens/onboarding/OnboardScreen";

// Import screens - Authentication
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignUpScreen from "./src/screens/auth/SignUpScreen";
import VerificationScreen from "./src/screens/auth/VerificationScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";

// Import screens - Main app
import HomeScreen from "./src/screens/home/HomeScreen";
import InformationScreen from "./src/screens/home/InformationScreen";
import InfoBaseScreen from "./src/screens/home/InfoBaseScreen";
import AssistantScreen from "./src/screens/assistant/AssistantScreen";

// Import screens - Trip related
import UserPlanScreen from "./src/screens/trips/UserPlanScreen";
import CreateTripScreen from "./src/screens/trips/CreateTripScreen";
import TripStyleScreen from "./src/screens/trips/TripStyleScreen";
import { TripDetailsScreen } from "./src/screens/trips/TripDetailsScreen";
import TripListScreen from "./src/screens/trips/TripListScreen";
import ProfileSetting from "./src/screens/home/ProfileSetting";
import EditProfileScreen from "./src/screens/profile/EditProfileScreen";
import ProfileInfoScreen from "./src/screens/profile/ProfileInfoScreen";
import NotificationSettings from "./src/screens/profile/NotificationSettings";
import TravelPreferences from "./src/screens/profile/TravelPreferences";
import ThemeSettings from "./src/screens/profile/ThemeSettings";

// Import the providers
import { AuthProvider, AuthContext } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";

const Stack = createStackNavigator();

// Auth Stack for unauthenticated users
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboard" component={OnboardScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// App Stack for authenticated users
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProfileSetting" component={ProfileSetting} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
      />
      <Stack.Screen name="TravelPreferences" component={TravelPreferences} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettings} />
      <Stack.Screen name="UserPlanScreen" component={UserPlanScreen} />
      <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
      <Stack.Screen name="InformationScreen" component={InformationScreen} />
      <Stack.Screen name="Trips" component={TripListScreen} />
      <Stack.Screen name="CreateTrip" component={CreateTripScreen} />
      <Stack.Screen name="TripStyleScreen" component={TripStyleScreen} />
      <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} />

      {/* Information screens with content keys */}
      <Stack.Screen
        name="VisaScreen"
        component={InfoBaseScreen}
        initialParams={{ contentKey: "visa" }}
      />
      <Stack.Screen
        name="LocalScreen"
        component={InfoBaseScreen}
        initialParams={{ contentKey: "local" }}
      />
      <Stack.Screen
        name="CurrencyScreen"
        component={InfoBaseScreen}
        initialParams={{ contentKey: "currency" }}
      />
      <Stack.Screen
        name="HealthScreen"
        component={InfoBaseScreen}
        initialParams={{ contentKey: "health" }}
      />
      <Stack.Screen
        name="TransportationScreen"
        component={InfoBaseScreen}
        initialParams={{ contentKey: "transportation" }}
      />
      <Stack.Screen
        name="LanguageScreen"
        component={InfoBaseScreen}
        initialParams={{ contentKey: "language" }}
      />
    </Stack.Navigator>
  );
}

// Root navigator that conditionally renders Auth or App stack based on authentication state
function RootNavigator() {
  return (
    <AuthContext.Consumer>
      {({ userToken, isLoading, isGuest }) => {
        if (isLoading) {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              accessibilityLabel="Loading"
              accessibilityRole="progressbar"
            >
              <ActivityIndicator size="large" color="#00ADEF" />
            </View>
          );
        }

        // Use the isGuest function to check authentication status
        return userToken ? <AppStack /> : <AuthStack />;
      }}
    </AuthContext.Consumer>
  );
}

// Add error boundary for navigation
function NavigationErrorBoundary({ children }) {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        fallback={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            accessibilityLabel="Navigation loading"
            accessibilityRole="progressbar"
          >
            <ActivityIndicator size="large" color="#00ADEF" />
          </View>
        }
        onStateChange={(state) => {
          // Optional: Add navigation state logging for debugging
          console.log("New navigation state:", state);
        }}
      >
        {children}
      </NavigationContainer>
    </View>
  );
}

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    const isRTL = i18n.language === "ar";
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NavigationErrorBoundary>
            <RootNavigator />
          </NavigationErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
