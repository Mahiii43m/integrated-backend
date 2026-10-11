import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import T from './T';
import { useTranslation } from 'react-i18next';
import { useUserProfiles, getDisplayName } from '../services/userService';

const GOLD = '#DD984B';
const LIGHT = '#F6F8FB';
const BORDER = '#E1E8F0';
const TEXT_DARK = '#102A43';
const TEXT_GRAY = '#627D98';
const DANGER = '#E23D3D';

const Icon = ({ name, size = 20, color = '#fff' }) => {
  let path = '';
  if (name === 'close') path = 'M18 6L6 18 M6 6l12 12';
  if (name === 'back') path = 'M15 19l-7-7 7-7';
  if (name === 'chevron') path = 'M9 18l6-6-6-6';
  if (name === 'mail') path = 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6';
  if (name === 'briefcase') path = 'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16';
  if (name === 'phone') path = 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';
  if (name === 'shield') path = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4';
  if (name === 'leave') path = 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9';
  if (name === 'trash') path = 'M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6';
  if (name === 'chat') path = 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

function Avatar({ name, size = 44, highlight = false }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, highlight && { backgroundColor: GOLD }]}>
      <T style={[styles.avatarText, { fontSize: size * 0.4 }, highlight && { color: '#fff' }]}>
        {(name || '?').substring(0, 1).toUpperCase()}
      </T>
    </View>
  );
}

