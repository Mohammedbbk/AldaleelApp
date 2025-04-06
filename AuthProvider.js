// src/AuthProvider.js
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a new Context
export const AuthContext = React.createContext();

export class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userToken: null,
      isLoading: true
    };
  }

  // Load token from AsyncStorage when component mounts
  async componentDidMount() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      this.setState({ userToken: token, isLoading: false });
    } catch (error) {
      console.log('Error reading token:', error);
      this.setState({ isLoading: false });
    }
  }

  // Method to set or remove the user token
  setUserToken = async (token) => {
    try {
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        this.setState({ userToken: token });
      } else {
        await AsyncStorage.removeItem('userToken');
        this.setState({ userToken: null });
      }
    } catch (error) {
      console.log('Error setting token:', error);
    }
  };

  render() {
    const { userToken, isLoading } = this.state;
    
    // The value that will be available to consumer components
    const authContext = {
      userToken,
      isLoading,
      setUserToken: this.setUserToken
    };

    return (
      <AuthContext.Provider value={authContext}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}