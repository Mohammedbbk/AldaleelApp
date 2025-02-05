// src/screens/OnboardScreen.js
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

// أمثلة على صور/شرائح مختلفة
import waveBoat from '../../assets/onboard/waveBoat.png';
import cityTravel from '../../assets/onboard/cityTravel.png';
import beachAdventure from '../../assets/onboard/beachAdventure.png';

const { width, height } = Dimensions.get('window');

class OnboardScreen extends React.Component {
  constructor(props) {
    super(props);

    // الشرائح مع عناوين، نصوص فرعية (Subtitle)، أوصاف وصور محدثة
    this.slides = [
      {
        key: 'slide1',
        image: waveBoat,
        title: 'Your journey, intelligently planned',
        subtitle: 'Harness AI to craft your perfect escape',
        description: `Embark on a futuristic travel adventure. 
Let AI uncover hidden gems and design personalized itineraries for unforgettable memories.`,
        showSlantedLine: true, // تُستخدم فقط في الشريحة الأولى
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

    // مرجع للتحكم في الـ ScrollView (للانتقال إلى الشريحة الأخيرة عند الضغط على Skip)
    this.scrollViewRef = React.createRef();

    // قيمة متحركة لاستخدامها لاحقًا إن أردت أي تأثيرات (غير مستخدمة حالياً)
    this.scrollX = new Animated.Value(0);
  }

  // عند انتهاء السحب نحدّد الشريحة الحالية
  handleScrollEnd = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    this.setState({ currentSlideIndex: currentIndex });
  };

  // تخطي إلى الشريحة الأخيرة
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

  // زر Get Started في الشريحة الأخيرة
  handleGetStarted = () => {
    // مثال: انتقال إلى شاشة Login
    this.props.navigation.replace('Login');
  };

  renderSlide = (slide, index) => {
    return (
      <View style={styles.slide} key={slide.key}>
        {/* الحاوية العلوية للصورة مع حواف سفلية مستديرة */}
        <View style={styles.imageContainer}>
          <Image source={slide.image} style={styles.image} resizeMode="cover" />
        </View>

        {/* المساحة المتبقية للمحتوى النصي */}
        <View style={styles.textContent}>
          {/* العنوان مع تأثير تمييز الكلمة */}
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

            {/* في حالة الشريحة الأولى، إضافة الشرطة المائلة تحت كلمة intelligently */}
            {slide.showSlantedLine && (
              <View style={styles.slantedLine} />
            )}
          </View>

          {/* النص الفرعي */}
          {slide.subtitle && (
            <Text style={styles.subtitle}>
              {slide.subtitle}
            </Text>
          )}

          {/* الوصف النصي */}
          <Text style={styles.description}>{slide.description}</Text>
        </View>
      </View>
    );
  };

  render() {
    const { currentSlideIndex } = this.state;
    return (
      <View style={styles.container}>
        {/* زر Skip في أعلى اليمين */}
        <TouchableOpacity style={styles.skipButton} onPress={this.handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* ScrollView أفقي يعرض الشرائح */}
        <ScrollView
          ref={this.scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={this.handleScrollEnd}
        >
          {this.slides.map((slide, i) => this.renderSlide(slide, i))}
        </ScrollView>

        {/* المؤشرات (Dashes) في الأسفل */}
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

        {/* زر Get Started يظهر فقط في الشريحة الأخيرة */}
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
  // زر Skip
  skipButton: {
    position: 'absolute',
    top: 50, // عدّلها حسب شكل الـ StatusBar أو الـ Notch
    right: 20,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Helvetica',
  },
  // كل شريحة تملأ الشاشة
  slide: {
    width: width,
    height: height,
    backgroundColor: '#fff',
  },
  // الصورة العلوية
  imageContainer: {
    width: '100%',
    height: height * 0.45,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  // منطقة النص
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
    fontFamily: 'Helvetica',
  },
  highlight: {
    color: '#FF6E2C', // برتقالي
    fontFamily: 'Helvetica',
  },
  // الشرطة المائلة تحت كلمة "intelligently" (تم رفعها قليلاً)
  slantedLine: {
    position: 'absolute',
    width: 75,
    height: 2,
    backgroundColor: '#FF6E2C',
    left: '27%',
    top: 22, // رفعها لأعلى قليلاً
    transform: [{ rotate: '10deg' }],
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
    fontFamily: 'Helvetica',
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },
  // الشرطات في الأسفل
  dashesContainer: {
    position: 'absolute',
    bottom: height * 0.12,
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
  // زر Get Started
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
    fontFamily: 'Helvetica',
  },
});
