import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { db } from '../firebase/firestore';
import { storage } from '../firebase/storage';
import { updateLastMessage } from './chatService';

// Live-subscribe to messages in a chat, oldest first
export function subscribeToMessages(chatId, callback) {
  return db
    .collection('chats')
    .doc(chatId)
    .collection('messages')
    .orderBy('createdAt', 'asc')
    .onSnapshot(
      (snap) => {
        if (snap) {
          callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      },
      (error) => {
        console.error('Error in subscribeToMessages:', error);
      }
    );
}

// Send a message, then denormalize it onto the parent chat doc.
// Field is `createdAt` (not `timestamp`) to match the rules' protected-field check.
export async function sendMessage(chatId, { senderId, text, type = 'text', attachmentUrl = null, attachmentName = null }) {
  const messageData = {
    senderId,
    text: text || '',
    type,
    status: 'sent',
    readBy: [senderId],
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  if (attachmentUrl) {
    messageData.attachmentUrl = attachmentUrl;
    if (attachmentName) messageData.attachmentName = attachmentName;
  }

  await db.collection('chats').doc(chatId).collection('messages').add(messageData);

  let lastMsgText = text;
  if (type === 'image') lastMsgText = '📷 Image';
  else if (type === 'file') lastMsgText = '📄 File';
  else if (type === 'voice') lastMsgText = '🎤 Voice Message';

  return updateLastMessage(chatId, { text: lastMsgText || '', senderId });
}

export async function uploadChatAttachment(chatId, localPath, fileName, type = 'file') {
  const extension = localPath.split('.').pop();
  const storagePath = `chats/${chatId}/${Date.now()}_${fileName || 'attachment'}.${extension}`;
  const reference = storage().ref(storagePath);

  await reference.putFile(localPath);
  return await reference.getDownloadURL();
}

// Mark a message as read — allowed for any participant per the rules
// (update only touches `readBy`/`status`, matching the hasOnly check)
export async function markMessageRead(chatId, messageId, uid) {
  return db.collection('chats').doc(chatId).collection('messages').doc(messageId).update({
    readBy: firestore.FieldValue.arrayUnion(uid),
    status: 'read',
  });
}

// -----------------------------------------------------------
// GEMINI AI � via local bot-server
// -----------------------------------------------------------
const GEMINI_SERVER_URL = 'http://10.0.2.2:3000';

/**
 * Create or fetch the user's Gemini chat. Returns the chatId.
 */
export async function getOrCreateGeminiChat(firebaseUser) {
  if (!firebaseUser) throw new Error('User is not signed in');

  const authUser = auth().currentUser;
  if (!authUser) throw new Error('Firebase Auth user not found');

  const idToken = await authUser.getIdToken();

  const response = await fetch(`${GEMINI_SERVER_URL}/api/gemini/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create Gemini chat');
  }

  return data.chatId;
}

/**
 * Send a message to Gemini and get its reply. Server writes to Firestore.
 */
export async function sendGeminiMessage(firebaseUser, chatId, text) {
  if (!firebaseUser?.uid) throw new Error('User is not signed in');
  if (!chatId) throw new Error('Gemini chat ID is required');
  if (!text?.trim()) throw new Error('Message cannot be empty');

  const authUser = auth().currentUser;
  if (!authUser) throw new Error('Firebase Auth user not found');

  const idToken = await authUser.getIdToken();

  const response = await fetch(`${GEMINI_SERVER_URL}/api/gemini/message`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ chatId, text: text.trim() }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to send Gemini message');
  }

  return data;
}