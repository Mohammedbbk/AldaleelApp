import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';

import Svg, { Path } from 'react-native-svg';

import waveBoat from '../../../assets/onboard/waveBoat.png';
import cityTravel from '../../../assets/onboard/cityTravel.png';
import beachAdventure from '../../../assets/onboard/beachAdventure.png';

const { width, height } = Dimensions.get('window');

class OnboardScreen extends React.Component {
  constructor(props) {
    super(props);

    this.slides = [
      {
        key: 'slide1',
        image: waveBoat,
        title: 'Your journey, intelligently planned',
        subtitle: 'Harness AI to craft your perfect escape',
        description: `Embark on a futuristic travel adventure.
Let AI uncover hidden gems and design personalized itineraries for unforgettable memories.`,
        showSlantedLine: true,
      },
      {
        key: 'slide2',
        image: cityTravel,
        title: 'Discover New Horizons',
        subtitle: 'Explore with AI-curated insights',
        description: `Uncover breathtaking destinations and immerse yourself in vibrant cultures.
Our AI delivers tailored recommendations to elevate your travel experience.`,
      },
      {
        key: 'slide3',
        image: beachAdventure,
        title: 'Experience Personalized Adventures',
        subtitle: 'Every detail meticulously crafted',
        description: `From flights to local secrets, our AI takes care of every aspect.
Dive into a journey designed uniquely for you.`,
      },
    ];

    this.state = {
      currentSlideIndex: 0,
    };

    this.scrollViewRef = React.createRef();
    this.scrollX = new Animated.Value(0);
  }

  handleScrollEnd = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    this.setState({ currentSlideIndex: currentIndex });
  };

  handleSkip = () => {
    const lastIndex = this.slides.length - 1;
    if (this.scrollViewRef.current) {
      this.scrollViewRef.current.scrollTo({
        x: width * lastIndex,
        y: 0,
        animated: true,
      });
    }
  };

  handleGetStarted = () => {
    this.props.navigation.replace('Login');
  };

  renderSlide = (slide, index) => {
    return (
      <View style={styles.slide} key={slide.key}>
        <View style={styles.imageContainer}>
          <Image source={slide.image} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.textContent}>
          <View style={{ marginBottom: 10, position: 'relative' }}>
            <Text style={styles.title}>
              {slide.key === 'slide1'
                ? 'Your journey, '
                : ''
              }
              <Text style={styles.highlight}>
                {slide.key === 'slide1'
                  ? 'intelligently'
                  : slide.title.split(' ')[0]
                }
              </Text>
              {slide.key === 'slide1'
                ? ' planned'
                : ' ' + slide.title.split(' ').slice(1).join(' ')
              }
            </Text>

            {slide.showSlantedLine && (
 <View style={styles.arcContainer}>
<Svg
    width="220"
    height="60"
    viewBox="0 0 80 50"
    style={styles.arcStyle}
>
    <Path
        d="M0,20 C20,5 60,5 80,20"
        fill="none"
        stroke="#FF6E2C"
        strokeWidth={4}
        strokeLinecap="round"
    />
</Svg>
</View>
            )}
          </View>

          {slide.subtitle && (
            <Text style={styles.subtitle}>
              {slide.subtitle}
            </Text>
          )}

          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </View>
    );
  };

  render() {
    const { currentSlideIndex } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.skipButton} onPress={this.handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <ScrollView
          ref={this.scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this.handleScrollEnd}
        >
          {this.slides.map((slide, i) => this.renderSlide(slide, i))}
        </ScrollView>

        <View style={styles.dashesContainer}>
          {this.slides.map((_, i) => {
            const isActive = i === currentSlideIndex;
            return (
              <View
                key={'dash' + i}
                style={[styles.dash, isActive && styles.activeDash]}
              />
            );
          })}
        </View>

        {currentSlideIndex === this.slides.length - 1 && (
          <TouchableOpacity style={styles.button} onPress={this.handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default OnboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Roboto',
  },
  slide: {
    width: width,
    height: height,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: height * 0.55,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContent: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  highlight: {
    color: '#FF6E2C',
    fontFamily: 'Roboto',
  },
  arcContainer: {
    position: 'absolute',
    left: '25%',
    top: 25,
  },
  arcStyle: {
    shadowColor: '#FF6E2C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Roboto',
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  dashesContainer: {
    position: 'absolute',
    bottom: height * 0.18,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dash: {
    width: 20,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    marginHorizontal: 4,
  },
  activeDash: {
    width: 30,
    backgroundColor: '#00ADEF',
  },
  button: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: width * 0.8,
    height: 50,
    backgroundColor: '#00ADEF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});