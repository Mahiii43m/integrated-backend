import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { launchImageLibrary } from 'react-native-image-picker';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import Sound from 'react-native-nitro-sound';
import { useTheme } from '../../firebase/context/ThemeContext';
import { useTranslation } from '../../i18n';
import T from '../../components/T';
import Typography from '../../components/Typography';
import { SPACING, RADIUS } from '../../constants/Typography';
import { useAuth } from '../../firebase/context/AuthContext';
import { subscribeToMessages, sendMessage, uploadChatAttachment } from '../../services/messageService';
import { useUserProfiles, getDisplayName } from '../../services/userService';

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'location-outline') path = 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z';
  if (name === 'satellite-outline') path = 'M2 10a10 10 0 0 1 10-10 M2 22a10 10 0 0 0 10 10 M22 10a10 10 0 0 0-10-10 M22 22a10 10 0 0 1-10 10';
  if (name === 'document-text-outline') path = 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6';
  if (name === 'warning-outline') path = 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01';
  if (name === 'map-outline') path = 'M1 6v15l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v15 M16 6v15';
  if (name === 'school-outline') path = 'M22 10v6M2 10l10-5 10 5-10 5z M6 12.5V16a6 6 0 0 0 12 0v-3.5';
  if (name === 'chevron-forward-outline') path = 'M9 18l6-6-6-6';
  if (name === 'chevron-back-outline') path = 'M15 19l-7-7 7-7';
  if (name === 'information-circle-outline') path = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16v-4 M12 8h.01';
  if (name === 'close') path = 'M18 6L6 18 M6 6l12 12';
  if (name === 'shield-checkmark-outline') path = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4';
  if (name === 'person-add-outline') path = 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0-4-4 4 4 0 0 0 4 4z M19 8v6 M16 11h6';
  if (name === 'attach-outline') path = 'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48';
  if (name === 'mic-outline') path = 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v1a7 7 0 0 1-14 0v-1 M12 18v4 M8 22h8';
  if (name === 'image-outline') path = 'M3 3h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z M21 15l-5-5L5 21';
  if (name === 'stop-circle-outline') path = 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9 9h6v6H9z';
  if (name === 'play-outline') path = 'M5 3l14 9-14 9V3z';
  if (name === 'call-outline') path = 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';
  if (name === 'videocam-outline') path = 'M23 7l-7 5 7 5V7z M16 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

