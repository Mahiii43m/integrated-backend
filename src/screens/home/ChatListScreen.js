import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
  Modal,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAuth } from '../../firebase/context/AuthContext';
import { useTheme } from '../../firebase/context/ThemeContext';
import {
  subscribeToUserChats,
  getOrCreateSelfChat,
  subscribeToPinnedChatIds,
  togglePinChat,
} from '../../services/chatService';
import { useUserProfiles, getDisplayName } from '../../services/userService';

const Icon = ({ name, size = 24, color = '#000' }) => {
  const strokeWidth = 1.8;

  if (name === 'group') {
    // Lucide UsersRound
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M18 21a8 8 0 0 0-16 0" />
        <Circle cx="10" cy="8" r="5" />
        <Path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
      </Svg>
    );
  }
  if (name === 'profile') {
    // Lucide UserCircle
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Circle cx="12" cy="10" r="3" />
        <Path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
      </Svg>
    );
  }
  if (name === 'pin') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
      </Svg>
    );
  }
  if (name === 'search') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="11" cy="11" r="8" />
        <Path d="m21 21-4.3-4.3" />
      </Svg>
    );
  }
  if (name === 'more') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="1" />
        <Circle cx="12" cy="5" r="1" />
        <Circle cx="12" cy="19" r="1" />
      </Svg>
    );
  }
  if (name === 'notifications') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </Svg>
    );
  }
  if (name === 'add') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 8v8" />
        <Path d="M8 12h8" />
      </Svg>
    );
  }
  if (name === 'close-circle') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="m15 9-6 6" />
        <Path d="m9 9 6 6" />
      </Svg>
    );
  }
  if (name === 'planet') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M2 12h20" />
        <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </Svg>
    );
  }
  if (name === 'rocket') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <Path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <Path d="M9 12H4s.5-1 1-4c2 1 2 1 4 2z" />
        <Path d="M12 15v5s1-.5 4-1c-1-2-1-2-2-4z" />
      </Svg>
    );
  }
  if (name === 'map') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
        <Path d="M9 3v15" />
        <Path d="M15 6v15" />
      </Svg>
    );
  }
  if (name === 'flask') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 3h6" />
        <Path d="M10 3v10.17a4 4 0 1 1-1.24 3.06c.02-.8.32-1.58.87-2.19l.37-.44V3z" />
      </Svg>
    );
  }
  if (name === 'radio') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4.9 19.1a1 1 0 0 0 1.4 0l12.8-12.8a1 1 0 1 0-1.4-1.4L4.9 17.7a1 1 0 0 0 0 1.4z" />
        <Circle cx="12" cy="12" r="10" />
      </Svg>
    );
  }
  if (name === 'shield-checkmark') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <Path d="m9 12 2 2 4-4" />
      </Svg>
    );
  }
  if (name === 'checkmark') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 6L9 17l-5-5" />
      </Svg>
    );
  }
  if (name === 'checkmark-done') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M18 6l-9 11-4-5 M22 10l-9 11-4-5" />
      </Svg>
    );
  }
  if (name === 'attach') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
      </Svg>
    );
  }
  if (name === 'lock-closed') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z" />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </Svg>
    );
  }
  if (name === 'chatbubble') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </Svg>
    );
  }
  if (name === 'bookmark') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </Svg>
    );
  }
  if (name === 'info') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 16v-4" />
        <Path d="M12 8h.01" />
      </Svg>
    );
  }
  if (name === 'sun') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="5" />
        <Path d="M12 1v2" />
        <Path d="M12 21v2" />
        <Path d="M4.22 4.22l1.42 1.42" />
        <Path d="M18.36 18.36l1.42 1.42" />
        <Path d="M1 12h2" />
        <Path d="M21 12h2" />
        <Path d="M4.22 19.78l1.42-1.42" />
        <Path d="M18.36 5.64l1.42-1.42" />
      </Svg>
    );
  }
  if (name === 'moon') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 3a6.36 6.36 0 0 0 9 9 9 9 0 1 1-9-9z" />
      </Svg>
    );
  }

  return null;
};

// ─── Department Tabs ────────────────────────────────────────────────────────
const DEPARTMENT_TABS = [
  { id: 'all', label: 'All', icon: 'planet' },
  { id: 'space', label: 'Space Science', icon: 'rocket' },
  { id: 'geospatial', label: 'Geospatial', icon: 'map' },
  { id: 'research', label: 'Research', icon: 'flask' },
  { id: 'operations', label: 'Operations', icon: 'radio' },
];

