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
      resendTimer: 90, // 90 ثانية للعد التنازلي
<<<<<<< HEAD
      loading: false,  // حالة لتحكم الزر أثناء الإرسال
    };

    // مراجع للتحكم في التنقل التلقائي بين الحقول
    this.input1Ref = null;
=======
    };

    // مراجع للتحكم في التنقل التلقائي بين الحقول
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
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
<<<<<<< HEAD
          // إذا وصل إلى الصفر نوقف العداد
=======
          // إذا وصل الصفر نوقف العداد
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
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

<<<<<<< HEAD
  // التحقق من الكود
  handleVerify = async () => {
    const { digit1, digit2, digit3, digit4 } = this.state;
    const otp = `${digit1}${digit2}${digit3}${digit4}`;

    // تأكد إن كان المستخدم أدخل جميع الأرقام
    if (otp.length < 4) {
      alert('Please enter the complete OTP code.');
      return;
    }

    try {
      this.setState({ loading: true });
      //  لاستدعاء API وهمي
      const response = await fetch('https://example.com/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }), // إرسال الكود الذي أدخله المستخدم
      });

      const data = await response.json();
      // تحكم بناء على استجابة السيرفر
      if (data.success) {
        alert('OTP Verified Successfully!');
        //م الانتقال لصفحة أخرى
        // this.props.navigation.replace('Home');
      } else {
        alert(data.message || 'OTP verification failed.'); 
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while verifying OTP.');
    } finally {
      this.setState({ loading: false });
    }
  };

  // إعادة إرسال الكود
  handleResendCode = async () => {
    //   منع النقر المتكرر على إعادة الإرسال
    if (this.state.resendTimer > 0) return;

    try {
      // لاستدعاء API  لإعادة الإرسال
      const response = await fetch('https://example.com/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // أي بيانات تحتاج إرسالها للسيرفر 
          email: 'Abdullah@uj.edu.sa',
        }),
      });
      const data = await response.json();

      if (data.success) {
        alert('OTP code has been resent!');
        // إعادة ضبط المؤقت
        this.setState({ resendTimer: 90 }, () => {
          this.startTimer();
        });
      } else {
        alert(data.message || 'Failed to resend OTP code.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while resending OTP.');
    }
  };

  // منطق التنقل بين الحقول عند الإدخال
=======
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
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
  handleChangeDigit1 = (value) => {
    this.setState({ digit1: value }, () => {
      if (value.length === 1 && this.input2Ref) {
        this.input2Ref.focus();
      }
    });
  };

<<<<<<< HEAD
=======
  // إدخال رقم في الحقل الثاني
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
  handleChangeDigit2 = (value) => {
    this.setState({ digit2: value }, () => {
      if (value.length === 1 && this.input3Ref) {
        this.input3Ref.focus();
      }
    });
  };

<<<<<<< HEAD
=======
  // إدخال رقم في الحقل الثالث
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
  handleChangeDigit3 = (value) => {
    this.setState({ digit3: value }, () => {
      if (value.length === 1 && this.input4Ref) {
        this.input4Ref.focus();
      }
    });
  };

<<<<<<< HEAD
=======
  // إدخال رقم في الحقل الرابع
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
  handleChangeDigit4 = (value) => {
    this.setState({ digit4: value });
  };

<<<<<<< HEAD
  // منطق الحذف إلى الخلف
  // - إذا تم الضغط على Backspace مع أن الحقل فارغ، ارجع للحقل السابق
  handleDigit1KeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && !this.state.digit1) {
      // لا شيء قبل الحقل الأول عادةً
    }
  };

  handleDigit2KeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && !this.state.digit2) {
      this.input1Ref.focus();
    }
  };

  handleDigit3KeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && !this.state.digit3) {
      this.input2Ref.focus();
    }
  };

  handleDigit4KeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Backspace' && !this.state.digit4) {
      this.input3Ref.focus();
    }
  };

=======
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
  // زر الرجوع
  handleBack = () => {
    // الرجوع لشاشة سابقة أو replace
    this.props.navigation.replace('SignUp');
  };

  render() {
<<<<<<< HEAD
    const { digit1, digit2, digit3, digit4, resendTimer, loading } = this.state;

    // يمكنك تعطيل زر الـ Verify حتى يكتب المستخدم جميع الحقول
    const isVerifyDisabled = digit1.length < 1 || digit2.length < 1 || digit3.length < 1 || digit4.length < 1 || loading;
=======
    const { digit1, digit2, digit3, digit4, resendTimer } = this.state;
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d

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
<<<<<<< HEAD
              Please check your email{'\n'}
              Abdullah@uj.edu.sa for the verification code
=======
              Please check your email {'\n'}
              Abdullah@uj.edu.sa to see the verification code
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
            </Text>

            {/* تسمية الحقول */}
            <Text style={styles.label}>OTP Code</Text>

<<<<<<< HEAD
            {/* الحاوية الخاصة بحقول إدخال الكود */}
=======
            {/* الحاوية الخاصة بحقوق إدخال الكود */}
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
            <View style={styles.otpContainer}>
              {/* الحقل الأول */}
              <TextInput
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit1}
                onChangeText={this.handleChangeDigit1}
<<<<<<< HEAD
                onKeyPress={this.handleDigit1KeyPress}
                autoFocus
                returnKeyType="next"
                ref={(ref) => (this.input1Ref = ref)}
=======
                autoFocus
                returnKeyType="next"
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
              />
              {/* الحقل الثاني */}
              <TextInput
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit2}
                onChangeText={this.handleChangeDigit2}
<<<<<<< HEAD
                onKeyPress={this.handleDigit2KeyPress}
=======
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
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
<<<<<<< HEAD
                onKeyPress={this.handleDigit3KeyPress}
=======
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
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
<<<<<<< HEAD
                onKeyPress={this.handleDigit4KeyPress}
=======
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
                ref={(ref) => (this.input4Ref = ref)}
                returnKeyType="done"
              />
            </View>

            {/* زر Verify */}
<<<<<<< HEAD
            <TouchableOpacity
              style={[styles.verifyButton, isVerifyDisabled && { opacity: 0.6 }]}
              onPress={this.handleVerify}
              disabled={isVerifyDisabled}
            >
              <Text style={styles.verifyButtonText}>
                {loading ? 'Verifying...' : 'Verify'}
              </Text>
=======
            <TouchableOpacity style={styles.verifyButton} onPress={this.handleVerify}>
              <Text style={styles.verifyButtonText}>Verify</Text>
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
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
