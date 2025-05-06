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
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../../../AuthProvider";

const { width } = Dimensions.get("window");

const SIGNUP_API_URL = "http://10.0.2.2:5000/api/auth/signup";

class SignUpScreen extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      isPasswordVisible: false,
      loading: false,
      errorMessage: "",
    };
  }

  handleBack = () => {
    this.props.navigation.replace("Onboard");
  };

  validateInputs = () => {
    const { name, email, password } = this.state;
    if (name.trim().length < 2) {
      this.setState({ errorMessage: "Name must be at least 2 characters." });
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      this.setState({ errorMessage: "Please enter a valid email address." });
      return false;
    }
    if (password.length < 8) {
      this.setState({
        errorMessage: "Password must be at least 8 characters.",
      });
      return false;
    }
    return true;
  };

  handleSignUp = async () => {
    this.setState({ errorMessage: "" });

    if (!this.validateInputs()) return;

    try {
      this.setState({ loading: true });

      const { name, email, password } = this.state;
      const response = await fetch(SIGNUP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        const message = data?.message || "Sign up failed. Please try again.";
        throw new Error(message);
      }

      const token = data.token;
      this.context.setUserToken(token);

      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => {
            this.props.navigation.replace("VerificationScreen");
          },
        },
      ]);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      isPasswordVisible: !prevState.isPasswordVisible,
    }));
  };

  handleSignIn = () => {
    this.props.navigation.replace("Login");
  };

  handleSignUpApple = () => {
    Alert.alert("Apple Sign Up", "Integration not implemented yet!");
  };

  handleSignUpGoogle = () => {
    Alertalert("Google Sign Up", "Integration not implemented yet!");
  };

  handleSkipSignUp = async () => {
    try {
      this.setState({ loading: true });
      this.context.setUserToken("guest-token");
    } catch (error) {
      console.warn("Skip signup error:", error);
      Alert.alert(
        "Notice",
        "Unable to continue as guest at the moment. Please try signing up."
      );
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { name, email, password, isPasswordVisible, loading, errorMessage } =
      this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={this.handleSkipSignUp}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            bounces={false}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={this.handleBack}
            >
              <View style={styles.backButtonCircle}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </View>
            </TouchableOpacity>

            <Text style={styles.title}>Sign up now</Text>
            <Text style={styles.subTitle}>
              Please fill the details and create account
            </Text>

            {errorMessage !== "" && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(val) => this.setState({ name: val })}
              />
            </View>

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
                  name={isPasswordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.passwordNote}>
              Password must be 8 characters
            </Text>

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

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={this.handleSignIn}>
                <Text style={styles.signInLink}>Sign in</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.orConnectText}>Or connect</Text>

            <TouchableOpacity
              style={styles.appleButton}
              onPress={this.handleSignUpApple}
            >
              <Ionicons
                name="logo-apple"
                size={20}
                color="#000"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.appleButtonText}>Sign up with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={this.handleSignUpGoogle}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#DB4437"
                style={{ marginRight: 8 }}
              />
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
  passwordNote: {
    width: "100%",
    fontSize: 13,
    color: "#999",
    marginBottom: 20,
    textAlign: "left",
  },
  signUpButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#00ADEF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  signInText: {
    color: "#777",
    fontSize: 14,
  },
  signInLink: {
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
    zIndex: 1,
  },
  skipButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
});