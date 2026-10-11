import auth from '@react-native-firebase/auth';

/**
 * Base URL of the Gemini bot server.
 * Android emulator uses 10.0.2.2 to reach localhost of the host machine.
 */
const BOT_BASE_URL = 'http://10.0.2.2:3000';

/**
 * Get the current user's Firebase ID token.
 */
async function getAuthToken() {
  const user = auth().currentUser;
  if (!user) throw new Error('User is not signed in');
  return user.getIdToken();
}

/**
 * Ask the server to create or fetch the user's Gemini chat.
 * Returns the Firestore chatId.
 */
export async function getOrCreateBotChat() {
  const token = await getAuthToken();

  const response = await fetch(`${BOT_BASE_URL}/api/gemini/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Could not open Gemini chat');
  }

  return data.chatId;
}

/**
 * Send a text message to Gemini. Server saves it and replies.
 */
export async function sendBotMessage(chatId, text) {
  const token = await getAuthToken();

  const response = await fetch(`${BOT_BASE_URL}/api/gemini/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId, text }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Gemini did not respond');
  }

  return data.response;
}

/**
 * Legacy helper kept for backward compat — no longer used.
 */
export async function pingBot(chatId) {
  const token = await getAuthToken();
  const response = await fetch(`${BOT_BASE_URL}/api/gemini/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId }),
  });
  return response.json();
}
