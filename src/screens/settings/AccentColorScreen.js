import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import T from '../../components/T';
import { useTheme } from '../../firebase/context/ThemeContext';

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'chevron-back-outline') path = 'M15 19l-7-7 7-7';
  if (name === 'checkmark-outline') path = 'M5 13l4 4L19 7';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

const ACCENT_PALETTES = [
  { id: 'gold', nameEn: 'SSGI Gold', nameAm: 'ኤስ.ኤስ.ጂ.አይ ወርቃማ', color: '#de994a' },
  { id: 'blue', nameEn: 'Orbit Blue', nameAm: 'ኦርቢት ሰማያዊ', color: '#0080ce' },
  { id: 'purple', nameEn: 'Cosmic Purple', nameAm: 'ኮስሚክ ሀምራዊ', color: '#6c5ce7' },
  { id: 'green', nameEn: 'Aurora Green', nameAm: 'አውሮራ አረንጓዴ', color: '#2ecc71' },
  { id: 'coral', nameEn: 'Solar Coral', nameAm: 'ሶላር ኮራል', color: '#e74c3c' },
  { id: 'teal', nameEn: 'Nebula Teal', nameAm: 'ኔቡላ ቲል', color: '#00cec9' },
  { id: 'pink', nameEn: 'Supernova Pink', nameAm: 'ሱፐርኖቫ ሮዝ', color: '#fd79a8' },
  { id: 'amber', nameEn: 'Stellar Amber', nameAm: 'ስቴላር አምበር', color: '#f39c12' },
];

export default function AccentColorScreen({ navigation }) {
  const { colors, theme, accentColor, setCustomAccent } = useTheme();
  const { t, i18n } = useTranslation();
  const isAmharic = i18n.language === 'am' || i18n.language?.startsWith('am');
  const isDark = theme === 'dark';

  const [selectedColor, setSelectedColor] = useState(accentColor || '#de994a');

  const handleSelect = (color) => {
    setSelectedColor(color);
    setCustomAccent(color);
    Alert.alert(
      isAmharic ? 'ተሳክቷል' : 'Success',
      isAmharic ? 'የይዘት ቀለም በተሳካ ሁኔታ ተቀይሯል።' : 'Accent color updated successfully.'
    );
  };

  const bgColor = colors.background;
  const textColor = colors.text;
  const secondaryText = colors.rowTime;
  const cardColor = colors.rowBg;
  const borderColor = colors.border;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
          <Icon name="chevron-back-outline" size={26} color={textColor} />
        </TouchableOpacity>
        <T style={[styles.headerTitle, { color: textColor }]}>{t('settings.accentColor')}</T>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <T style={[styles.infoText, { color: secondaryText }]}>
          {isAmharic
            ? 'ለመተግበሪያው አዝራሮች፣ ማሳያዎች እና ገጸ-ባህሪያት የሚመረጠውን ዋና የይዘት ቀለም ይምረጡ።'
            : 'Select the primary highlight accent color for action buttons, active tabs, and interactive badges.'}
        </T>

        {/* Live Preview Card */}
        <View style={[styles.previewCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          <T style={[styles.previewTitle, { color: textColor }]}>
            {isAmharic ? 'የቀለም ቅንብር ማሳያ' : 'Live UI Preview'}
          </T>
          <View style={styles.previewRow}>
            <View style={[styles.previewBadge, { backgroundColor: selectedColor }]}>
              <T style={styles.previewBadgeText}>SSGI</T>
            </View>
            <View style={[styles.previewButton, { backgroundColor: selectedColor }]}>
              <T style={styles.previewButtonText}>{isAmharic ? 'አዝራር (Button)' : 'Action Button'}</T>
            </View>
          </View>
        </View>

        {/* Color Grid */}
        <View style={[styles.gridCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
          {ACCENT_PALETTES.map((item, index) => {
            const isSelected = selectedColor === item.color;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.colorRow,
                  index < ACCENT_PALETTES.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor },
                ]}
                activeOpacity={0.7}
                onPress={() => handleSelect(item.color)}
              >
                <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
                <T style={[styles.colorName, { color: textColor }]}>
                  {isAmharic ? item.nameAm : item.nameEn}
                </T>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: selectedColor }]}>
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
  previewCard: { borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 20, alignItems: 'center' },
  previewTitle: { fontSize: 14, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 },
  previewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 12 },
  previewBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  previewBadgeText: { color: '#ffffff', fontWeight: '900', fontSize: 12 },
  previewButton: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  previewButtonText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
  gridCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  colorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  colorCircle: { width: 32, height: 32, borderRadius: 16, marginRight: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  colorName: { fontSize: 15, fontWeight: '600', flex: 1 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
