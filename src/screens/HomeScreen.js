// src/screens/HomeScreen.js


//لتجربة فقط


import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../../AuthProvider'; // تأكد من تعديل المسار حسب هيكل مجلدات مشروعك

class HomeScreen extends React.Component {
  static contextType = AuthContext;

  // دالة تسجيل الخروج: إزالة التوكن لتسجيل الخروج
  handleLogout = () => {
    this.context.setUserToken(null);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Home!</Text>
        <Button title="Log Out" onPress={this.handleLogout} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomeScreen;
