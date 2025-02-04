// src/screens/SignUpScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// لتخزين البيانات (مثلاً التوكن)
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// عنوان API وهمي للتسجيل؛ غيّره حسب مشروعك
const SIGNUP_API_URL = 'https://example.com/api/signup';

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      isPasswordVisible: false,
      loading: false,       // مؤشر التحميل
      errorMessage: '',     // رسالة الخطأ
    };
  }

  // زر الرجوع: ينقل المستخدم لشاشة Onboard (أو غيرها)
  handleBack = () => {
    this.props.navigation.replace('Onboard');
  };

  // التحقق من صحة المدخلات (Validation)
  validateInputs = () => {
    const { name, email, password } = this.state;
    // يجب أن يكون الاسم غير فارغ، وفيه 2 أحرف على الأقل مثلًا
    if (name.trim().length < 2) {
      this.setState({ errorMessage: 'Name must be at least 2 characters.' });
      return false;
    }
    // تحقق صيغة البريد
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      this.setState({ errorMessage: 'Please enter a valid email address.' });
      return false;
    }
    // كلمة المرور 8 أحرف على الأقل
    if (password.length < 8) {
      this.setState({ errorMessage: 'Password must be at least 8 characters.' });
      return false;
    }
    return true;
  };

  // عند الضغط على Sign Up
  handleSignUp = async () => {
    // إزالة أي خطأ سابق
    this.setState({ errorMessage: '' });

    // التحقق من صحة المدخلات
    if (!this.validateInputs()) return;

    try {
      this.setState({ loading: true }); // بدأ التحميل

      const { name, email, password } = this.state;
      const response = await fetch(SIGNUP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        // إن عاد الخادم برمز خطأ (400, 409, ...)
        const message = data?.message || 'Sign up failed. Please try again.';
        throw new Error(message);
      }

      // نجاح إنشاء الحساب
      const token = data.token; // تأكد من أن اسم الحقل مطابق لردّ السيرفر
      await AsyncStorage.setItem('userToken', token);

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // مثلًا الانتقال لشاشة Login أو لشاشة رئيسية
            this.props.navigation.replace('Login');
          },
        },
      ]);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  // إظهار/إخفاء كلمة المرور
  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  // الانتقال إلى شاشة تسجيل الدخول
  handleSignIn = () => {
    this.props.navigation.replace('Login');
  };

  // Sign Up مع Apple (حاليًا تنبيه شكلي)
  handleSignUpApple = () => {
    Alert.alert('Apple Sign Up', 'Integration not implemented yet!');
  };

  // Sign Up مع Google (حاليًا تنبيه شكلي)
  handleSignUpGoogle = () => {
    Alert.alert('Google Sign Up', 'Integration not implemented yet!');
  };

  render() {
    const {
      name,
      email,
      password,
      isPasswordVisible,
      loading,
      errorMessage,
    } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            bounces={false}
          >
            {/* زر الرجوع */}
            <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
              <View style={styles.backButtonCircle}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </View>
            </TouchableOpacity>

            {/* العنوان والنص الفرعي */}
            <Text style={styles.title}>Sign up now</Text>
            <Text style={styles.subTitle}>Please fill the details and create account</Text>

            {/* عرض رسالة الخطأ إن وجدت */}
            {errorMessage !== '' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            {/* حقل الاسم */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(val) => this.setState({ name: val })}
              />
            </View>

            {/* حقل البريد */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(val) => this.setState({ email: val })}
              />
            </View>

            {/* حقل كلمة المرور + زر العين */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={(val) => this.setState({ password: val })}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={this.togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* ملاحظة حول كلمة المرور */}
            <Text style={styles.passwordNote}>Password must be 8 characters</Text>

            {/* زر Sign Up */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={this.handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* رابط تسجيل الدخول */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={this.handleSignIn}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>

            {/* نص الفصل */}
            <Text style={styles.orConnectText}>Or connect</Text>

            {/* زر Apple */}
            <TouchableOpacity style={styles.appleButton} onPress={this.handleSignUpApple}>
              <Ionicons name="logo-apple" size={20} color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.appleButtonText}>Sign up with Apple</Text>
            </TouchableOpacity>

            {/* زر Google */}
            <TouchableOpacity style={styles.googleButton} onPress={this.handleSignUpGoogle}>
              <Ionicons name="logo-google" size={20} color="#DB4437" style={{ marginRight: 8 }} />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default SignUpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 60,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#333',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 14,
  },
  passwordNote: {
    width: '100%',
    fontSize: 13,
    color: '#999',
    marginBottom: 20,
    textAlign: 'left',
  },
  signUpButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#00ADEF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  signInText: {
    color: '#777',
    fontSize: 14,
  },
  signInLink: {
    color: '#FF6E2C',
    fontSize: 14,
    fontWeight: '600',
  },
  orConnectText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
  appleButton: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  appleButtonText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  googleButton: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});
