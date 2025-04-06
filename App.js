// App.js
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "./global.css";

// Import screens
import SplashScreen from "./src/screens/onboarding/SplashScreen";
import OnboardScreen from "./src/screens/onboarding/OnboardScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignUpScreen from "./src/screens/auth/SignUpScreen"; 
import VerificationScreen from "./src/screens/auth/VerificationScreen";
import ForgotPasswordScreen from "./src/screens/auth/ForgotPasswordScreen";
import UserPlanScreen from "./src/screens/trips/UserPlanScreen";
import AssistantScreen from "./src/screens/assistant/AssistantScreen";
import InformationScreen from "./src/screens/home/InformationScreen";
import InfoBaseScreen from "./src/screens/home/InfoBaseScreen";
import HomeScreen from "./src/screens/home/HomeScreen";

// Import the AuthProvider
import { AuthProvider, AuthContext } from "./AuthProvider";

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
// Import trip-related screens
import CreateTripScreen from "./src/screens/trips/CreateTripScreen";
import TripStyleScreen from "./src/screens/trips/TripStyleScreen";
import TripDetailsScreen from "./src/screens/trips/TripDetailsScreen";
import TripScreen from "./src/screens/trips/TripList";

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserPlanScreen" component={UserPlanScreen} />
      <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
      <Stack.Screen name="InformationScreen" component={InformationScreen} />
      <Stack.Screen name="Trips" component={TripScreen} />
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

// Root navigator that conditionally renders Auth or App stack based on authentication state
function RootNavigator() {
  return (
    <AuthContext.Consumer>
      {({ userToken, isLoading }) => {
        if (isLoading) {
          return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="#00ADEF" />
            </View>
          );
        }
        
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
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#00ADEF" />
          </View>
        }
        onStateChange={(state) => {
          // Optional: Add navigation state logging for debugging
          console.log('New navigation state:', state);
        }}
      >
        {children}
      </NavigationContainer>
    </View>
  );
}

class App extends React.Component {
  render() {
    return (
      <AuthProvider>
        <NavigationErrorBoundary>
          <RootNavigator />
        </NavigationErrorBoundary>
      </AuthProvider>
    );
  }
}

export default App;