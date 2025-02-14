// AuthProvider.js
import React, { createContext, Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// نصدر الـ Context حتى نتمكن من استخدامه في الشاشات
export const AuthContext = createContext();

class AuthProvider extends Component {
  state = {
    userToken: null,  // في البداية null
    isLoading: true,  // للتحقق من التوكن المحفوظ عند تشغيل التطبيق
  };

  componentDidMount() {
    this.loadToken();
  }

  // دالة لجلب التوكن من AsyncStorage عند تشغيل التطبيق
  loadToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      this.setState({ userToken: token, isLoading: false });
    } catch (error) {
      console.log('Error loading token:', error);
      this.setState({ isLoading: false });
    }
  }

  // دالة لتخزين/تحديث التوكن أو حذفه (تسجيل الخروج)
  setUserToken = async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        this.setState({ userToken: token });
      } else {
        // لو كان null أو ''
        await AsyncStorage.removeItem('userToken');
        this.setState({ userToken: null });
      }
    } catch (error) {
      console.log('Error setting token:', error);
    }
  }

  render() {
    const { userToken, isLoading } = this.state;

    return (
      <AuthContext.Provider
        value={{
          userToken,       // قيمة التوكن الحالي
          isLoading,       // هل ما زلنا نتحقق من وجود التوكن؟
          setUserToken: this.setUserToken, 
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
