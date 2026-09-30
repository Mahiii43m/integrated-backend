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
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import T from '../../components/T';
import { LogoSVG } from '../../components/Branding';

const { width, height } = Dimensions.get('window');
const ONBOARDING_COMPLETED_KEY = 'has_completed_onboarding';

const AnimatedFlatList = Animated.createAnimatedComponent(require('react-native').FlatList);

const Icon = ({ name, size = 56, color = '#ffffff' }) => {
  let path = '';
  if (name === 'chat') path = 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z M8 10h.01 M12 10h.01 M16 10h.01';
  if (name === 'people') path = 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0-4-4 4 4 0 0 0 4 4z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75';
  if (name === 'shield') path = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

// --- Enhanced phone ---
const PhoneGraphic = ({ floatAnim }) => {
  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View style={{ transform: [{ translateY: floatY }] }}>
      <Svg width={150} height={290} viewBox="0 0 200 380" fill="none">
        {/* Shadow under phone */}
        <Rect x="8" y="12" width="192" height="372" rx="28" fill="#0f2238" opacity="0.08" />

        {/* Phone shell */}
        <Rect x="4" y="4" width="192" height="372" rx="28" fill="#ffffff" stroke="#DD984B" strokeWidth="3" />
        <Rect x="11" y="11" width="178" height="358" rx="24" fill="#ffffff" />

        {/* Status bar */}
        <Rect x="22" y="22" width="14" height="4" rx="2" fill="#0f2238" opacity="0.7" />
        <Rect x="162" y="22" width="16" height="4" rx="2" fill="#0f2238" opacity="0.5" />

        {/* Header */}
        <Path d="M28 46 L22 52 L28 58" stroke="#0f2238" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Rect x="42" y="46" width="42" height="7" rx="3.5" fill="#0f2238" />
        <Rect x="42" y="58" width="28" height="4" rx="2" fill="#DD984B" />
        <Rect x="154" y="46" width="14" height="10" rx="2" fill="#0f2238" opacity="0.7" />
        <Rect x="172" y="46" width="12" height="10" rx="2" fill="#0f2238" opacity="0.7" />

        <Rect x="20" y="76" width="160" height="1" fill="#e2e8f0" />

        {/* Bubbles */}
        <Rect x="20" y="92" width="120" height="36" rx="18" fill="#0f2238" />
        <Rect x="34" y="104" width="92" height="6" rx="3" fill="#ffffff" opacity="0.9" />
        <Rect x="34" y="116" width="60" height="5" rx="2.5" fill="#ffffff" opacity="0.6" />

        <Rect x="62" y="138" width="122" height="40" rx="20" fill="#DD984B" />
        <Rect x="76" y="151" width="94" height="6" rx="3" fill="#ffffff" />
        <Rect x="76" y="163" width="62" height="5" rx="2.5" fill="#ffffff" opacity="0.7" />

        <Rect x="20" y="188" width="106" height="36" rx="18" fill="#0f2238" />
        <Rect x="34" y="200" width="76" height="6" rx="3" fill="#ffffff" opacity="0.9" />

        <Rect x="88" y="234" width="96" height="36" rx="18" fill="#DD984B" />
        <Rect x="102" y="246" width="68" height="6" rx="3" fill="#ffffff" />

        <Rect x="20" y="280" width="94" height="32" rx="16" fill="#0f2238" />
        <Rect x="34" y="291" width="64" height="5" rx="2.5" fill="#ffffff" opacity="0.9" />
        <Rect x="34" y="300" width="42" height="5" rx="2.5" fill="#ffffff" opacity="0.55" />

        {/* Input bar */}
        <Rect x="18" y="324" width="140" height="30" rx="15" fill="#f1f5f9" />
        <Rect x="32" y="335" width="70" height="7" rx="3.5" fill="#94a3b8" opacity="0.5" />
        <Circle cx="174" cy="339" r="15" fill="#DD984B" />
        <Path d="M168 339 L174 333 L180 339 M174 333 L174 345" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        <Rect x="84" y="364" width="32" height="3" rx="1.5" fill="#cbd5e1" />
      </Svg>
    </Animated.View>
  );
};

