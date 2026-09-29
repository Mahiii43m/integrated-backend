import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { changeLanguage, useTranslation } from '../../i18n';
import { useTheme } from '../../firebase/context/ThemeContext';
import T from '../../components/T';

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'chevron-back-outline') path = 'M15 19l-7-7 7-7';
  if (name === 'checkmark-outline') path = 'M20 6L9 17l-5-5';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'am', label: 'Amharic', native: 'አማርኛ' },
];

export default function LanguageScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isDark = theme === 'dark';

  const bgColor = colors?.background || '#0a0e1a';
  const textColor = colors?.text || '#ffffff';
  const secondaryText = colors?.rowTime || '#a0a0b0';
  const borderColor = colors?.border || 'rgba(255,255,255,0.1)';
  const cardColor = colors?.rowBg || 'rgba(255,255,255,0.06)';
  const brandColor = colors?.primary || '#0080ce';

  const currentLang = i18n.language || 'en';

  const handleSelect = async (code) => {
    await changeLanguage(code);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back-outline" size={28} color={textColor} />
        </TouchableOpacity>
        <T style={[styles.headerTitle, { color: textColor }]}>{t('settings.language')}</T>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.list}>
        {LANGUAGES.map((lang) => {
          const isActive = currentLang === lang.code || currentLang.startsWith(lang.code);
          return (
            <TouchableOpacity
              key={lang.code}
              style={[styles.row, { backgroundColor: cardColor, borderBottomColor: borderColor }]}
              onPress={() => handleSelect(lang.code)}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: textColor, fontFamily: lang.code === 'am' ? 'NotoSansEthiopic-Regular' : undefined }]}>{lang.native}</Text>
                {lang.native !== lang.label && (
                  <T style={[styles.rowSubtitle, { color: secondaryText }]}>{lang.label}</T>
                )}
              </View>
              {isActive && <Icon name="checkmark-outline" size={24} color={brandColor} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    borderBottomWidth: 1,
  },
  backButton: { padding: 6, width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  list: { paddingTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  rowTitle: { fontSize: 16 },
  rowSubtitle: { fontSize: 13, marginTop: 2 },
});
