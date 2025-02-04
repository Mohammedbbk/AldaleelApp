// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// استيراد الشاشات
import SplashScreen from './src/screens/SplashScreen';
import OnboardScreen from './src/screens/OnboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen'; // <-- أضف هذا
import VerificationScreen from './src/screens/VerificationScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
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
    );
  }
}

export default App;
