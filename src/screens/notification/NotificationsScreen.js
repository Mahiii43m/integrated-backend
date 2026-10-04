import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from '../../i18n';
import T from '../../components/T';
import { useTheme } from '../../firebase/context/ThemeContext';
import { db } from '../../firebase/firestore';

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'chevron-back-outline') path = 'M15 19l-7-7 7-7';
  if (name === 'notifications-off-outline') path = 'M18 8a6 6 0 0 0-9.33-5M3 3l18 18 M10.73 5.08A6 6 0 0 0 6 11v5l-2 2h14 M13.73 21a2 2 0 0 1-3.46 0';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: '1',
    titleEn: 'Digital Addressing System eDAS Launched',
    titleAm: 'ዲጂታል አድራሻ አሰጣጥ ሲስተም (eDAS) ተጀመረ',
    date: 'August 15, 2026',
    summaryEn: 'SSGI launches a new digital addressing system for Adama city.',
    summaryAm: 'SSGI ለአዳማ ከተማ አዲስ ዲጂታል አድራሻ አሰጣጥ ሲስተም ይፋ አደረገ።',
    type: 'announcement',
  },
  {
    id: '2',
    titleEn: 'Space Science Conference 2026 (S-ARC2026)',
    titleAm: 'የ2026 የህዋ ሳይንስ ኮንፈረንስ (S-ARC2026)',
    date: 'August 12, 2026',
    summaryEn: 'Call for abstracts now open. Submit your research by September 30.',
    summaryAm: 'የጥናታዊ ጽሁፍ ማጠቃለያ ጥሪ አሁን ክፍት ነው። ጥናትዎ እስከ መስከረም 30 ያስገቡ።',
    type: 'event',
  },
  {
    id: '3',
    titleEn: 'Training: "Journey to the Space"',
    titleAm: 'ስልጠና፡ "ወደ ጠፈር ጉዞ"',
    date: 'August 10, 2026',
    summaryEn: 'SSGI offers a 5-day training program on space science and geospatial analysis.',
    summaryAm: 'SSGI በህዋ ሳይንስ እና ጂኦስፓሻል ትንተና ላይ የ5 ቀናት ስልጠና ይሰጣል።',
    type: 'training',
  },
  {
    id: '4',
    titleEn: 'CORS Network Expansion',
    titleAm: 'የCORS ኔትወርክ ማስፋፊያ',
    date: 'August 5, 2026',
    summaryEn: 'New Continuous Operating Reference Stations deployed in Southern Ethiopia.',
    summaryAm: 'አዲስ ቀጣይነት ያለው የሳተላይት ማጣቀሻ ጣቢያዎች (CORS) በደቡብ ኢትዮጵያ ተተከሉ።',
    type: 'update',
  },
];

const TYPE_COLORS = {
  announcement: '#1B5674',
  event: '#de994a',
  training: '#4CAF50',
  update: '#6c5ce7',
};

export default function NotificationsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const isAmharic = i18n.language === 'am' || i18n.language?.startsWith('am');
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState(DEFAULT_ANNOUNCEMENTS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const snapshot = await db.collection('notifications').orderBy('createdAt', 'desc').get();
      if (!snapshot.empty) {
        const remoteList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(remoteList);
      }
    } catch (e) {
      console.warn('Using default notifications fallback:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const bgColor = colors.background;
  const textColor = colors.text;
  const secondaryText = colors.rowTime;
  const cardColor = colors.rowBg;
  const borderColor = colors.border;
  const headerBg = colors.headerBg;

  const renderItem = ({ item }) => {
    const badgeColor = TYPE_COLORS[item.type] || '#1B5674';
    const title = isAmharic ? (item.titleAm || item.title) : (item.titleEn || item.title);
    const summary = isAmharic ? (item.summaryAm || item.summary) : (item.summaryEn || item.summary);

    return (
      <View style={[styles.notificationCard, { backgroundColor: cardColor, borderColor: borderColor }]}>
        <View style={styles.cardHeader}>
          <T style={[styles.cardTitle, { color: textColor }]}>{title}</T>
          <T style={[styles.cardDate, { color: secondaryText }]}>{item.date}</T>
        </View>
        <T style={[styles.cardSummary, { color: secondaryText }]}>{summary}</T>
        <View style={[styles.typeBadge, { backgroundColor: badgeColor + '20' }]}>
          <T style={[styles.typeText, { color: badgeColor }]}>{(item.type || 'announcement').toUpperCase()}</T>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="chevron-back-outline" size={26} color="#ffffff" />
        </TouchableOpacity>
        <T style={styles.headerTitle}>{t('settings.notifications')}</T>
        <View style={styles.headerRightSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="notifications-off-outline" size={48} color={secondaryText} />
              <T style={[styles.emptyText, { color: secondaryText }]}>{t('chats.noNotifications')}</T>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    paddingBottom: 15,
  },
  backButton: { padding: 4, width: 40 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#ffffff', flex: 1, textAlign: 'center' },
  headerRightSpacer: { width: 32 },
  listContent: { padding: 15, paddingBottom: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notificationCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 15,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  cardDate: { fontSize: 11 },
  cardSummary: { fontSize: 13, marginBottom: 10, lineHeight: 18 },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeText: { fontSize: 10, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 12, fontSize: 14 },
});
