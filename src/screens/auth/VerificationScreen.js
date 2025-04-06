// src/screens/VerificationScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

class VerificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      digit1: '',
      digit2: '',
      digit3: '',
      digit4: '',
      resendTimer: 90, // 90 seconds countdown
    };

    // References for automatic field navigation
    this.input2Ref = null;
    this.input3Ref = null;
    this.input4Ref = null;
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    // تنظيف المؤقت عند مغادرة الشاشة
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  // بدء العد التنازلي
  startTimer = () => {
    this.timerInterval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.resendTimer <= 1) {
          // إذا وصل الصفر نوقف العداد
          clearInterval(this.timerInterval);
          return { resendTimer: 0 };
        }
        return { resendTimer: prevState.resendTimer - 1 };
      });
    }, 1000);
  };

  // تنسيق الوقت على شكل mm:ss
  formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m < 10 ? `0${m}` : m;
    const ss = s < 10 ? `0${s}` : s;
    return `${mm}:${ss}`;
  };

  // عند الضغط على زر Verify
  handleVerify = () => {
    const { digit1, digit2, digit3, digit4 } = this.state;
    const otp = `${digit1}${digit2}${digit3}${digit4}`;
    // منطق التحقق الفعلي (اتصال بخادم) أو مجرد تنبيه
    alert(`Entered OTP code is: ${otp}`);
    // مثال: الانتقال لشاشة أخرى
    // this.props.navigation.replace('Login');
  };

  // إعادة إرسال الكود (مثال)
  handleResendCode = () => {
    // يمكنك استدعاء API لإرسال كود جديد
    alert('OTP code has been resent!');
    this.setState({ resendTimer: 90 }, () => {
      // إعادة بدء المؤقت
      this.startTimer();
    });
  };

  // إدخال رقم في الحقل الأول
  handleChangeDigit1 = (value) => {
    this.setState({ digit1: value }, () => {
      if (value.length === 1 && this.input2Ref) {
        this.input2Ref.focus();
      }
    });
  };

  // إدخال رقم في الحقل الثاني
  handleChangeDigit2 = (value) => {
    this.setState({ digit2: value }, () => {
      if (value.length === 1 && this.input3Ref) {
        this.input3Ref.focus();
      }
    });
  };

  // إدخال رقم في الحقل الثالث
  handleChangeDigit3 = (value) => {
    this.setState({ digit3: value }, () => {
      if (value.length === 1 && this.input4Ref) {
        this.input4Ref.focus();
      }
    });
  };

  // إدخال رقم في الحقل الرابع
  handleChangeDigit4 = (value) => {
    this.setState({ digit4: value });
  };

  // زر الرجوع
  handleBack = () => {
    // الرجوع لشاشة سابقة أو replace
    this.props.navigation.replace('SignUp');
  };

  render() {
    const { digit1, digit2, digit3, digit4, resendTimer } = this.state;

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
            <Text style={styles.title}>OTP Verification</Text>

            {/* النص الإرشادي */}
            <Text style={styles.subTitle}>
              Please check your email {'\n'}
              Abdullah@uj.edu.sa to see the verification code
            </Text>

            {/* تسمية الحقول */}
            <Text style={styles.label}>OTP Code</Text>

            {/* الحاوية الخاصة بحقوق إدخال الكود */}
            <View style={styles.otpContainer}>
              {/* الحقل الأول */}
              <TextInput
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit1}
                onChangeText={this.handleChangeDigit1}
                autoFocus
                returnKeyType="next"
              />
              {/* الحقل الثاني */}
              <TextInput
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit2}
                onChangeText={this.handleChangeDigit2}
                ref={(ref) => (this.input2Ref = ref)}
                returnKeyType="next"
              />
              {/* الحقل الثالث */}
              <TextInput
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit3}
                onChangeText={this.handleChangeDigit3}
                ref={(ref) => (this.input3Ref = ref)}
                returnKeyType="next"
              />
              {/* الحقل الرابع */}
              <TextInput
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit4}
                onChangeText={this.handleChangeDigit4}
                ref={(ref) => (this.input4Ref = ref)}
                returnKeyType="done"
              />
            </View>

            {/* زر Verify */}
            <TouchableOpacity style={styles.verifyButton} onPress={this.handleVerify}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>

            {/* إعادة إرسال الكود + المؤقت */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Resend code to</Text>
              {resendTimer > 0 ? (
                <Text style={styles.timerText}>{this.formatTime(resendTimer)}</Text>
              ) : (
                <TouchableOpacity onPress={this.handleResendCode}>
                  <Text style={[styles.timerText, { color: '#FF6E2C' }]}>
                    Resend
                  </Text>
                </TouchableOpacity>
              )}
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

export default VerificationScreen;

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
    fontSize: 20,
    color: '#111',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  otpContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: width * 0.15,  // تحكم في عرض الحقل
    height: 50,
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    color: '#111',
  },
  verifyButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#00ADEF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  resendText: {
    fontSize: 14,
    color: '#777',
  },
  timerText: {
    fontSize: 14,
    color: '#777',
  },
});