export default function ChatWindowScreen({ route, navigation }) {
  const { colors, theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isDark = theme === 'dark';
  const isAmharic = i18n.language === 'am' || i18n.language?.startsWith('am');
  const { chatId, contactName, contactUid, groupDetails } = route.params || { contactName: 'Contact' };
  const { user } = useAuth();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  // Attachment state
  const [uploading, setUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');

  const isDecisionChat = contactName === 'Key Decision Enablers';

  const bgColor = colors?.background || '#0a0e1a';
  const textColor = colors?.text || '#ffffff';
  const secondaryText = colors?.rowTime || '#a0a0b0';
  const borderColor = colors?.border || 'rgba(255,255,255,0.1)';
  const brandColor = colors?.primary || '#1a4b8c';
  const cardColor = colors?.rowBg || 'rgba(255,255,255,0.06)';
  const accentColor = colors?.tabActiveBg || '#de994a';

  const senderUids = [...new Set(messages.map((m) => m.senderId))];
  const userProfiles = useUserProfiles(senderUids);

  const contactUids = contactUid ? [contactUid] : [];
  const contactProfiles = useUserProfiles(contactUids);
  const contactProfile = contactUid ? contactProfiles?.[contactUid] : null;

  useEffect(() => {
    if (!chatId || isDecisionChat) return;
    const unsubscribe = subscribeToMessages(chatId, (fetchedMessages) => setMessages(fetchedMessages));
    return unsubscribe;
  }, [chatId, isDecisionChat]);

  const handleSendMessage = async (type = 'text', attachment = null) => {
    if ((type === 'text' && !inputText.trim()) || !chatId || !user?.uid) return;

    const textToSend = type === 'text' ? inputText.trim() : '';
    if (type === 'text') setInputText('');

    try {
      if (attachment) {
        setUploading(true);
        const url = await uploadChatAttachment(chatId, attachment.uri, attachment.name, type);
        await sendMessage(chatId, {
          senderId: user.uid,
          text: textToSend,
          type,
          attachmentUrl: url,
          attachmentName: attachment.name
        });
        setUploading(false);
      } else {
        await sendMessage(chatId, { senderId: user.uid, text: textToSend, type });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      if (type === 'text') setInputText(textToSend);
      setUploading(false);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      handleSendMessage(asset.type?.includes('video') ? 'video' : 'image', {
        uri: asset.uri,
        name: asset.fileName || `image_${Date.now()}.${asset.uri.split('.').pop()}`
      });
    }
  };

  const pickDocument = async () => {
    try {
      const res = await pick({
        type: [types.allFiles],
      });
      if (res && res.length > 0) {
        const file = res[0];
        handleSendMessage('file', { uri: file.uri, name: file.name });
      }
    } catch (err) {
      if (!(isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED)) {
        console.error(err);
      }
    }
  };

  const startRecording = async () => {
    try {
      const result = await Sound.startRecorder();
      Sound.addRecordBackListener((e) => {
        setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
        return;
      });
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      setIsRecording(false);
      setRecordTime('00:00:00');
      handleSendMessage('voice', { uri: result, name: `voice_${Date.now()}.m4a` });
    } catch (err) {
      console.error(err);
    }
  };

  const formatMessageTime = (createdAt) => {
    if (!createdAt || typeof createdAt.toDate !== 'function') return '';
    return createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageItem = ({ item }) => {
    const isMe = item.senderId === user?.uid;
    const isGroup = !!groupDetails;
    const isSenderAdmin = isGroup && groupDetails.admins?.includes(item.senderId);
    const senderDisplayName = getDisplayName(userProfiles, item.senderId);

    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        {!isMe && (
          <View style={[styles.miniAvatar, { backgroundColor: cardColor }, isSenderAdmin && { backgroundColor: accentColor }]}>
            <T style={[styles.miniAvatarText, { color: isSenderAdmin ? '#ffffff' : secondaryText }]}>
              {senderDisplayName.substring(0, 1).toUpperCase()}
            </T>
          </View>
        )}
        <View style={[styles.bubble, isMe ? [styles.bubbleMe, { backgroundColor: brandColor }] : [styles.bubbleThem, { backgroundColor: cardColor }]]}>
          {isGroup && !isMe && (
            <T style={[styles.senderNameText, { color: isSenderAdmin ? accentColor : brandColor }]}>{senderDisplayName}</T>
          )}

          {item.type === 'text' && <T style={{ color: isMe ? '#ffffff' : textColor, fontSize: 14 }}>{item.text}</T>}

          {item.type === 'image' && (
            <Image source={{ uri: item.attachmentUrl }} style={styles.messageImage} resizeMode="cover" />
          )}

          {(item.type === 'file' || item.type === 'video') && (
            <TouchableOpacity style={styles.fileAttachment} onPress={() => Linking.openURL(item.attachmentUrl)}>
              <Icon name="document-text-outline" size={24} color={isMe ? '#fff' : brandColor} />
              <T style={{ color: isMe ? '#fff' : textColor, marginLeft: 8, fontSize: 12 }}>{item.attachmentName || t('chat.attachment')}</T>
            </TouchableOpacity>
          )}

          {item.type === 'voice' && (
            <TouchableOpacity style={styles.voiceAttachment} onPress={() => Linking.openURL(item.attachmentUrl)}>
              <Icon name="play-outline" size={20} color={isMe ? '#fff' : brandColor} />
              <View style={[styles.voiceWaveform, { backgroundColor: isMe ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' }]} />
              <T style={{ color: isMe ? '#fff' : secondaryText, fontSize: 10, marginLeft: 8 }}>{t('chat.voice')}</T>
            </TouchableOpacity>
          )}

          <T style={{ color: isMe ? 'rgba(255,255,255,0.7)' : secondaryText, fontSize: 9, textAlign: 'right', marginTop: 4 }}>
            {formatMessageTime(item.createdAt)}
          </T>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>

        <View style={[styles.header, { backgroundColor: isDark ? '#0f2540' : brandColor }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-back-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerTitleContainer} onPress={() => setShowInfoModal(true)} activeOpacity={0.7}>
            <T style={styles.headerTitle}>{contactName}</T>
            <T style={styles.headerSubtitle}>{groupDetails ? `${groupDetails.participants?.length || 0} ${t('chat.members')}` : t('chat.online')}</T>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => Alert.alert(t('chat.call'), 'Call feature coming soon.')}
              style={{ padding: 6, marginRight: 4 }}
              activeOpacity={0.7}
            >
              <Icon name="call-outline" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert(t('chat.videoCall'), 'Video call feature coming soon.')}
              style={{ padding: 6 }}
              activeOpacity={0.7}
            >
              <Icon name="videocam-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesListContent}
          inverted={false}
        />

        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator color={brandColor} />
            <T style={{ color: brandColor, marginLeft: 10 }}>{t('chat.uploading')}</T>
          </View>
        )}

        <View style={[styles.inputContainer, { backgroundColor: cardColor, borderTopColor: borderColor }]}>
          {!isRecording ? (
            <>
              <TouchableOpacity onPress={pickImage} style={styles.attachBtn}>
                <Icon name="image-outline" size={24} color={secondaryText} />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickDocument} style={styles.attachBtn}>
                <Icon name="attach-outline" size={24} color={secondaryText} />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#f0f2f5', color: textColor }]}
                placeholder={t('chat.messagePlaceholder')}
                placeholderTextColor={secondaryText}
                value={inputText}
                onChangeText={setInputText}
              />
              {inputText.trim() ? (
                <TouchableOpacity style={[styles.sendButton, { backgroundColor: brandColor }]} onPress={() => handleSendMessage('text')}>
                  <Icon name="chevron-forward-outline" size={24} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.micBtn} onPress={startRecording}>
                  <Icon name="mic-outline" size={24} color={brandColor} />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View style={styles.recordingContainer}>
              <Icon name="mic-outline" size={20} color="#ff4d4d" />
              <T style={styles.recordingTimer}>{recordTime}</T>
              <View style={styles.recordingWave} />
              <TouchableOpacity onPress={stopRecording} style={styles.stopBtn}>
                <Icon name="stop-circle-outline" size={32} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 11, color: '#fff', opacity: 0.75 },
  messagesListContent: { padding: 15, paddingBottom: 25 },
  messageRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-end' },
  messageRowMe: { justifyContent: 'flex-end' },
  messageRowThem: { justifyContent: 'flex-start' },
  miniAvatar: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  miniAvatarText: { fontSize: 12, fontWeight: 'bold' },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '75%' },
  bubbleMe: { borderBottomRightRadius: 4 },
  bubbleThem: { borderBottomLeftRadius: 4 },
  senderNameText: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  messageImage: { width: 200, height: 200, borderRadius: 12, marginVertical: 4 },
  fileAttachment: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.05)', padding: 8, borderRadius: 8, marginVertical: 4 },
  voiceAttachment: { flexDirection: 'row', alignItems: 'center', minWidth: 150, padding: 8 },
  voiceWaveform: { flex: 1, height: 2, marginHorizontal: 10, borderRadius: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 20, height: 40, paddingHorizontal: 15, marginHorizontal: 10 },
  attachBtn: { padding: 5 },
  micBtn: { padding: 5 },
  sendButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  recordingContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
  recordingTimer: { marginLeft: 10, fontWeight: 'bold', color: '#ff4d4d' },
  recordingWave: { flex: 1, height: 2, backgroundColor: '#ff4d4d', marginHorizontal: 20, opacity: 0.3 },
  stopBtn: { padding: 5 },
  uploadingOverlay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: 'rgba(255,255,255,0.9)' },
});
