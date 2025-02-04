// src/screens/ForgotPasswordScreen.js
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
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false, // ✅ إضافة حالة التحميل
    };
  }

  // زر الرجوع
  handleBack = () => {
    this.props.navigation.replace('Login');
  };

  // زر Reset Password
  handleResetPassword = async () => {
    const { email } = this.state;

    // ✅ فحص البريد باستخدام Regex أكثر دقة
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    Keyboard.dismiss(); // ✅ إخفاء لوحة المفاتيح بعد الضغط

    try {
      this.setState({ loading: true });

      // 🔹 محاكاة استدعاء API (قم بتغييره إلى API حقيقي)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        `A reset link has been sent to ${email}. Check your inbox!`
      );

      this.setState({ email: '' }); // ✅ إعادة تعيين الإدخال بعد الإرسال
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { email, loading } = this.state;

    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.container} bounces={false}>
            {/* زر الرجوع */}
            <TouchableOpacity style={styles.backButton} onPress={this.handleBack}>
              <View style={styles.backButtonCircle}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </View>
            </TouchableOpacity>

            {/* العنوان */}
            <Text style={styles.title}>Forgot password</Text>

            {/* النص الفرعي */}
            <Text style={styles.subTitle}>
              Enter your email account to reset{'\n'}your password
            </Text>

            {/* حقل البريد */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={email}
                onChangeText={(val) => this.setState({ email: val })}
                autoCapitalize="none"
              />
            </View>

            {/* زر Reset Password */}
            <TouchableOpacity
              style={[
                styles.resetButton,
                email.trim() === '' ? styles.disabledButton : {}, // ✅ تعطيل الزر عند عدم إدخال بريد
              ]}
              onPress={this.handleResetPassword}
              disabled={email.trim() === ''}
            >
              {loading ? (
                <ActivityIndicator color="#fff" /> // ✅ إظهار مؤشر تحميل أثناء الإرسال
              ) : (
                <Text style={styles.resetButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: 50,
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
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#333',
  },
  resetButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#00ADEF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A8DADC', // ✅ لون باهت عند تعطيل الزر
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
