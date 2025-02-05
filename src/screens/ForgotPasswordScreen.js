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
  ActivityIndicator,
  Keyboard,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
      // حالتا عرض المودال - نجاح و خطأ
      showSuccessModal: false,
      showErrorModal: false,
      // لتخزين نصوص الخطأ حسب الحالة
      errorTitle: '',
      errorMessage: '',
    };
  }

  // زر الرجوع
  handleBack = () => {
    this.props.navigation.replace('Login');
  };

  // زر Reset Password
  handleResetPassword = async () => {
    const { email } = this.state;

    // فحص البريد باستخدام Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // عرض مودال الخطأ مع الرسالة المناسبة
      this.setState({
        showErrorModal: true,
        errorTitle: 'Invalid Email',
        errorMessage: 'Please enter a valid email address.',
      });
      return;
    }

    Keyboard.dismiss();

    try {
      this.setState({ loading: true });

      // 🔹 محاكاة استدعاء API (قم بتغييره إلى API حقيقي)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // عرض المودال المخصص للنجاح
      this.setState({
        showSuccessModal: true,
        email: '', // إعادة تعيين الحقل
      });
    } catch (error) {
      // في حال حدوث خطأ عام
      this.setState({
        showErrorModal: true,
        errorTitle: 'Something went wrong',
        errorMessage: 'Please try again later.',
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  // إغلاق مودال النجاح
  closeSuccessModal = () => {
    this.setState({ showSuccessModal: false });
  };

  // إغلاق مودال الخطأ
  closeErrorModal = () => {
    this.setState({ showErrorModal: false });
  };

  render() {
    const {
      email,
      loading,
      showSuccessModal,
      showErrorModal,
      errorTitle,
      errorMessage,
    } = this.state;

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
                email.trim() === '' ? styles.disabledButton : {},
              ]}
              onPress={this.handleResetPassword}
              disabled={email.trim() === ''}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.resetButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </ScrollView>

          {/* مودال النجاح */}
          <Modal
            visible={showSuccessModal}
            transparent
            animationType="fade"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* أيقونة النجاح */}
                <View style={styles.successIconWrapper}>
                  <Ionicons name="mail" size={30} color="#fff" />
                </View>
                {/* العنوان */}
                <Text style={styles.modalTitle}>Check your email</Text>
                {/* الرسالة */}
                <Text style={styles.modalMessage}>
                  We have sent password recovery{'\n'}instruction to your email
                </Text>
                {/* زر إغلاق المودال */}
                <TouchableOpacity onPress={this.closeSuccessModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* مودال الخطأ */}
          <Modal
            visible={showErrorModal}
            transparent
            animationType="fade"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {/* أيقونة الخطأ */}
                <View style={styles.errorIconWrapper}>
                  <Ionicons name="warning" size={30} color="#fff" />
                </View>
                {/* العنوان */}
                <Text style={styles.modalTitle}>{errorTitle}</Text>
                {/* الرسالة */}
                <Text style={styles.modalMessage}>{errorMessage}</Text>
                {/* زر إغلاق المودال */}
                <TouchableOpacity onPress={this.closeErrorModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
    backgroundColor: '#A8DADC',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // أنماط المودال
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // خلفية شفافة للمودال
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  // أيقونة النجاح
  successIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F95728',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  // أيقونة الخطأ
  errorIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#00ADEF',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
