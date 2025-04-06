// src/screens/SplashScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

// استيراد الإطارات
import frame1 from '../../../assets/splash/frame1.jpg';
import frame2 from '../../../assets/splash/frame2.jpg';
import frame3 from '../../../assets/splash/frame3.jpg';
import frame4 from '../../../assets/splash/frame4.jpg';
import frame5 from '../../../assets/splash/frame5.jpg';
import frame6 from '../../../assets/splash/frame6.jpg';
import frame7 from '../../../assets/splash/frame7.jpg';

const { width, height } = Dimensions.get('window');

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);

    // جميع الإطارات التي نريد تراكُمها
    this.frames = [
      frame1,
      frame2,
      frame3,
      frame4,
      frame5,
      frame6,
      frame7,
    ];

    // مصفوفة من Animated.Value لكل إطار
    // نجعل أول إطار مرئيًا من البداية (1)، والبقية 0
    this.framesOpacity = this.frames.map((_, index) =>
      new Animated.Value(index === 0 ? 1 : 0)
    );

    // متغير تحكم بظهور نص "Al Daleel"
    this.textOpacity = new Animated.Value(0);

    this.state = {
      totalDuration: 0, // فقط للاحتفاظ بمجموع الزمن (اختياري)
    };
  }

  componentDidMount() {
    // سنشغل الأنيميشن لكل إطار بالتتابع
    // بعد كل 400 مللي ثانية نجعل الإطار التالي يظهر
    this.framesOpacity.forEach((animValue, i) => {
      if (i > 0) {
        // جدولة تشغيل الأنيميشن لكل إطار بعد 400 * i مللي ثانية
        setTimeout(() => {
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,     // مدة الفيد
            useNativeDriver: true,
          }).start();
        }, i * 400);
      }

      // عندما يصل المؤشر إلى الإطار الثاني (i==1) نبدأ بإظهار النص
      if (i === 1) {
        setTimeout(() => {
          Animated.timing(this.textOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }, i * 400);
      }
    });

    // احسب الزمن الكلي: (عدد الإطارات -1) * 400 + مدة آخر أنيميشن
    const totalDuration = (this.framesOpacity.length - 1) * 400 + 600;
    this.setState({ totalDuration });

    // الانتقال لشاشة Onboard بعد (الزمن الكلي + 1000 مللي ثانية) مثلاً
    // لإتاحة وقت إضافي لمشاهدة الشكل النهائي
    this.timeout = setTimeout(() => {
      this.props.navigation.replace('Onboard');
    }, totalDuration + 1000);
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  render() {
    return (
      <View style={styles.container}>
        {/* 
          سنرسم جميع الإطارات فوق بعضها (Position: absolute)،
          بحيث لا نخفي الإطار الأول عند ظهور الثاني، إلخ.
        */}
        {this.frames.map((frame, i) => (
          <Animated.Image
            key={i}
            source={frame}
            style={[
              styles.frameImage,
              { opacity: this.framesOpacity[i] },
            ]}
            resizeMode="contain"
          />
        ))}

        {/* النص يظهر مع الفريم الثاني عبر textOpacity */}
        <Animated.Text
          style={[
            styles.text,
            { opacity: this.textOpacity },
          ]}
        >
          Al Daleel
        </Animated.Text>
      </View>
    );
  }
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00ADEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameImage: {
    width: width * 1.3,  // جعل الصورة أكبر من الشاشة
    height: height * 1.3,
    position: 'absolute', // تكديس جميع الإطارات فوق بعض
  },
  text: {
    fontSize: width * 0.07,
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: height * 0.1,
  },
});
