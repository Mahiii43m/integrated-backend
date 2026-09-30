import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../firebase/context/ThemeContext';
import { LogoSVG as Logo } from '../../components/Branding';
import T from '../../components/T';

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'chevron-back-outline') path = 'M15 19l-7-7 7-7';
  if (name === 'globe-outline') path = 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z M12 2v20 M2 12h20';
  if (name === 'rocket-outline') path = 'M4.5 16.5c0 0 4.5 1.5 7.5-3s3-7.5 3-7.5-4.5-1.5-7.5 3-3 7.5-3 7.5z M8 13l-3 3 M11 10l3-3';
  if (name === 'play-circle-outline') path = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M10 8l6 4-6 4V8z';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

export default function AboutScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isDark = theme === 'dark';
  const isAmharic = i18n.language === 'am' || i18n.language?.startsWith('am');

  const bgColor = colors.background;
  const textColor = colors.text;
  const secondaryText = colors.rowTime;
  const borderColor = colors.border;
  const cardColor = colors.rowBg;
  const brandColor = colors.primary;
  const goldAccent = '#de994a';

  const DIRECTORATES = [
    { title: isAmharic ? 'የጠፈር ሳይንስና አስትሮኖሚ' : 'Space Science & Astronomy', desc: isAmharic ? 'የእንጦጦ ኦብዘርቫቶሪ እና የከዋክብት ምርምር' : 'Entoto Observatory & Astrophysics Research' },
    { title: isAmharic ? 'ጂኦስፓሻል እና ሪሞት ሴንሲንግ' : 'Geospatial & Remote Sensing', desc: isAmharic ? 'የመሬት ምልከታ እና ዲጂታል አድራሻ (eDAS)' : 'Earth Observation & Digital Addressing (eDAS)' },
    { title: isAmharic ? 'የሳተላይት ሲስተምስ እና ኢንጂነሪንግ' : 'Satellite Systems & Engineering', desc: isAmharic ? 'የሳተላይት ልማት እና ቴሌሜትሪ ክትትል' : 'Satellite Development & Telemetry Tracking' },
    { title: isAmharic ? 'ጂኦደሲ እና CORS ኔትወርክ' : 'Geodetic CORS Network', desc: isAmharic ? 'አገር አቀፍ የሳተላይት አሰሳ ኔትወርክ' : 'National Satellite CORS Positioning Network' },
  ];

  const handleReplayOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('has_completed_onboarding');
      navigation.navigate('Onboarding');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not open onboarding.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <T style={[styles.headerTitle, { color: textColor }]}>{t('settings.about')}</T>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroBanner, { backgroundColor: isDark ? '#0f2238' : brandColor }]}>
          <View style={styles.heroContent}>
            <Logo width={120} height={120} />
            <T style={[styles.appName, { color: '#ffffff' }]}>Orbit Chat</T>
            <T style={[styles.appVersion, { color: 'rgba(255,255,255,0.85)' }]}>v1.0.0 • SSGI Official App</T>
          </View>
        </View>

        <View style={styles.taglineContainer}>
          <T style={[styles.tagline, { color: goldAccent }]}>
            {isAmharic ? 'ከምድር ወደ ጠፈር — Space Science & Geospatial Institute' : 'Empowering Nations Through Space & Geospatial Technology'}
          </T>
        </View>

        {/* About SSGI */}
        <View style={[styles.aboutCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.aboutTitle, { color: textColor }]}>{isAmharic ? 'ስለ SSGI' : 'About SSGI'}</T>
          <T style={[styles.aboutDescription, { color: secondaryText }]}>
            {isAmharic
              ? 'የህዋ ሳይንስና ጂኦስፓሻል ኢንስቲትዩት (SSGI) በኢትዮጵያ በ2014 ዓ.ም የተቋቋመ የመንግስት ተቋም ሲሆን የጠፈር ሳይንስን፣ የሳተላይት ቴክኖሎጂን እና የጂኦስፓሻል መረጃዎችን በምርምርና በፈጠራ ያጎለብታል።'
              : 'The Space Science and Geospatial Institute (SSGI) is Ethiopia\'s premier institution established in 2022, leading Africa\'s space, satellite, and geospatial sector through research, innovation, and collaboration.'}
          </T>
          <TouchableOpacity style={[styles.websiteButton, { backgroundColor: brandColor }]} onPress={() => Linking.openURL('https://ssgi.gov.et/')}>
            <Icon name="globe-outline" size={18} color="#ffffff" />
            <T style={[styles.buttonText, { marginLeft: 8 }]}>{isAmharic ? 'የ SSGI ድህረ ገጽን ይጎብኙ' : 'Visit Official SSGI Website'}</T>
          </TouchableOpacity>
        </View>

        {/* SSGI Core Directorates */}
        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.sectionLabel, { color: secondaryText }]}>🏛️ {isAmharic ? 'የSSGI ዋና ዳይሬክቶሬቶች' : 'SSGI Core Directorates'}</T>
          {DIRECTORATES.map((item, index) => (
            <View key={index} style={[styles.dirRow, index < DIRECTORATES.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
              <Icon name="rocket-outline" size={18} color={goldAccent} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <T style={[styles.dirTitle, { color: textColor }]}>{item.title}</T>
                <T style={[styles.dirDesc, { color: secondaryText }]}>{item.desc}</T>
              </View>
            </View>
          ))}
        </View>

        {/* Replay Onboarding Button */}
        <TouchableOpacity
          style={[styles.onboardingBtn, { backgroundColor: cardColor, borderColor: goldAccent }]}
          onPress={handleReplayOnboarding}
          activeOpacity={0.8}
        >
          <Icon name="play-circle-outline" size={20} color={goldAccent} />
          <T style={[styles.onboardingBtnText, { color: goldAccent, marginLeft: 8 }]}>
            {isAmharic ? 'የመግቢያ መመሪያዎችን እንደገና ማየት' : 'Replay Onboarding Slides'}
          </T>
        </TouchableOpacity>

        <View style={styles.footer}>
          <T style={[styles.copyrightText, { color: secondaryText }]}>© 2026 Space Science and Geospatial Institute (SSGI). All rights reserved.</T>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8, paddingBottom: 4 },
  backButton: { padding: 4, width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  heroBanner: { paddingVertical: 28, borderRadius: 24, alignItems: 'center', marginBottom: 16 },
  heroContent: { alignItems: 'center' },
  appName: { fontSize: 28, fontWeight: '800', marginTop: 10 },
  appVersion: { fontSize: 13, marginTop: 4 },
  taglineContainer: { paddingVertical: 12, alignItems: 'center' },
  tagline: { fontSize: 14, fontWeight: '700', textAlign: 'center', letterSpacing: 0.3 },
  aboutCard: { borderRadius: 16, borderWidth: 1, padding: 18, marginBottom: 16 },
  aboutTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  aboutDescription: { fontSize: 14, lineHeight: 22 },
  websiteButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 12, marginTop: 16 },
  buttonText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12 },
  dirRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  dirTitle: { fontSize: 14, fontWeight: '600' },
  dirDesc: { fontSize: 12, opacity: 0.7, marginTop: 2 },
  onboardingBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  onboardingBtnText: { fontSize: 15, fontWeight: '600' },
  footer: { alignItems: 'center', marginTop: 16 },
  copyrightText: { fontSize: 11, opacity: 0.6, textAlign: 'center' },
});
