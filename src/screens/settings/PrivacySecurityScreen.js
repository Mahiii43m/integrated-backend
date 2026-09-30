import React, { useState } from 'react';
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
import { useTheme } from '../../firebase/context/ThemeContext';
import { useTranslation } from '../../i18n';
import T from '../../components/T';

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'chevron-back-outline') path = 'M15 19l-7-7 7-7';
  if (name === 'shield-checkmark-outline') path = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4';
  if (name === 'time-outline') path = 'M12 8v4l3 3 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z';
  if (name === 'checkmark-done-outline') path = 'M7 12l5 5L22 7 M2 12l5 5L9 15';
  if (name === 'radio-button-on-outline') path = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z';
  if (name === 'image-outline') path = 'M3 3h18v18H3z M3 16l5-5 3 3 5-5 5 5';
  if (name === 'lock-closed-outline') path = 'M7 11V7a5 5 0 0 1 10 0v4 M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z';
  if (name === 'key-outline') path = 'M21 2l-2 2 M7 10a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M11 14l9-9 2 2-9 9';
  if (name === 'ban-outline') path = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M4.93 4.93l14.14 14.14';
  if (name === 'phone-portrait-outline') path = 'M5 4h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M12 18h.01';
  if (name === 'refresh-outline') path = 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15';
  if (name === 'download-outline') path = 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3';
  if (name === 'trash-outline') path = 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2';
  if (name === 'chevron-forward-outline') path = 'M9 5l7 7-7 7';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

