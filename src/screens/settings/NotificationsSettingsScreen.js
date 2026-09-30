import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../firebase/context/ThemeContext';
import { useTranslation } from '../../i18n';
import T from '../../components/T';

const STORAGE_KEY = 'notification_preferences';

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'chevron-back-outline') path = 'M15 19l-7-7 7-7';
  if (name === 'notifications-outline') path = 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z M13.73 21a2 2 0 0 1-3.46 0';
  if (name === 'chatbubble-outline') path = 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-13.1c1.5 0 3 .4 4.3 1.1L21 1.5l-1.1 4.2c.7 1.3 1.1 2.8 1.1 4.3z';
  if (name === 'people-outline') path = 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0-4-4 4 4 0 0 0 4 4z';
  if (name === 'megaphone-outline') path = 'M11 5L6 9H2v6h4l5 4V5z M19.07 4.93a10 10 0 0 1 0 14.14 M15.54 8.46a5 5 0 0 1 0 7.07';
  if (name === 'musical-note-outline') path = 'M9 18V5l12-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z';
  if (name === 'phone-portrait-outline') path = 'M5 4h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M12 18h.01';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

export default function NotificationsSettingsScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [preferences, setPreferences] = useState({
    pushEnabled: true,
    messageNotifications: true,
    groupNotifications: true,
    announcementNotifications: true,
    sound: true,
    vibrate: true,
    showPreview: true,
  });

  const bgColor = colors.background;
  const textColor = colors.text;
  const secondaryText = colors.rowTime;
  const borderColor = colors.border;
  const cardColor = colors.rowBg;
  const brandColor = colors.primary;
  const goldAccent = '#de994a';

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved) setPreferences(prev => ({ ...prev, ...JSON.parse(saved) }));
    });
  }, []);

  const togglePreference = (key) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
  };

  const renderToggleRow = (label, key, icon) => (
    <View style={[styles.toggleRow, { borderBottomColor: borderColor }]}>
      <View style={styles.toggleLabel}>
        <Icon name={icon} size={20} color={secondaryText} />
        <T style={[styles.toggleText, { color: textColor, marginLeft: 12 }]}>{label}</T>
      </View>
      <Switch
        value={preferences[key] ?? false}
        onValueChange={() => togglePreference(key)}
        trackColor={{ false: '#3a3a5a', true: brandColor }}
        thumbColor={preferences[key] ? '#ffffff' : '#f4f3f4'}
        ios_backgroundColor="#3a3a5a"
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <T style={[styles.headerTitle, { color: textColor }]}>{t('settings.notifications')}</T>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Icon name="notifications-outline" size={28} color={goldAccent} />
          <T style={[styles.infoText, { color: secondaryText, marginLeft: 12 }]}>
            {t('notificationsSettings.info')}
          </T>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.sectionTitle, { color: secondaryText }]}>{t('notificationsSettings.general')}</T>
          {renderToggleRow(t('notificationsSettings.pushNotifications'), 'pushEnabled', 'notifications-outline')}
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.sectionTitle, { color: secondaryText }]}>{t('notificationsSettings.types')}</T>
          {renderToggleRow(t('notificationsSettings.messages'), 'messageNotifications', 'chatbubble-outline')}
          {renderToggleRow(t('notificationsSettings.groupsAndDepartments'), 'groupNotifications', 'people-outline')}
          {renderToggleRow(t('notificationsSettings.ssgiAnnouncements'), 'announcementNotifications', 'megaphone-outline')}
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.sectionTitle, { color: secondaryText }]}>{t('notificationsSettings.soundAndVibration')}</T>
          {renderToggleRow(t('notificationsSettings.sound'), 'sound', 'musical-note-outline')}
          {renderToggleRow(t('notificationsSettings.vibrate'), 'vibrate', 'phone-portrait-outline')}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8, paddingBottom: 8 },
  backButton: { padding: 4, width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  infoCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 20 },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
  section: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6, paddingTop: 8 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  toggleLabel: { flexDirection: 'row', alignItems: 'center' },
  toggleText: { fontSize: 16, fontWeight: '500' },
});
