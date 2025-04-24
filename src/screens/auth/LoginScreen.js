// src/screens/LoginScreen.js
import React from "react";
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
} from "react-native";

// أيقونات Ionicons
import Ionicons from "react-native-vector-icons/Ionicons";

// استيراد AuthContext من ملف المزوّد (AuthProvider.js مثلاً)
import { AuthContext } from "../../../AuthProvider";

const { width } = Dimensions.get("window");

// ثابت خاص بعنوان الـAPI (غيّره حسب مشروعك)
const LOGIN_API_URL = "http://10.0.2.2:5000/api/auth/login";

class LoginScreen extends React.Component {
  // للسماح باستخدام this.context
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      isPasswordVisible: false,
      loading: false, // حالة التحميل
      errorMessage: "", // عرض رسالة خطأ إن وجدت
    };
  }

  // زر الرجوع: ينقل المستخدم إلى شاشة Onboard
  handleBack = () => {
    this.props.navigation.replace("Onboard");
  };

  // التحقق من صحة الحقول قبل إرسال الطلب
  validateInputs = () => {
    const { email, password } = this.state;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      this.setState({ errorMessage: "Please enter a valid email address." });
      return false;
    }
    // فحص طول كلمة المرور (8 حروف على الأقل)
    if (password.length < 8) {
      this.setState({
        errorMessage: "Password must be at least 8 characters.",
      });
      return false;
    }
    return true;
  };

  // عند الضغط على زر Sign In
  handleSignIn = async () => {
    this.setState({ errorMessage: "" }); // مسح الأخطاء السابقة

    // التحقق من صحة المدخلات
    if (!this.validateInputs()) return;

    try {
      this.setState({ loading: true }); // إظهار مؤشر التحميل
      const { email, password } = this.state;

      // الاتصال بالـAPI الوهمي
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      // التحقق من حالة الرد
      if (!response.ok) {
        const message = data?.message || "Login failed. Please try again.";
        throw new Error(message);
      }

      // نجاح تسجيل الدخول
      const token = data.token; // تأكد من أن "token" هو الحقل الذي يعيده الـAPI
      // تحديث التوكن في AuthContext (سيقوم الـAuthProvider بتخزينه)
      this.context.setUserToken(token);

      Alert.alert("Success", "Logged in successfully!", [
        {
          text: "OK",
          onPress: () => {
            // مثال: الانتقال لصفحة رئيسية أو شاشة Verification
            this.props.navigation.replace("Home");
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

  // شاشة ForgotPassword
  handleForgetPassword = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  // الانتقال لشاشة Sign Up
  handleSignUp = () => {
    this.props.navigation.navigate("SignUp");
  };

  // تسجيل الدخول عبر Apple (تنبيه شكلي حاليًا)
  handleSignInApple = () => {
    Alert.alert("Apple Sign In", "Integration not implemented yet!");
  };

  // تسجيل الدخول عبر Google (تنبيه شكلي حاليًا)
  handleSignInGoogle = () => {
    Alert.alert("Google Sign In", "Integration not implemented yet!");
  };

  

  render() {
    const { email, password, isPasswordVisible, loading, errorMessage } =
      this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            bounces={false}
          >
            {/* زر الرجوع ضمن دائرة شفافة */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={this.handleBack}
            >
              <View style={styles.backButtonCircle}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </View>
            </TouchableOpacity>

            {/* العنوان والنص الفرعي */}
            <Text style={styles.title}>Sign in now</Text>
            <Text style={styles.subTitle}>
              Please sign in to continue our app
            </Text>

            {/* رسالة الخطأ (إن وجدت) */}
            {errorMessage !== "" && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

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

            {/* حقل كلمة المرور */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={(val) => this.setState({ password: val })}
              />
              {/* زر العين لإظهار/إخفاء كلمة المرور */}
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={this.togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* رابط نسيان كلمة المرور */}
            <TouchableOpacity
              style={styles.forgetPasswordButton}
              onPress={this.handleForgetPassword}
            >
              <Text style={styles.forgetPasswordText}>Forget Password?</Text>
            </TouchableOpacity>

            {/* زر تسجيل الدخول */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={this.handleSignIn}
              disabled={loading} // تعطيل الزر أثناء التحميل
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signInButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* رابط التسجيل */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={this.handleSignUp}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>

            {/* نص الفصل */}
            <Text style={styles.orConnectText}>Or connect</Text>

            {/* زر Apple */}
            <TouchableOpacity
              style={styles.appleButton}
              onPress={this.handleSignInApple}
            >
              <Ionicons
                name="logo-apple"
                size={20}
                color="#000"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.appleButtonText}>Sign in with Apple</Text>
            </TouchableOpacity>

            {/* زر Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={this.handleSignInGoogle}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#DB4437"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Add Skip button at the top */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={this.handleSkipSignIn}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

// Add these new styles to the existing StyleSheet
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    marginTop: 60,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    paddingHorizontal: 15,
    color: "#333",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 14,
  },
  forgetPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgetPasswordText: {
    color: "#FF6E2C",
    fontSize: 14,
  },
  signInButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#00ADEF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  signUpText: {
    color: "#777",
    fontSize: 14,
  },
  signUpLink: {
    color: "#FF6E2C",
    fontSize: 14,
    fontWeight: "600",
  },
  orConnectText: {
    color: "#999",
    fontSize: 14,
    marginBottom: 20,
  },
  appleButton: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  appleButtonText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
  skipButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
export default LoginScreen;