export default function PrivacySecurityScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [preferences, setPreferences] = useState({
    lastSeen: true,
    readReceipts: true,
    onlineStatus: true,
    profilePhoto: true,
    twoFactorAuth: false,
  });

  const bgColor = colors.background;
  const textColor = colors.text;
  const secondaryText = colors.rowTime;
  const borderColor = colors.border;
  const cardColor = colors.rowBg;
  const brandColor = colors.primary;
  const accentColor = colors.tabActiveBg;
  const goldAccent = '#de994a';

  const [activeSessions] = useState([
    { device: 'iPhone 15 Pro', location: 'Addis Ababa', lastActive: 'Now' },
    { device: 'MacBook Pro', location: 'Addis Ababa', lastActive: '2 hours ago' },
  ]);

  const togglePreference = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggleRow = (label, key, icon, description) => (
    <View style={[styles.toggleRow, { borderBottomColor: borderColor }]}>
      <View style={styles.toggleLabel}>
        {icon && <Icon name={icon} size={20} color={secondaryText} />}
        <View style={{ marginLeft: 12 }}>
          <T style={[styles.toggleText, { color: textColor }]}>{label}</T>
          {description && <T style={[styles.toggleDescription, { color: secondaryText }]}>{description}</T>}
        </View>
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

  const handleAction = (title) => {
    Alert.alert(title, t('profile.featureComingSoon'));
  };

  const renderSessionItem = (session, index) => (
    <View key={index} style={[styles.sessionItem, { borderBottomColor: borderColor }]}>
      <View style={styles.sessionLeft}>
        <Icon name="phone-portrait-outline" size={20} color={accentColor} />
        <View style={{ marginLeft: 12 }}>
          <T style={[styles.sessionDevice, { color: textColor }]}>{session.device}</T>
          <T style={[styles.sessionLocation, { color: secondaryText }]}>{session.location} • {session.lastActive}</T>
        </View>
      </View>
      <TouchableOpacity style={styles.sessionAction} onPress={() => handleAction('Revoke Session')}>
        <T style={[styles.sessionActionText, { color: accentColor }]}>{t('devices.revoke')}</T>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <T style={[styles.headerTitle, { color: textColor }]}>{t('settings.privacy')}</T>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <Icon name="shield-checkmark-outline" size={28} color={goldAccent} />
          <T style={[styles.infoText, { color: secondaryText, marginLeft: 12 }]}>
            {t('privacy.info')}
          </T>
        </View>

        <View style={[styles.securityStatus, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <View style={styles.securityStatusLeft}>
            <Icon name="shield-checkmark-outline" size={24} color="#34c759" />
            <T style={[styles.securityStatusTitle, { color: textColor, marginLeft: 10 }]}>{t('privacy.accountSecure')}</T>
          </View>
          <View style={styles.securityStatusBadge}>
            <T style={[styles.securityStatusText, { color: '#34c759' }]}>{t('privacy.active')}</T>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.sectionTitle, { color: secondaryText }]}>{t('privacy.privacy')}</T>
          {renderToggleRow(t('privacy.lastSeen'), 'lastSeen', 'time-outline', t('privacy.lastSeenDesc'))}
          {renderToggleRow(t('privacy.readReceipts'), 'readReceipts', 'checkmark-done-outline', t('privacy.readReceiptsDesc'))}
          {renderToggleRow(t('privacy.onlineStatus'), 'onlineStatus', 'radio-button-on-outline', t('privacy.onlineStatusDesc'))}
          {renderToggleRow(t('privacy.profilePhoto'), 'profilePhoto', 'image-outline', t('privacy.profilePhotoDesc'))}
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.sectionTitle, { color: secondaryText }]}>{t('privacy.security')}</T>
          {renderToggleRow(t('privacy.twoFactorAuth'), 'twoFactorAuth', 'lock-closed-outline', t('privacy.twoFactorAuthDesc'))}
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: borderColor }]} onPress={() => handleAction('Change Password')}>
            <View style={styles.toggleLabel}>
              <Icon name="key-outline" size={20} color={secondaryText} />
              <T style={[styles.toggleText, { color: textColor, marginLeft: 12 }]}>{t('privacy.changePassword')}</T>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: borderColor }]} onPress={() => handleAction('Blocked Users')}>
            <View style={styles.toggleLabel}>
              <Icon name="ban-outline" size={20} color={secondaryText} />
              <T style={[styles.toggleText, { color: textColor, marginLeft: 12 }]}>{t('privacy.blockedUsers')}</T>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.sectionTitle, { color: secondaryText }]}>{t('privacy.activeSessions')}</T>
          {activeSessions.map((session, index) => renderSessionItem(session, index))}
          <TouchableOpacity style={styles.optionRow} onPress={() => handleAction('Log Out All Devices')}>
            <View style={styles.toggleLabel}>
              <Icon name="refresh-outline" size={20} color={secondaryText} />
              <T style={[styles.toggleText, { color: textColor, marginLeft: 12 }]}>{t('devices.logoutAll')}</T>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.sectionTitle, { color: secondaryText }]}>{t('privacy.dataAndPrivacy')}</T>
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: borderColor }]} onPress={() => handleAction('Download Data')}>
            <View style={styles.toggleLabel}>
              <Icon name="download-outline" size={20} color={secondaryText} />
              <T style={[styles.toggleText, { color: textColor, marginLeft: 12 }]}>{t('privacy.downloadData')}</T>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionRow, { borderBottomColor: borderColor }]} onPress={() => handleAction('Delete Account')}>
            <View style={styles.toggleLabel}>
              <Icon name="trash-outline" size={20} color="#c0392b" />
              <T style={[styles.toggleText, { color: '#c0392b', marginLeft: 12 }]}>{t('privacy.deleteAccount')}</T>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={secondaryText} />
          </TouchableOpacity>
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
    paddingBottom: 8,
  },
  backButton: { padding: 4, width: 40 },
  headerTitle: { fontSize: 20, fontWeight: '700', flex: 1, textAlign: 'center' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 14, lineHeight: 20, opacity: 0.8 },
  securityStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  securityStatusLeft: { flexDirection: 'row', alignItems: 'center' },
  securityStatusTitle: { fontSize: 16, fontWeight: '600' },
  securityStatusBadge: { backgroundColor: '#34c75920', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  securityStatusText: { fontSize: 13, fontWeight: '600' },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6, paddingTop: 8 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toggleLabel: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  toggleText: { fontSize: 16, fontWeight: '500' },
  toggleDescription: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sessionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  sessionDevice: { fontSize: 15, fontWeight: '500' },
  sessionLocation: { fontSize: 12, opacity: 0.6, marginTop: 2 },
  sessionAction: { padding: 6 },
  sessionActionText: { fontSize: 14, fontWeight: '600' },
});
