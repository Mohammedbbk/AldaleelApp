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

import SplashScreen from "./src/screens/onboarding/SplashScreen";
import OnboardScreen from "./src/screens/onboarding/OnboardScreen";


import LoginScreen from "./src/screens/auth/LoginScreen";
import SignUpScreen from "./src/screens/auth/SignUpScreen";
import VerificationScreen from "./src/screens/auth/VerificationScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";


import HomeScreen from "./src/screens/home/HomeScreen";
import InformationScreen from "./src/screens/home/InformationScreen";
import InfoBaseScreen from "./src/screens/home/InfoBaseScreen";
import AssistantScreen from "./src/screens/assistant/AssistantScreen";


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


import { AuthProvider, AuthContext } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";

const Stack = createStackNavigator();


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


        return userToken ? <AppStack /> : <AuthStack />;
      }}
    </AuthContext.Consumer>
  );
}


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

          console.log("New navigation state:", state);
        }}
      >
        {children}
      </NavigationContainer>
    </View>
  );
}


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
