<<<<<<< HEAD
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5, AntDesign, Entypo } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const recommendedTrips = [
  {
    id: '1',
    name: 'Dubai Trip',
    image: require('../../assets/onboard/cityTravel.png'),
    rating: '4.9',
    location: 'Dubai, UAE',
  },
  {
    id: '2',
    name: 'Paris Trip',
    image: require('../../assets/onboard/cityTravel.png'),
    rating: '4.8',
    location: 'Paris, FRANCE',
  },
  {
    id: '3',
    name: 'Istanbul Trip',
    image: require('../../assets/onboard/cityTravel.png'),
    rating: '4.7',
    location: 'Istanbul, TURKEY',
  },
];

const popularTrips = [
  {
    id: '1',
    name: 'Bali Trip',
    image: require('../../assets/onboard/cityTravel.png'),
    rating: '4.7',
    location: 'Bali, INDONESIA',
  },
  {
    id: '2',
    name: 'Tokyo Trip',
    image: require('../../assets/onboard/cityTravel.png'),
    rating: '4.8',
    location: 'Tokyo, JAPAN',
  },
  {
    id: '3',
    name: 'London Trip',
    image: require('../../assets/onboard/cityTravel.png'),
    rating: '4.6',
    location: 'London, UK',
  },
];

// تعديل مكون TripCard لاستقبال navigation
const TripCard = ({ item, navigation }) => {
  return (
    <View style={styles.tripCard}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.tripImage} />
        <TouchableOpacity style={styles.favoriteButton}>
          <FontAwesome name="bookmark" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>
      <View style={styles.tripInfoContainer}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            <FontAwesome name="star" size={16} color="rgba(255,215,0,0.8)" />
          </View>
        </View>
        <View style={styles.tripFooter}>
          <View style={styles.locationContainer}>
            <Entypo name="location-pin" size={16} color="rgba(119,119,119,0.8)" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          {/* عند الضغط على زر Create Trip نمرر اسم الدولة من خلال الخاصية selectedDestination */}
          <TouchableOpacity
            style={styles.createTripButton}
            onPress={() =>
              navigation.navigate('CreateTripScreen', { selectedDestination: item.location })
            }
          >
            <Text style={styles.createTripText}>Create Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const HomePage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfoContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('../../assets/onboard/beachAdventure.png')}
                style={styles.profileImage}
              />
            </View>
            <Text style={styles.userName}>Nawaf</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <FontAwesome name="bell" size={24} color="rgba(0,0,0,0.8)" />
            <View style={styles.notificationBadge}></View>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.exploreText}>Explore the</Text>
          <View style={styles.beautifulWorldContainer}>
            <Text style={styles.beautifulText}>Beautiful </Text>
            <Text style={styles.worldText}>wo</Text>
            <View style={styles.smileContainer}>
              <Text style={styles.worldText}>r</Text>
              <Text style={[styles.worldText, styles.rotate180]}>⌣</Text>
            </View>
            <Text style={styles.worldText}>ld!</Text>
          </View>
        </View>

        {/* Recommended For You */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recommendedTrips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripCard item={item} navigation={navigation} />}
            contentContainerStyle={styles.tripList}
          />
        </View>

        {/* Popular Trips */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionTitle}>Popular Trips</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularTrips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripCard item={item} navigation={navigation} />}
            contentContainerStyle={styles.tripList}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="home" size={24} color="rgba(30,144,255,0.8)" />
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="plane" size={22} color="rgba(119,119,0.8)" />
          <Text style={styles.navText}>Trips</Text>
        </TouchableOpacity>

        {/* زر الإضافة */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateTripScreen')}
        >
          <AntDesign name="plus" size={32} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('UserPlanScreen')}
        >
          <AntDesign name="message1" size={24} color="rgba(119,119,119,0.8)" />
          <Text style={styles.navText}>AI Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <FontAwesome name="user" size={24} color="rgba(119,119,119,0.8)" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
=======
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
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  exploreText: {
    fontSize: 24,
    color: '#555',
    fontWeight: '400',
    textAlign: 'center',
  },
  beautifulWorldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  beautifulText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  worldText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E90FF',
    textAlign: 'center',
  },
  smileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rotate180: {
    transform: [{ rotate: '180deg' }],
    marginBottom: 12,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF8C00',
    fontWeight: '600',
  },
  tripList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  tripCard: {
    width: width * 0.7,
    marginRight: 15,
    borderRadius: 15,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 5,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  tripImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfoContainer: {
    padding: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#555',
    marginRight: 4,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#777',
    marginLeft: 4,
  },
  createTripButton: {
    backgroundColor: '#1E90FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  createTripText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  activeNavText: {
    color: '#1E90FF',
    fontWeight: '600',
  },
  createButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
  },
});

export default HomePage;
=======
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
>>>>>>> 645be697ec2159d4783a4847a9f641a263dcc45d
