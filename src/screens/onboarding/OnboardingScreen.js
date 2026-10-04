import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
  Easing,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import T from '../../components/T';
import { LogoSVG } from '../../components/Branding';

import PhoneGraphicSvg from '../../assets/images/onboarding-phone.svg';
import CollaborationGraphicSvg from '../../assets/images/onboarding-collaboration.svg';
import SecurityGraphicSvg from '../../assets/images/onboarding-security.svg';
import BadgeChatSvg from '../../assets/images/badge-chat.svg';
import BadgePeopleSvg from '../../assets/images/badge-people.svg';
import BadgeShieldSvg from '../../assets/images/badge-shield.svg';
import OnboardingWaveSvg from '../../assets/images/onboarding-wave.svg';

const { width } = Dimensions.get('window');
const ONBOARDING_COMPLETED_KEY = 'has_completed_onboarding';

const AnimatedFlatList = Animated.createAnimatedComponent(require('react-native').FlatList);

// --- Badge Icon for Card Badge Circle ---
const BadgeIcon = ({ name }) => {
  if (name === 'chat') return <BadgeChatSvg width={24} height={24} />;
  if (name === 'people') return <BadgePeopleSvg width={24} height={24} />;
  if (name === 'shield') return <BadgeShieldSvg width={24} height={24} />;
  return <BadgeChatSvg width={24} height={24} />;
};

// --- Tilted Smartphone Graphic for Slide 1 ---
const PhoneGraphic = ({ floatAnim }) => {
  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={{
        transform: [{ rotate: '-7deg' }, { translateY: floatY }],
      }}
    >
      <PhoneGraphicSvg width={150} height={260} />
    </Animated.View>
  );
};

// --- Team Collaboration Orbit Graphic for Slide 2 ---
const CollaborationGraphic = ({ pulseAnim }) => {
  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.04],
  });

  return (
    <Animated.View style={{ alignItems: 'center', justifyContent: 'center', transform: [{ scale }] }}>
      <CollaborationGraphicSvg width={185} height={185} />
    </Animated.View>
  );
};

// --- Enterprise Security Graphic for Slide 3 ---
const SecurityGraphic = ({ pulseAnim }) => {
  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.04],
  });

  return (
    <Animated.View style={{ alignItems: 'center', justifyContent: 'center', transform: [{ scale }] }}>
      <SecurityGraphicSvg width={185} height={185} />
    </Animated.View>
  );
};

// --- Animated Pagination Dot ---
const Dot = ({ scrollX, index }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const dotWidth = scrollX.interpolate({
    inputRange,
    outputRange: [7, 26, 7],
    extrapolate: 'clamp',
  });
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.35, 1, 0.35],
    extrapolate: 'clamp',
  });
  return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} />;
};