const DEPARTMENT_TAG_MAP = {
  'Space Science': 'space',
  'Geospatial Division': 'geospatial',
  'Research': 'research',
  'Operations': 'operations',
  'Support': 'support',
};

export default function ChatsListScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();
  const isDark = theme === 'dark';
  const [chats, setChats] = useState([]);
  const [pinnedIds, setPinnedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const searchInputRef = React.useRef(null);

  const bgColor = colors?.background || '#0a0e1a';
  const textColor = colors?.rowText || colors?.text || '#ffffff';
  const secondaryText = colors?.rowTime || '#a0a0b0';
  const cardColor = colors?.rowBg || 'rgba(255,255,255,0.06)';
  const brandColor = colors?.primary || '#1a4b8c';
  const accentColor = colors?.tabActiveBg || '#6c5ce7';
  const goldAccent = '#de994a';
  const borderColor = colors?.border || 'rgba(255,255,255,0.1)';

  const adminBadgeBg = isDark ? 'rgba(108, 92, 231, 0.2)' : 'rgba(108, 92, 231, 0.15)';
  const adminBadgeText = accentColor;
  const pinnedBorderColor = brandColor;
  const pinnedHeaderColor = isDark ? secondaryText : '#555555';

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToUserChats(user.uid, (fetchedChats) => {
      setChats(fetchedChats);
    });
    return unsubscribe;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToPinnedChatIds(user.uid, (ids) => {
      setPinnedIds(ids);
    });
    return unsubscribe;
  }, [user?.uid]);

  const directChatOtherUids = chats
    .filter((chat) => chat.type === 'direct')
    .map((chat) => chat.participants?.find((uid) => uid !== user?.uid))
    .filter(Boolean);
  const userProfiles = useUserProfiles(directChatOtherUids);

  const getChatDisplayName = (chat) => {
    if (chat.type === 'group') return chat.groupName || chat.name || 'Group';
    const otherUid = chat.participants?.find((uid) => uid !== user?.uid);
    if (!otherUid && chat.groupName) return chat.groupName; // Handle "Saved Messages"
    return getDisplayName(userProfiles, otherUid);
  };

  const getChatPreviewText = (chat) => {
    return chat.lastMessage?.text || 'No messages yet';
  };

  const getChatTime = (chat) => {
    const timestamp = chat.lastMessage?.timestamp || chat.updatedAt;
    if (!timestamp || typeof timestamp.toDate !== 'function') return '';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDepartmentTag = (chat) => {
    if (chat.type !== 'group') return 'personal';
    return DEPARTMENT_TAG_MAP[chat.department] || 'other';
  };

  const getDepartmentLabel = (chat) => {
    if (chat.type !== 'group') return 'Personal';
    return chat.department || 'Group';
  };

  const isChatAdmin = (chat) => {
    return chat.type === 'group' && chat.admins?.includes(user?.uid);
  };

  const filteredChats = chats.filter((chat) => {
    if (activeTab !== 'all' && getDepartmentTag(chat) !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = getChatDisplayName(chat).toLowerCase();
      const preview = getChatPreviewText(chat).toLowerCase();
      const dept = getDepartmentLabel(chat).toLowerCase();
      return name.includes(q) || preview.includes(q) || dept.includes(q);
    }
    return true;
  });

  const pinnedChats = filteredChats.filter((c) => pinnedIds.has(c.id));
  const unpinnedChats = filteredChats.filter((c) => !pinnedIds.has(c.id));

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  const handleDayMode = () => {
    setShowMenu(false);
    toggleTheme();
  };

  const openNewChat = () => {
    setShowMenu(false);
    navigation.navigate('NewChat');
  };

  const openNewGroup = () => {
    setShowMenu(false);
    navigation.navigate('NewGroup');
  };

  const handleSavedMessages = async () => {
    setShowMenu(false);
    if (!user?.uid) return;
    try {
      const chatId = await getOrCreateSelfChat(user.uid);
      navigation.navigate('ChatWindow', {
        chatId: chatId,
        contactName: 'Saved Messages',
      });
    } catch (error) {
      console.error('Error starting self-chat:', error);
      Alert.alert('Error', 'Could not open Saved Messages.');
    }
  };

  const openAboutSSGI = () => {
    setShowMenu(false);
    Alert.alert('About SSGI', 'Space Science and Geospatial Institute — established 2022.');
  };

  const handleLongPressChat = (chat) => {
    if (!user?.uid) return;
    const isPinned = pinnedIds.has(chat.id);
    togglePinChat(user.uid, chat.id, !isPinned).catch((error) => {
      console.error('Failed to toggle pin:', error);
      Alert.alert('Error', 'Could not update pin. Please try again.');
    });
  };

  const renderChatItem = ({ item }) => {
    const isGroup = item.type === 'group';
    const isPinned = pinnedIds.has(item.id);
    const isAdmin = isChatAdmin(item);
    const isUrgent = !!item.isUrgent;
    const hasFiles = item.lastMessage?.type === 'file';
    const displayName = getChatDisplayName(item);

    return (
      <View
        style={[
          styles.chatRow,
          isPinned && [styles.pinnedRow, { borderLeftColor: pinnedBorderColor }],
          { backgroundColor: cardColor, borderBottomColor: borderColor },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ChatDetails', {
            contactName: displayName,
            groupDetails: isGroup ? {
              name: item.groupName,
              department: item.department,
              participants: item.participants,
              admins: item.admins,
              groupPhotoUrl: item.groupPhotoUrl,
              description: item.description
            } : null,
            otherUser: !isGroup ? userProfiles[item.participants?.find(uid => uid !== user?.uid)] : null
          })}
        >
          <View style={[styles.avatar, { borderColor: brandColor }, isGroup && styles.avatarGroup]}>
            <Text style={[styles.avatarText, { color: brandColor }]}>{displayName.charAt(0).toUpperCase()}</Text>
            {isAdmin && (
              <View style={[styles.adminDot, { borderColor: isDark ? '#0a0e1a' : '#ffffff' }]}>
                <Icon name="shield-checkmark" size={10} color="#ffffff" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chatInfo}
          activeOpacity={0.6}
          onPress={() =>
            navigation.navigate('ChatWindow', {
              chatId: item.id,
              contactName: displayName,
              groupDetails: isGroup
                ? {
                    name: item.groupName,
                    department: item.department,
                    participants: item.participants,
                    admins: item.admins,
                  }
                : null,
            })
          }
          onLongPress={() => handleLongPressChat(item)}
          delayLongPress={350}
        >
          <View style={styles.chatTopRow}>
            <View style={styles.nameRow}>
              {isPinned && (
                <Icon
                  name="pin"
                  size={12}
                  color={pinnedBorderColor}
                />
              )}
              <Text style={[styles.chatName, { color: textColor, marginLeft: isPinned ? 4 : 0 }]} numberOfLines={1}>
                {displayName}
              </Text>
              {isUrgent && <Text style={styles.urgentIcon}>🚨</Text>}
              {isAdmin && (
                <View style={[styles.adminBadge, { backgroundColor: adminBadgeBg }]}>
                  <Text style={[styles.adminBadgeText, { color: adminBadgeText }]}>Admin</Text>
                </View>
              )}
            </View>
            <Text style={[styles.chatTime, { color: secondaryText }]}>{getChatTime(item)}</Text>
          </View>

          <View style={styles.chatBottomRow}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              {item.lastMessage?.senderId === user?.uid && (
                <View style={{marginRight: 4}}>
                  <Icon
                    name={item.lastMessage?.readBy?.length > 1 ? "checkmark-done" : "checkmark"}
                    size={14}
                    color={item.lastMessage?.readBy?.length > 1 ? "#34B7F1" : secondaryText}
                  />
                </View>
              )}
              <Text style={[styles.chatPreview, { color: secondaryText }]} numberOfLines={1}>
                {getChatPreviewText(item)}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: brandColor }]}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>

          <View style={styles.chatMetaRow}>
            <Text style={[styles.departmentLabel, { color: accentColor }]}>
              {getDepartmentLabel(item)}
            </Text>
            <View style={styles.iconRow}>
              {hasFiles && (
                <Icon name="attach" size={14} color={secondaryText} />
              )}
              <View style={{marginLeft: 4}}>
                <Icon name="lock-closed" size={12} color={secondaryText} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSectionHeader = ({ item }) => {
    if (!item.isSectionHeader) return null;
    return (
      <View style={[styles.sectionRow, { backgroundColor: cardColor }]}>
        <View style={[styles.sectionLine, { backgroundColor: borderColor }]} />
        <Text style={[styles.sectionLabel, { color: secondaryText }]}>{item.title}</Text>
        <View style={[styles.sectionLine, { backgroundColor: borderColor }]} />
      </View>
    );
  };

  const renderPinnedHeader = () => {
    if (pinnedChats.length === 0) return null;
    return (
      <View style={[styles.pinnedHeader, { borderBottomColor: borderColor }]}>
        <Icon name="pin" size={16} color={brandColor} />
        <Text style={[styles.pinnedHeaderText, { color: pinnedHeaderColor, marginLeft: 6 }]}>PINNED</Text>
      </View>
    );
  };

  const buildUnpinnedListData = () => {
    if (activeTab !== 'all') return unpinnedChats;
    const groupChats = unpinnedChats.filter((c) => c.type === 'group');
    const directChats = unpinnedChats.filter((c) => c.type === 'direct');
    if (directChats.length === 0) return groupChats;
    return [
      ...groupChats,
      { id: 'sec-contacts', isSectionHeader: true, title: 'contacts' },
      ...directChats,
    ];
  };

  const unpinnedListData = buildUnpinnedListData();

  const renderListItem = ({ item }) => {
    if (item.isSectionHeader) return renderSectionHeader({ item });
    return renderChatItem({ item });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={[styles.pillBtn, { backgroundColor: goldAccent }]}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.pillBtnText}>Edit</Text>
          </TouchableOpacity>

          <View style={[styles.titlePill, { backgroundColor: goldAccent }]}>
            <Text style={styles.titlePillText}>chats</Text>
          </View>

          <View style={styles.rightControls}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Contacts')}
              activeOpacity={0.7}
              style={{ marginRight: 12 }}
            >
              <Icon name="add" size={22} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notifications')}
              activeOpacity={0.7}
              style={{ marginRight: 12 }}
            >
              <Icon name="notifications" size={22} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowMenu(!showMenu)} activeOpacity={0.7}>
              <Icon name="more" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.searchBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)', borderColor: borderColor }]}>
          <Icon name="search" size={18} color={secondaryText} />
          <TextInput
            ref={searchInputRef}
            style={[styles.searchInput, { color: textColor, marginLeft: 8 }]}
            placeholder="Search chats or people..."
            placeholderTextColor={secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Icon name="close-circle" size={18} color={secondaryText} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {DEPARTMENT_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                { borderColor: borderColor },
                activeTab === tab.id && [styles.tabActive, { backgroundColor: brandColor }],
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
            >
              <Icon
                name={tab.icon}
                size={16}
                color={activeTab === tab.id ? '#ffffff' : secondaryText}
              />
              <Text style={[styles.tabText, { color: activeTab === tab.id ? '#ffffff' : secondaryText, marginLeft: 4 }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={unpinnedListData}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          pinnedChats.length > 0 ? (
            <>
              {renderPinnedHeader()}
              {pinnedChats.map((item) => (
                <View key={item.id}>{renderChatItem({ item })}</View>
              ))}
              <View style={[styles.divider, { borderBottomColor: borderColor, marginLeft: 0 }]} />
            </>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={[styles.divider, { borderBottomColor: borderColor }]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="chatbubble" size={48} color={secondaryText} />
            <Text style={[styles.emptyText, { color: secondaryText }]}>No chats found</Text>
          </View>
        }
      />

      {showMenu && (
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={[styles.menuContainer, { backgroundColor: cardColor, borderColor: borderColor }]}>
            <TouchableOpacity style={styles.menuItem} onPress={openNewChat}>
              <Icon name="chatbubble" size={20} color={accentColor} />
              <Text style={[styles.menuItemText, { color: textColor, marginLeft: 12 }]}>New Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={openNewGroup}>
              <Icon name="group" size={20} color={brandColor} />
              <Text style={[styles.menuItemText, { color: textColor, marginLeft: 12 }]}>New Group</Text>
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: borderColor }]} />
            <TouchableOpacity style={styles.menuItem} onPress={handleDayMode}>
              <Icon name={isDark ? 'sun' : 'moon'} size={20} color={secondaryText} />
              <Text style={[styles.menuItemText, { color: textColor, marginLeft: 12 }]}>
                {isDark ? 'Day Mode' : 'Night Mode'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSavedMessages}>
              <Icon name="bookmark" size={20} color={secondaryText} />
              <Text style={[styles.menuItemText, { color: textColor, marginLeft: 12 }]}>Saved Messages</Text>
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: borderColor }]} />
            <TouchableOpacity style={styles.menuItem} onPress={openAboutSSGI}>
              <Icon name="info" size={20} color={secondaryText} />
              <Text style={[styles.menuItemText, { color: textColor, marginLeft: 12 }]}>About SSGI</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.bottomBar}>
        <View style={[styles.navCapsule, { backgroundColor: isDark ? 'rgba(30, 40, 60, 0.85)' : 'rgba(255, 255, 255, 0.85)', borderColor: borderColor }]}>
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={openNewGroup}>
            <View style={[styles.floatingCircle, { borderColor: brandColor, shadowColor: brandColor }]}>
              <Icon name="group" size={24} color={secondaryText} />
            </View>
            <Text style={[styles.navLabel, { color: secondaryText }]}>group</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Profile')}>
            <View style={[styles.floatingCircle, { borderColor: brandColor, shadowColor: brandColor }]}>
              {user?.profilePicture ? (
                <Image source={{ uri: user.profilePicture }} style={styles.navAvatar} />
              ) : (
                <Icon name="profile" size={24} color={secondaryText} />
              )}
            </View>
            <Text style={[styles.navLabel, { color: secondaryText }]}>profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal transparent animationType="fade" visible={showLogoutModal} onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to sign out{user?.fullName || user?.name ? `, ${user.fullName || user.name}` : ''}
              {user?.email ? ` (${user.email})` : ''}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogoutModal(false)} activeOpacity={0.8}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                <Text style={styles.logoutBtnText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'android' ? 10 : 4,
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pillBtn: { borderRadius: 14, paddingVertical: 5, paddingHorizontal: 16 },
  pillBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  titlePill: { borderRadius: 14, paddingVertical: 5, paddingHorizontal: 22 },
  titlePillText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    height: 38,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },
  tabsContainer: { paddingVertical: 4 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
  },
  tabActive: { borderColor: 'transparent' },
  tabText: { fontSize: 12, fontWeight: '600' },
  list: { flex: 1 },
  listContent: { paddingBottom: 20 },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionLine: { flex: 1, height: 1 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginHorizontal: 10,
    textTransform: 'lowercase',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  pinnedRow: { borderLeftWidth: 3, paddingLeft: 13 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    position: 'relative',
    borderWidth: 2,
  },
  avatarGroup: { borderWidth: 2, borderColor: '#6c5ce7' },
  avatarText: { fontSize: 20, fontWeight: '600', color: '#ffffff' },
  adminDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#6c5ce7',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  chatInfo: { flex: 1 },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  chatName: { fontSize: 15, fontWeight: '600', flex: 1 },
  urgentIcon: { fontSize: 14, marginLeft: 4 },
  adminBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1, marginLeft: 6 },
  adminBadgeText: { fontSize: 9, fontWeight: '600' },
  chatTime: { fontSize: 11, marginLeft: 8 },
  chatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatPreview: { fontSize: 13, flex: 1, marginRight: 8 },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  unreadText: { fontSize: 11, fontWeight: 'bold', color: '#ffffff' },
  chatMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  departmentLabel: { fontSize: 11, fontWeight: '500' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  pinnedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  pinnedHeaderText: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  divider: { borderBottomWidth: 1, marginLeft: 76 },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, marginTop: 12 },
  menuOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  menuContainer: {
    position: 'absolute',
    top: 48,
    right: 14,
    width: 210,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 6,
    elevation: 8,
    zIndex: 1000,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 },
  menuItemText: { fontSize: 15 },
  menuDivider: { height: 1, marginVertical: 4, marginHorizontal: 12 },
  bottomBar: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  navCapsule: {
    width: '60%',
    flexDirection: 'row',
    borderRadius: 35,
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    borderWidth: 1,
    // Floating shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  navBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  floatingCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    // Inner shadow for depth
    elevation: 2,
  },
  navAvatar: { width: 38, height: 38, borderRadius: 19 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalBox: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, width: '100%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#111111' },
  modalMessage: { fontSize: 14, lineHeight: 20, marginBottom: 24, color: '#555555' },
  modalButtons: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: '#cccccc',
    justifyContent: 'center', alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#555555' },
  logoutBtn: {
    flex: 1, height: 46, borderRadius: 12, backgroundColor: '#c0392b',
    justifyContent: 'center', alignItems: 'center',
  },
  logoutBtnText: { fontSize: 15, fontWeight: 'bold', color: '#ffffff' },
});
