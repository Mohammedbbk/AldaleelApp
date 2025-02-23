// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// استيراد الشاشات
import SplashScreen from "./src/screens/SplashScreen";
import OnboardScreen from "./src/screens/OnboardScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen"; // <-- أضف هذا
import VerificationScreen from "./src/screens/VerificationScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import UserPlanScreen from "./src/screens/UserPlanScreen";
import AssistantScreen from "./src/screens/AssistantScreen";
import InformationScreen from "./src/screens/InformationScreen";
import InfoBaseScreen from "./src/screens/InfoBaseScreen";

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
      /*itenerary section*/
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="UserPlanScreen" component={UserPlanScreen} />
          <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
          <Stack.Screen
            name="InformationScreen"
            component={InformationScreen}
          />
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
      </NavigationContainer>
    ); //include this line while commenting/decommenting

    ///*sign in section*/
    // return (
    //   <NavigationContainer>
    //     <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>

    //       <Stack.Screen name="Splash" component={SplashScreen} />
    //       <Stack.Screen name="Onboard" component={OnboardScreen} />
    //       <Stack.Screen name="Login" component={LoginScreen} />

    //       {/* شاشة Sign Up */}
    //       <Stack.Screen name="SignUp" component={SignUpScreen} />

    //       <Stack.Screen name="Verification" component={VerificationScreen} />
    //       <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    //     </Stack.Navigator>
    //   </NavigationContainer>
    // ); //include this line while commenting/decommenting
  }
}

export default App;
