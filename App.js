// App.js

import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// استيراد الشاشات
import SplashScreen from "./src/screens/SplashScreen";
import OnboardScreen from "./src/screens/OnboardScreen";
import LoginScreen from "./src/screens/LoginScreen";
<<<<<<< HEAD
import SignUpScreen from "./src/screens/SignUpScreen"; 
=======
import SignUpScreen from "./src/screens/SignUpScreen"; // <-- أضف هذا
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
import VerificationScreen from "./src/screens/VerificationScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import UserPlanScreen from "./src/screens/UserPlanScreen";
import AssistantScreen from "./src/screens/AssistantScreen";
import InformationScreen from "./src/screens/InformationScreen";
import InfoBaseScreen from "./src/screens/InfoBaseScreen";
<<<<<<< HEAD
import CreateTripScreen from "./src/screens/CreateTripScreen";

//فقط لتجربة تشغيل التطبيق
import HomeScreen from "./src/screens/HomeScreen";
import TripStyleScreen from "./src/screens/TripStyleScreen";
import TripDetailsScreen from "./src/screens/TripDetailsScreen";

TripDetailsScreen
=======

//فقط لتجربة تشغيل التطبيق
import ForgotHomeScreen from "./src/screens/HomeScreen";

>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
// سننشئ مكدّسين منفصلين: واحد لشاشات غير المسجّلين (Auth Stack)
// وواحد محتمل لشاشات المستخدم المسجّل (App Stack) في حال أضفنا شاشة رئيسية مستقبلاً.
const Stack = createStackNavigator();

// مكدّس الشاشات الخاصة بالتعريف (Onboarding & Auth):
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
<<<<<<< HEAD
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CreateTripScreen" component={CreateTripScreen} />
      <Stack.Screen name="TripStyleScreen" component={TripStyleScreen} />
      <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} />
 <Stack.Screen name="UserPlanScreen" component={UserPlanScreen} />
  <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
  <Stack.Screen name="InformationScreen" component={InformationScreen} />
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

=======
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
    </Stack.Navigator>
  );
}

<<<<<<< HEAD
=======
// مثال لشاشة رئيسية بعد تسجيل الدخول (Placeholder)
import { Text } from "react-native";
function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>Welcome! You are logged in.</Text>
    </View>
  );
}
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d

// مكدّس الشاشات الخاصة بالمستخدم المسجّل
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
      {/* أللمستخدم المسجل */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateTripScreen" component={CreateTripScreen} />
      <Stack.Screen name="TripStyleScreen" component={TripStyleScreen} />
      <Stack.Screen name="TripDetailsScreen" component={TripDetailsScreen} />
 <Stack.Screen name="UserPlanScreen" component={UserPlanScreen} />
  <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
  <Stack.Screen name="InformationScreen" component={InformationScreen} />
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
=======
      {/* أي شاشة تريدها للمستخدم المسجل */}
      <Stack.Screen name="Home" component={HomeScreen} />
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
    </Stack.Navigator>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null, // يخزّن هنا التوكن حال وجوده
      isLoading: true, // لمعرفة هل نتحقق من AsyncStorage أم لا
    };
  }

  // عند تشغيل التطبيق لأول مرة
  async componentDidMount() {
    try {
      // فحص هل هناك userToken في AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      this.setState({ userToken: token, isLoading: false });
    } catch (error) {
      console.log("Error reading token:", error);
      this.setState({ isLoading: false });
    }
  }

  // دالة لتحديث التوكن في الواجهة + AsyncStorage
  setUserToken = async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem("userToken", token);
        this.setState({ userToken: token });
      } else {
        // تسجيل خروج أو حذف التوكن
        await AsyncStorage.removeItem("userToken");
        this.setState({ userToken: null });
      }
    } catch (error) {
      console.log("Error setting token:", error);
    }
  };

  render() {
    const { userToken, isLoading } = this.state;

    // أثناء التحقق من AsyncStorage
    if (isLoading) {
      // يمكن عرض شاشة تحميل بسيطة أو استخدم SplashScreen مباشرة
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#00ADEF" />
        </View>
      );
    }

    return (
      <NavigationContainer>
        {/* إذا لا يوجد توكن => نعرض AuthStack (شاشات تسجيل الدخول/التسجيل/الترحيب) */}
<<<<<<< HEAD
        {/* إذا يوجد توكن => نعرض AppStack ( شاشة Home   شاشات للمستخدم المسجّل) */}
=======
        {/* إذا يوجد توكن => نعرض AppStack (مثلاً شاشة Home أو أي شاشات للمستخدم المسجّل) */}
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
        {userToken ? <AppStack /> : <AuthStack />}
      </NavigationContainer>

      // /*ITENERARY SECTION FOR TESTING ONLY*/
      // <NavigationContainer>
      //   <Stack.Navigator screenOptions={{ headerShown: false }}>
      //     <Stack.Screen name="UserPlanScreen" component={UserPlanScreen} />
      //     <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
      //     <Stack.Screen
      //       name="InformationScreen"
      //       component={InformationScreen}
      //     />
      //     <Stack.Screen
      //       name="VisaScreen"
      //       component={InfoBaseScreen}
      //       initialParams={{ contentKey: "visa" }}
      //     />
      //     <Stack.Screen
      //       name="LocalScreen"
      //       component={InfoBaseScreen}
      //       initialParams={{ contentKey: "local" }}
      //     />
      //     <Stack.Screen
      //       name="CurrencyScreen"
      //       component={InfoBaseScreen}
      //       initialParams={{ contentKey: "currency" }}
      //     />
      //     <Stack.Screen
      //       name="HealthScreen"
      //       component={InfoBaseScreen}
      //       initialParams={{ contentKey: "health" }}
      //     />
      //     <Stack.Screen
      //       name="TransportationScreen"
      //       component={InfoBaseScreen}
      //       initialParams={{ contentKey: "transportation" }}
      //     />
      //     <Stack.Screen
      //       name="LanguageScreen"
      //       component={InfoBaseScreen}
      //       initialParams={{ contentKey: "language" }}
      //     />
      //   </Stack.Navigator>
      // </NavigationContainer>
    );
  }
}

export default App;