function MemberDetails({ uid, profiles, admins, onBack, onMessage }) {
  const { t } = useTranslation();
  const profile = profiles[uid] || {};
  const name = getDisplayName(profiles, uid);
  const isAdmin = admins.includes(uid);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Icon name="back" size={22} color={TEXT_DARK} />
        </TouchableOpacity>
        <T style={styles.subHeaderTitle}>Contact Info</T>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.detailsBody}>
        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <Avatar name={name} size={92} highlight={isAdmin} />
          <T style={styles.bigName}>{name}</T>
          {isAdmin && (
            <View style={styles.adminPill}>
              <Icon name="shield" size={12} color="#fff" />
              <T style={styles.adminPillText}>{t('groupInfo.admin')}</T>
            </View>
          )}
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Icon name="briefcase" size={18} color={GOLD} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <T style={styles.detailLabel}>{t('groupInfo.department')}</T>
              <T style={styles.detailValue}>{profile.department || t('groupInfo.notSpecified')}</T>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Icon name="mail" size={18} color={GOLD} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <T style={styles.detailLabel}>{t('groupInfo.email')}</T>
              <T style={styles.detailValue}>{profile.email || t('groupInfo.notAvailable')}</T>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Icon name="phone" size={18} color={GOLD} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <T style={styles.detailLabel}>{t('groupInfo.phone')}</T>
              <T style={styles.detailValue}>{profile.phone || t('groupInfo.notAvailable')}</T>
            </View>
          </View>
        </View>

        {onMessage && (
          <TouchableOpacity style={styles.primaryBtn} onPress={onMessage}>
            <Icon name="chat" size={18} color="#fff" />
            <T style={styles.primaryBtnText}>{t('groupInfo.message')}</T>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

export default function GroupInfoModal({
  visible,
  onClose,
  groupDetails,
  contactUid,
  contactName,
  currentUid,
  onDelete,
  onLeave,
  onMessageUser,
}) {
  const { t } = useTranslation();
  const isGroup = !!groupDetails;
  const participantUids = isGroup
    ? (groupDetails.participants || [])
    : (contactUid ? [contactUid] : []);
  const profiles = useUserProfiles(participantUids);
  const [selectedUid, setSelectedUid] = useState(null);

  const admins = groupDetails?.admins || [];
  const isAdmin = admins.includes(currentUid);
  const groupName = groupDetails?.name || contactName || 'Chat Info';
  const department = groupDetails?.department || '';

  const handleClose = () => {
    setSelectedUid(null);
    onClose();
  };

  const confirmDeleteGroup = () => {
    Alert.alert(
      t('groupInfo.deleteGroupTitle'),
      t('groupInfo.deleteGroupMessage'),
      [
        { text: t('groupInfo.cancel'), style: 'cancel' },
        {
          text: t('groupInfo.delete'),
          style: 'destructive',
          onPress: () => { handleClose(); onDelete && onDelete(); },
        },
      ],
    );
  };

  const confirmDeleteChat = () => {
    Alert.alert(
      t('groupInfo.deleteChatTitle'),
      t('groupInfo.deleteChatMessage'),
      [
        { text: t('groupInfo.cancel'), style: 'cancel' },
        {
          text: t('groupInfo.delete'),
          style: 'destructive',
          onPress: () => { handleClose(); onDelete && onDelete(); },
        },
      ],
    );
  };

  const confirmLeaveGroup = () => {
    Alert.alert(
      t('groupInfo.leaveGroupTitle'),
      t('groupInfo.leaveGroupMessage'),
      [
        { text: t('groupInfo.cancel'), style: 'cancel' },
        {
          text: t('groupInfo.leave'),
          style: 'destructive',
          onPress: () => { handleClose(); onLeave && onLeave(); },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {selectedUid ? (
            <MemberDetails
              uid={selectedUid}
              profiles={profiles}
              admins={admins}
              onBack={() => setSelectedUid(null)}
              onMessage={onMessageUser ? () => { handleClose(); onMessageUser(selectedUid); } : null}
            />
          ) : (
            <>
              <View style={styles.header}>
                <View style={styles.iconBtn} />
                <T style={styles.headerTitle}>{isGroup ? t('groupInfo.title') : t('groupInfo.contactTitle')}</T>
                <TouchableOpacity onPress={handleClose} style={styles.iconBtn}>
                  <Icon name="close" size={22} color={TEXT_DARK} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
                {isGroup && (
                  <View style={styles.groupHeader}>
                    <Avatar name={groupName} size={92} highlight />
                    <T style={styles.groupName}>{groupName}</T>
                    {department ? <T style={styles.groupDept}>{department}</T> : null}
                    <T style={styles.groupMeta}>
                      {participantUids.length} {participantUids.length === 1 ? t('groupInfo.member') : t('groupInfo.members_plural')}
                    </T>
                  </View>
                )}

                {!isGroup && participantUids[0] && (
                  <MemberDetails
                    uid={participantUids[0]}
                    profiles={profiles}
                    admins={admins}
                    onBack={handleClose}
                    onMessage={onMessageUser ? () => { handleClose(); onMessageUser(participantUids[0]); } : null}
                  />
                )}

                {isGroup && (
                  <>
                    <View style={styles.sectionLabelWrap}>
                      <T style={styles.sectionLabel}>{t('groupInfo.members')}</T>
                    </View>
                    <View style={styles.memberList}>
                      {participantUids.map((uid, idx) => {
                        const name = getDisplayName(profiles, uid);
                        const memberIsAdmin = admins.includes(uid);
                        const isMe = uid === currentUid;
                        return (
                          <TouchableOpacity
                            key={uid}
                            style={[styles.memberRow, idx === participantUids.length - 1 && { borderBottomWidth: 0 }]}
                            onPress={() => setSelectedUid(uid)}
                            activeOpacity={0.7}
                          >
                            <Avatar name={name} size={44} highlight={memberIsAdmin} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <T style={styles.memberName} numberOfLines={1}>
                                  {name}{isMe ? ` ${t('groupInfo.you')}` : ''}
                                </T>
                                {memberIsAdmin && (
                                  <View style={styles.miniAdminPill}>
                                    <T style={styles.miniAdminText}>{t('groupInfo.admin')}</T>
                                  </View>
                                )}
                              </View>
                              <T style={styles.memberSub} numberOfLines={1}>
                                {profiles[uid]?.department || t('groupInfo.ssgiStaff')}
                              </T>
                            </View>
                            <Icon name="chevron" size={20} color={TEXT_GRAY} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}

                {/* ─── Actions ─── */}
                {isGroup ? (
                  <>
                    <TouchableOpacity style={styles.actionBtn} onPress={confirmLeaveGroup} activeOpacity={0.7}>
                      <Icon name="leave" size={18} color={DANGER} />
                      <T style={styles.actionText}>{t('groupInfo.leaveGroup')}</T>
                    </TouchableOpacity>

                    {isAdmin && (
                      <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={confirmDeleteGroup} activeOpacity={0.7}>
                        <Icon name="trash" size={18} color="#fff" />
                        <T style={[styles.actionText, { color: '#fff' }]}>{t('groupInfo.deleteGroup')}</T>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <TouchableOpacity style={styles.actionBtn} onPress={confirmDeleteChat} activeOpacity={0.7}>
                    <Icon name="trash" size={18} color={DANGER} />
                    <T style={styles.actionText}>{t('groupInfo.deleteChat')}</T>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: '82%',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) * 0.6 : 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '900', color: TEXT_DARK, letterSpacing: 0.4 },
  subHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  subHeaderTitle: { fontSize: 16, fontWeight: '900', color: TEXT_DARK, letterSpacing: 0.4 },
  groupHeader: { alignItems: 'center', paddingTop: 24, paddingBottom: 20, paddingHorizontal: 24 },
  groupName: { fontSize: 22, fontWeight: '900', color: TEXT_DARK, marginTop: 14, textAlign: 'center', letterSpacing: -0.3 },
  groupDept: { fontSize: 13, color: GOLD, fontWeight: '800', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' },
  groupMeta: { fontSize: 12, color: TEXT_GRAY, marginTop: 6, fontWeight: '600' },
  sectionLabelWrap: { paddingHorizontal: 22, marginTop: 8, marginBottom: 10 },
  sectionLabel: { fontSize: 11, fontWeight: '900', color: TEXT_GRAY, letterSpacing: 2 },
  memberList: { marginHorizontal: 16, backgroundColor: LIGHT, borderRadius: 14, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: BORDER },
  memberName: { fontSize: 14, fontWeight: '800', color: TEXT_DARK, flexShrink: 1 },
  memberSub: { fontSize: 11, color: TEXT_GRAY, marginTop: 2 },
  avatar: { backgroundColor: LIGHT, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: GOLD },
  avatarText: { fontWeight: '900', color: GOLD },
  miniAdminPill: { backgroundColor: GOLD, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
  miniAdminText: { color: '#fff', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 22, marginHorizontal: 22, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: '#F6D3D3', backgroundColor: '#FFF5F5',
  },
  actionBtnDanger: { backgroundColor: DANGER, borderColor: DANGER, marginTop: 10 },
  actionText: { color: DANGER, fontSize: 13, fontWeight: '900', letterSpacing: 1, marginLeft: 8 },
  detailsBody: { padding: 24 },
  bigName: { fontSize: 22, fontWeight: '900', color: TEXT_DARK, marginTop: 14, textAlign: 'center', letterSpacing: -0.3 },
  adminPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: GOLD, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  adminPillText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginLeft: 4 },
  detailCard: { backgroundColor: LIGHT, borderRadius: 14, borderWidth: 1, borderColor: BORDER, paddingVertical: 4, marginBottom: 22 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  detailLabel: { fontSize: 11, fontWeight: '800', color: TEXT_GRAY, letterSpacing: 0.6, textTransform: 'uppercase' },
  detailValue: { fontSize: 14, fontWeight: '700', color: TEXT_DARK, marginTop: 2 },
  divider: { height: 1, backgroundColor: BORDER, marginHorizontal: 16 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: GOLD, paddingVertical: 15, borderRadius: 26,
    shadowColor: GOLD, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 1.5, marginLeft: 8 },
});