// --- Animated pagination dot ---
const Dot = ({ scrollX, index }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const dotWidth = scrollX.interpolate({
    inputRange,
    outputRange: [6, 24, 6],
    extrapolate: 'clamp',
  });
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.3, 1, 0.3],
    extrapolate: 'clamp',
  });
  return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} />;
};

// --- Background decorative dots ---
const BackgroundDots = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={[styles.bgDot, { top: 80, right: 30, opacity: 0.15 }]} />
    <View style={[styles.bgDot, { top: 160, left: 20, opacity: 0.1 }]} />
    <View style={[styles.bgDot, { top: 240, right: 60, opacity: 0.12 }]} />
    <View style={[styles.bgDot, { top: 320, left: 60, opacity: 0.08 }]} />
  </View>
);

export default function OnboardingScreen({ navigation, onFinish }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Entry animations
  const entryFade = useRef(new Animated.Value(0)).current;
  const entryTranslate = useRef(new Animated.Value(20)).current;

  // Phone float
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Icon pulse
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animation — fade + slide up
    Animated.parallel([
      Animated.timing(entryFade, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.timing(entryTranslate, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    // Phone float loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Icon pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2600,
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
      line1: getText('onboarding.slide1.line1', 'WELCOME TO'),
      line2: getText('onboarding.slide1.line2', 'ORBIT CHAT'),
      desc: getText('onboarding.slide1.desc', 'The official secure messaging app for SSGI staff.'),
      cardTitle: getText('onboarding.slide1.cardTitle', 'CONNECT'),
      cardDesc: getText('onboarding.slide1.cardDesc', 'Instant messaging for individuals and teams'),
      icon: 'chat',
      layout: 'phone',
    },
    {
      id: 'slide2',
      line1: getText('onboarding.slide2.line1', 'WORK'),
      line2: getText('onboarding.slide2.line2', 'AS ONE'),
      desc: getText('onboarding.slide2.desc', 'Reach every colleague, department, and research team in one place.'),
      cardTitle: getText('onboarding.slide2.cardTitle', 'COLLABORATE'),
      cardDesc: getText('onboarding.slide2.cardDesc', 'Group channels for every team and division'),
      icon: 'people',
      layout: 'icon',
    },
    {
      id: 'slide3',
      line1: getText('onboarding.slide3.line1', 'SECURE'),
      line2: getText('onboarding.slide3.line2', 'BY DEFAULT'),
      desc: getText('onboarding.slide3.desc', 'End-to-end encryption for files, voice notes, and documents.'),
      cardTitle: getText('onboarding.slide3.cardTitle', 'PROTECT'),
      cardDesc: getText('onboarding.slide3.cardDesc', 'Maximum confidentiality for all communications'),
      icon: 'shield',
      layout: 'icon',
    },
  ];

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (e) {}
    if (onFinish) onFinish();
    else if (navigation) navigation.replace('Login');
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
      outputRange: [width * 0.15, 0, -width * 0.15],
      extrapolate: 'clamp',
    });

    const isPhone = item.layout === 'phone';

    return (
      <View style={styles.slideContainer}>
        <BackgroundDots />

        {/* --- TOP HALF: white area, phone + text --- */}
        <View style={styles.topHalf}>
          <Animated.View
            style={[
              styles.textBlock,
              {
                opacity: Animated.multiply(textOpacity, entryFade),
                transform: [{ translateY: entryTranslate }, { translateX: textTranslateX }],
              },
            ]}
          >
            <T style={styles.headlineSmall}>{item.line1}</T>
            <T style={styles.headlineBig}>{item.line2}</T>
            <T style={styles.description}>{item.desc}</T>
          </Animated.View>

          {isPhone && (
            <Animated.View
              style={[
                styles.phoneWrap,
                {
                  opacity: Animated.multiply(textOpacity, entryFade),
                  transform: [{ translateY: entryTranslate }],
                },
              ]}
            >
              <PhoneGraphic floatAnim={floatAnim} />
            </Animated.View>
          )}

          {!isPhone && (
            <Animated.View
              style={[
                styles.iconSection,
                {
                  opacity: Animated.multiply(textOpacity, entryFade),
                  transform: [{ translateY: entryTranslate }],
                },
              ]}
            >
              <View style={styles.outerRing} />
              <View style={styles.midRing} />
              <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulse }] }]}>
                <Icon name={item.icon} size={56} />
              </Animated.View>
            </Animated.View>
          )}
        </View>

        {/* --- BOTTOM HALF: wave + card --- */}
        <View style={styles.bottomHalf}>
          <Svg
            height="100"
            width={width}
            style={styles.waveSvg}
            viewBox={`0 0 ${width} 100`}
            preserveAspectRatio="none"
          >
            <Path
              d={`M0,42 C${width * 0.35},95 ${width * 0.65},5 ${width},38 L${width},100 L0,100 Z`}
              fill="#0f2238"
            />
            <Path
              d={`M0,34 C${width * 0.35},87 ${width * 0.65},-3 ${width},30`}
              stroke="#DD984B"
              strokeWidth="3"
              fill="none"
            />
          </Svg>

          <Animated.View
            style={[
              styles.cardSection,
              {
                opacity: Animated.multiply(textOpacity, entryFade),
                transform: [{ translateY: entryTranslate }],
              },
            ]}
          >
            <T style={styles.cardTitle}>{item.cardTitle}</T>
            <View style={styles.cardLine} />
            <T style={styles.cardDesc}>{item.cardDesc}</T>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Animated.View style={[styles.header, { opacity: entryFade }]}>
        <View style={styles.logoRow}>
          <LogoSVG width={42} height={42} />
          <T style={styles.appName}>ORBIT CHAT</T>
        </View>
        <TouchableOpacity onPress={handleFinish} style={styles.skipButton} activeOpacity={0.7}>
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

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} />
          ))}
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
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
  container: { flex: 1, backgroundColor: '#ffffff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 8,
    paddingBottom: 4,
    backgroundColor: '#ffffff',
    zIndex: 20,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  appName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#102a43',
    letterSpacing: 2.2,
    marginLeft: 10,
  },
  skipButton: { paddingHorizontal: 4, paddingVertical: 6 },
  skipText: { fontSize: 14, fontWeight: '600', color: '#627d98' },

  flatList: { flex: 1 },
  slideContainer: { width: width, flex: 1, position: 'relative' },

  // Background decoration
  bgDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DD984B',
  },

  // Top half
  topHalf: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    position: 'relative',
  },
  textBlock: {
    width: '55%',
    zIndex: 5,
  },
  headlineSmall: {
    fontSize: 17,
    fontWeight: '700',
    color: '#627d98',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  headlineBig: {
    fontSize: 34,
    fontWeight: '900',
    color: '#DD984B',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  description: {
    fontSize: 13.5,
    color: '#627d98',
    lineHeight: 20,
    marginTop: 12,
  },

  phoneWrap: {
    position: 'absolute',
    right: -8,
    top: 60,
    zIndex: 3,
  },

  iconSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DD984B',
    opacity: 0.06,
  },
  midRing: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 72.5,
    backgroundColor: '#DD984B',
    opacity: 0.14,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DD984B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DD984B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },

  // Bottom half
  bottomHalf: {
    height: 320,
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
    backgroundColor: '#0f2238',
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 70,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardLine: {
    width: 34,
    height: 2.5,
    backgroundColor: '#DD984B',
    borderRadius: 1.25,
    marginBottom: 14,
  },
  cardDesc: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0f2238',
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 26 : 20,
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
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 26,
    shadowColor: '#DD984B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1.8,
  },
});