export default function OnboardingScreen({ navigation, onFinish }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Entry animations
  const entryFade = useRef(new Animated.Value(0)).current;
  const entryTranslate = useRef(new Animated.Value(20)).current;

  // Phone float & Pulse loops
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entryFade, { toValue: 1, duration: 750, useNativeDriver: false }),
      Animated.timing(entryTranslate, {
        toValue: 0,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    // Floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const getText = (key, fallback) => {
    const val = t(key);
    if (!val || val === key) return fallback;
    return val;
  };

  const SLIDES = [
    {
      id: 'slide1',
      title: getText('onboarding.slide1.title', 'Welcome to Orbit Chat'),
      desc: getText('onboarding.slide1.desc', 'The official secure workspace for SSGI staff and researchers.'),
      cardTitle: getText('onboarding.slide1.cardTitle', 'CONNECT'),
      cardDesc: getText('onboarding.slide1.cardDesc', 'Instant messaging and voice notes built for individuals and teams.'),
      icon: 'chat',
      layout: 'phone',
    },
    {
      id: 'slide2',
      title: getText('onboarding.slide2.title', 'Collaborate Seamlessly'),
      desc: getText('onboarding.slide2.desc', 'Dedicated group channels for space science and field operations.'),
      cardTitle: getText('onboarding.slide2.cardTitle', 'COLLABORATE'),
      cardDesc: getText('onboarding.slide2.cardDesc', 'Group channels for space science, CORS network, and geospatial teams.'),
      icon: 'people',
      layout: 'collaboration',
    },
    {
      id: 'slide3',
      title: getText('onboarding.slide3.title', 'Enterprise Security'),
      desc: getText('onboarding.slide3.desc', 'End-to-end encryption for files, documents, and messaging.'),
      cardTitle: getText('onboarding.slide3.cardTitle', 'PROTECT'),
      cardDesc: getText('onboarding.slide3.cardDesc', 'Maximum confidentiality and strict data privacy for all communications.'),
      icon: 'shield',
      layout: 'security',
    },
  ];

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (e) {}

    if (onFinish) {
      onFinish();
    } else if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation) {
      navigation.replace('Login');
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderSlide = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const textOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const textTranslateX = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.12, 0, -width * 0.12],
      extrapolate: 'clamp',
    });

    const isPhone = item.layout === 'phone';

    return (
      <View style={styles.slideContainer}>
        {/* --- TOP HALF: Headline + Tilted Graphic --- */}
        <View style={styles.topHalf}>
          <View style={styles.topContentRow}>
            <Animated.View
              style={[
                styles.textBlock,
                !isPhone && styles.textBlockFull,
                {
                  opacity: Animated.multiply(textOpacity, entryFade),
                  transform: [{ translateY: entryTranslate }, { translateX: textTranslateX }],
                },
              ]}
            >
              <T style={styles.headlineTitle}>{item.title}</T>
              <T style={styles.description}>{item.desc}</T>
            </Animated.View>

            {isPhone && (
              <Animated.View
                style={[
                  styles.phoneWrap,
                  {
                    opacity: Animated.multiply(textOpacity, entryFade),
                  },
                ]}
              >
                <PhoneGraphic floatAnim={floatAnim} />
              </Animated.View>
            )}
          </View>

          {!isPhone && (
            <Animated.View
              style={[
                styles.centerGraphicWrap,
                {
                  opacity: Animated.multiply(textOpacity, entryFade),
                  transform: [{ translateY: entryTranslate }],
                },
              ]}
            >
              {item.layout === 'collaboration' ? (
                <CollaborationGraphic pulseAnim={pulseAnim} />
              ) : (
                <SecurityGraphic pulseAnim={pulseAnim} />
              )}
            </Animated.View>
          )}
        </View>

        {/* --- BOTTOM HALF: Refined Smooth Wave Curves + Feature Card --- */}
        <View style={styles.bottomHalf}>
          <OnboardingWaveSvg
            height={120}
            width={width}
            style={styles.waveSvg}
            preserveAspectRatio="none"
          />

          <Animated.View
            style={[
              styles.cardSection,
              {
                opacity: Animated.multiply(textOpacity, entryFade),
                transform: [{ translateY: entryTranslate }],
              },
            ]}
          >
            {/* Card Main Title */}
            <T style={styles.cardTitle}>{item.cardTitle}</T>

            {/* Circular Gold Icon Badge */}
            <View style={styles.badgeCircle}>
              <BadgeIcon name={item.icon} />
            </View>

            {/* Card Description */}
            <T style={styles.cardDesc}>{item.cardDesc}</T>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Navigation Header */}
      <Animated.View style={[styles.header, { opacity: entryFade }]}>
        <View style={styles.logoContainer}>
          <LogoSVG width={42} height={42} />
          <T style={styles.appName}>ORBIT CHAT</T>
        </View>

        <TouchableOpacity onPress={handleFinish} style={styles.skipButton} activeOpacity={0.75}>
          <T style={styles.skipText}>{getText('onboarding.skip', 'Skip')}</T>
        </TouchableOpacity>
      </Animated.View>

      <AnimatedFlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        style={styles.flatList}
      />

      {/* Footer controls: Dots & Next CTA */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.88}>
          <T style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1
              ? getText('onboarding.getStarted', 'GET STARTED')
              : getText('onboarding.next', 'NEXT')}
          </T>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 8,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
    zIndex: 20,
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  appName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#102A43',
    letterSpacing: 2,
    marginTop: 2,
  },
  skipButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skipText: { fontSize: 14, fontWeight: '700', color: '#627D98' },

  flatList: { flex: 1 },
  slideContainer: { width: width, flex: 1, position: 'relative' },

  topHalf: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 10,
    position: 'relative',
  },
  topContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  textBlock: {
    width: '56%',
    zIndex: 5,
  },
  textBlockFull: {
    width: '100%',
  },
  headlineSub: {
    fontSize: 13,
    fontWeight: '800',
    color: '#627D98',
    letterSpacing: 2,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  headlineTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#DD984B',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  headlineTagline: {
    fontSize: 12,
    fontWeight: '800',
    color: '#102A43',
    letterSpacing: 1.8,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginTop: 10,
  },

  phoneWrap: {
    position: 'absolute',
    right: -10,
    top: 2,
    zIndex: 10,
  },

  centerGraphicWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  bottomHalf: {
    height: 310,
    position: 'relative',
  },
  waveSvg: {
    position: 'absolute',
    top: -60,
    left: 0,
    right: 0,
  },
  cardSection: {
    flex: 1,
    backgroundColor: '#0F2238',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 70,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 12,
    textAlign: 'center',
  },
  badgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DD984B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#DD984B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.88)',
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: '600',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F2238',
    paddingHorizontal: 26,
    paddingBottom: Platform.OS === 'ios' ? 26 : 18,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dots: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: '#DD984B',
  },
  nextButton: {
    backgroundColor: '#DD984B',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 24,
    shadowColor: '#DD984B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1.5,
  },
});