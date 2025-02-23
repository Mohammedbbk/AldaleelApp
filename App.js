// App.js

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

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


//فقط لتجربة تشغيل التطبيق
import ForgotHomeScreen from './src/screens/HomeScreen';


// سننشئ مكدّسين منفصلين: واحد لشاشات غير المسجّلين (Auth Stack)
// وواحد محتمل لشاشات المستخدم المسجّل (App Stack) في حال أضفنا شاشة رئيسية مستقبلاً.
const Stack = createStackNavigator();

// مكدّس الشاشات الخاصة بالتعريف (Onboarding & Auth):
function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboard" component={OnboardScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// مثال لشاشة رئيسية بعد تسجيل الدخول (Placeholder)
import { Text } from 'react-native';
function HomeScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize:20 }}>Welcome! You are logged in.</Text>
    </View>
  );
}

// مكدّس الشاشات الخاصة بالمستخدم المسجّل
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* أي شاشة تريدها للمستخدم المسجل */}
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null,  // يخزّن هنا التوكن حال وجوده
      isLoading: true,  // لمعرفة هل نتحقق من AsyncStorage أم لا
    };
  }

  // عند تشغيل التطبيق لأول مرة
  async componentDidMount() {
    try {
      // فحص هل هناك userToken في AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
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
        await AsyncStorage.setItem('userToken', token);
        this.setState({ userToken: token });
      } else {
        // تسجيل خروج أو حذف التوكن
        await AsyncStorage.removeItem('userToken');
        this.setState({ userToken: null });
      }
    } catch (error) {
      console.log('Error setting token:', error);
    }
  }

  render() {
    const { userToken, isLoading } = this.state;

    // أثناء التحقق من AsyncStorage
    if (isLoading) {
      // يمكن عرض شاشة تحميل بسيطة أو استخدم SplashScreen مباشرة
      return (
        <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
          <ActivityIndicator size="large" color="#00ADEF" />
        </View>
      );
    }
    
    return (
      /*sign in section*/
        <NavigationContainer>
          {/* إذا لا يوجد توكن => نعرض AuthStack (شاشات تسجيل الدخول/التسجيل/الترحيب) */}
          {/* إذا يوجد توكن => نعرض AppStack (مثلاً شاشة Home أو أي شاشات للمستخدم المسجّل) */}
          {userToken ? <AppStack /> : <AuthStack />}
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
  
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboard" component={OnboardScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
  
            {/* شاشة Sign Up */}
            <Stack.Screen name="SignUp" component={SignUpScreen} />
  
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      ); //include this line while commenting/decommenting
    //   /*itenerary section*/
    //   <NavigationContainer>
    //     <Stack.Navigator screenOptions={{ headerShown: false }}>
    //       <Stack.Screen name="UserPlanScreen" component={UserPlanScreen} />
    //       <Stack.Screen name="AssistantScreen" component={AssistantScreen} />
    //       <Stack.Screen
    //         name="InformationScreen"
    //         component={InformationScreen}
    //       />
    //       <Stack.Screen
    //         name="VisaScreen"
    //         component={InfoBaseScreen}
    //         initialParams={{ contentKey: "visa" }}
    //       />
    //       <Stack.Screen
    //         name="LocalScreen"
    //         component={InfoBaseScreen}
    //         initialParams={{ contentKey: "local" }}
    //       />
    //       <Stack.Screen
    //         name="CurrencyScreen"
    //         component={InfoBaseScreen}
    //         initialParams={{ contentKey: "currency" }}
    //       />
    //       <Stack.Screen
    //         name="HealthScreen"
    //         component={InfoBaseScreen}
    //         initialParams={{ contentKey: "health" }}
    //       />
    //       <Stack.Screen
    //         name="TransportationScreen"
    //         component={InfoBaseScreen}
    //         initialParams={{ contentKey: "transportation" }}
    //       />
    //       <Stack.Screen
    //         name="LanguageScreen"
    //         component={InfoBaseScreen}
    //         initialParams={{ contentKey: "language" }}
    //       />
    //     </Stack.Navigator>
    //   </NavigationContainer>
    // ); //include this line while commenting/decommenting

  }
}

export default App;
