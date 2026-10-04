import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import T from '../../components/T';
import { useTheme } from '../../firebase/context/ThemeContext';

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'chevron-back-outline') path = 'M15 19l-7-7 7-7';
  if (name === 'checkmark-outline') path = 'M5 13l4 4L19 7';
  if (name === 'musical-note-outline') path = 'M9 18V5l12-2v13 M9 9l12-2 M9 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M21 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

const SOUNDS = [
  { id: 'cosmic', nameEn: 'Cosmic Pulse (Default)', nameAm: 'ኮስሚክ ፓልስ (ነባሪ)' },
  { id: 'orbit', nameEn: 'Orbit Beep', nameAm: 'ኦርቢት ቢፕ' },
  { id: 'radar', nameEn: 'Radar Chime', nameAm: 'ራዳር ቻይም' },
  { id: 'supernova', nameEn: 'Supernova Alert', nameAm: 'ሱፐርኖቫ ማስጠንቀቂያ' },
  { id: 'deepspace', nameEn: 'Deep Space Ping', nameAm: 'ዲፕ ስፔስ ፒንግ' },
  { id: 'classic', nameEn: 'Classic Bell', nameAm: 'ክላሲክ ደወል' },
  { id: 'silent', nameEn: 'Silent', nameAm: 'ጸጥታ (Silent)' },
];

const NOTIFICATION_SOUND_KEY = 'ssgi_notification_sound';

export default function NotificationSoundScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isAmharic = i18n.language === 'am' || i18n.language?.startsWith('am');
  const isDark = theme === 'dark';

  const [selectedSound, setSelectedSound] = useState('cosmic');

  useEffect(() => {
    AsyncStorage.getItem(NOTIFICATION_SOUND_KEY).then((val) => {
      if (val) setSelectedSound(val);
    });
  }, []);

  const handleSelectSound = async (id) => {
    setSelectedSound(id);
    try {
      await AsyncStorage.setItem(NOTIFICATION_SOUND_KEY, id);
    } catch (e) {}
    Alert.alert(
      isAmharic ? 'ተሳክቷል' : 'Success',
      isAmharic ? 'የማሳወቂያ ድምፅ ተስተካክሏል።' : 'Notification sound updated successfully.'
    );
  };

  const bgColor = colors.background;
  const textColor = colors.text;
  const secondaryText = colors.rowTime;
  const cardColor = colors.rowBg;
  const brandColor = colors.primary;
  const borderColor = colors.border;
  const accentColor = colors.tabActiveBg;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Icon name="chevron-back-outline" size={26} color={textColor} />
        </TouchableOpacity>
        <T style={[styles.headerTitle, { color: textColor }]}>{t('settings.notificationSound')}</T>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <T style={[styles.infoText, { color: secondaryText }]}>
          {isAmharic
            ? 'ለቀጥተኛ መልዕክቶች እና ለቡድን ሰርጦች የሚጫወተውን የማሳወቂያ ድምፅ ይምረጡ።'
            : 'Choose your preferred alert tone for incoming messages and department broadcasts.'}
        </T>

        <View style={[styles.card, { backgroundColor: cardColor, borderColor: borderColor }]}>
          {SOUNDS.map((sound, index) => {
            const isSelected = selectedSound === sound.id;
            return (
              <TouchableOpacity
                key={sound.id}
                style={[
                  styles.row,
                  index < SOUNDS.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor },
                ]}
                activeOpacity={0.7}
                onPress={() => handleSelectSound(sound.id)}
              >
                <View style={[styles.iconBox, { backgroundColor: isSelected ? accentColor : 'rgba(221, 152, 75, 0.15)' }]}>
                  <Icon name="musical-note-outline" size={18} color={isSelected ? '#ffffff' : accentColor} />
                </View>
                <T style={[styles.rowText, { color: textColor }]}>
                  {isAmharic ? sound.nameAm : sound.nameEn}
                </T>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: accentColor }]}>
                    <Icon name="checkmark-outline" size={14} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4, width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '800', flex: 1, textAlign: 'center' },
  scrollContent: { padding: 20 },
  infoText: { fontSize: 13, lineHeight: 19, marginBottom: 20, paddingHorizontal: 4 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  iconBox: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowText: { fontSize: 15, fontWeight: '600', flex: 1 },
  checkCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});
