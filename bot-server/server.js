require('dotenv').config();

const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { GoogleGenAI } = require('@google/genai');
const serviceAccount = require('./firebase-service-account.json');

const app = express();

app.use(express.json());

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const auth = getAuth();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const PORT = process.env.PORT || 3000;

// --- Authentication middleware -------------------------
async function authenticateUser(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';

    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Firebase ID token' });
    }

    const idToken = authorization.replace('Bearer ', '').trim();
    const decodedToken = await auth.verifyIdToken(idToken);
    req.uid = decodedToken.uid;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

// --- Health check -------------------------
app.get('/', (req, res) => {
  res.json({ success: true, message: 'OrbitChat Gemini Bot Server is running' });
});

// --- Create / find Gemini chat -------------------------
app.post('/api/gemini/chat', authenticateUser, async (req, res) => {
  try {
    const uid = req.uid;

    const existing = await db
      .collection('chats')
      .where('type', '==', 'ai')
      .where('botType', '==', 'gemini')
      .where('participants', 'array-contains', uid)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.json({ success: true, chatId: existing.docs[0].id });
    }

    const chatRef = db.collection('chats').doc();

    await chatRef.set({
      type: 'ai',
      botType: 'gemini',
      participants: [uid],
      groupName: 'Gemini AI',
      groupPhotoUrl: null,
      createdBy: uid,
      lastMessage: null,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const messageRef = chatRef.collection('messages').doc();
    const welcomeText = 'Hello! I am Gemini AI. How can I help you today?';

    await messageRef.set({
      senderId: 'gemini-bot',
      text: welcomeText,
      type: 'text',
      status: 'sent',
      readBy: [],
      createdAt: FieldValue.serverTimestamp(),
    });

    await chatRef.update({
      lastMessage: {
        text: welcomeText,
        senderId: 'gemini-bot',
        type: 'text',
        timestamp: FieldValue.serverTimestamp(),
      },
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.json({ success: true, chatId: chatRef.id });
  } catch (error) {
    console.error('Create Gemini chat error:', error);
    return res.status(500).json({ error: 'Failed to create Gemini chat' });
  }
});

// --- Send message to Gemini -------------------------
app.post('/api/gemini/message', authenticateUser, async (req, res) => {
    console.log('?? /api/gemini/message called');
  try {
    const uid = req.uid;
    const { chatId, text } = req.body;

    if (!chatId || !text || !text.trim()) {
      return res.status(400).json({ error: 'chatId and text are required' });
    }

    const chatRef = db.collection('chats').doc(chatId);
    const chatSnap = await chatRef.get();

    if (!chatSnap.exists) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const chatData = chatSnap.data();

    if (
      chatData.type !== 'ai' ||
      chatData.botType !== 'gemini' ||
      !Array.isArray(chatData.participants) ||
      !chatData.participants.includes(uid)
    ) {
      return res.status(403).json({ error: 'You do not have access to this Gemini chat' });
    }

    await chatRef.collection('messages').add({
      senderId: uid,
      text: text.trim(),
      type: 'text',
      status: 'sent',
      readBy: [uid],
      createdAt: FieldValue.serverTimestamp(),
    });

    const messagesSnap = await chatRef
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .limitToLast(10)
      .get();

    const contents = [];

    messagesSnap.docs.forEach((doc) => {
      const message = doc.data();
      if (!message.text) return;

      if (message.senderId === 'gemini-bot') {
        contents.push({ role: 'model', parts: [{ text: message.text }] });
      } else {
        contents.push({ role: 'user', parts: [{ text: message.text }] });
      }
    });

    console.log('Calling Gemini with ' + contents.length + ' messages...');

    const SYSTEM_INSTRUCTION = `
You are Gemini AI, the built-in assistant inside OrbitChat.

ABOUT ORBITCHAT:
- OrbitChat is the official secure messaging app for the Space Science and Geospatial Institute (SSGI) in Ethiopia.
- It is used internally by SSGI staff: researchers, engineers, scientists, and administrators.
- Users can chat in direct messages, group channels by department, share files, images, and voice notes.
- Departments include Space Science, Geospatial Division, Research, Operations, and Support.
- The app is designed for secure, professional team collaboration - not general public chat.

YOUR ROLE:
- Help SSGI staff with work-related questions: programming, research, writing, data analysis, education, and general problem solving.
- Be professional, clear, and concise.
- If asked about OrbitChat, describe it as above - the SSGI internal messaging platform.
- Do not describe OrbitChat as a general-purpose consumer chat app.
`.trim();

    const MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.8-flash'];

    let response = null;
    let lastError = null;

    for (const modelName of MODELS) {
      for (let attempt = 1; attempt <= 1; attempt++) {
        try {
          console.log('   -> Trying ' + modelName + ' (attempt ' + attempt + ')');
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout after 15s')), 15000)
          );
          response = await Promise.race([ai.models.generateContent({
            model: modelName,
            contents,
            config: { systemInstruction: SYSTEM_INSTRUCTION },
          }), timeoutPromise]);
          console.log('   OK ' + modelName + ' responded');
          break;
        } catch (err) {
          lastError = err;
          console.error('   FAIL ' + modelName + ':', err.message);
          await new Promise((r) => setTimeout(r, 500));
        }
      }
      if (response) break;
    }

    if (!response) {
      throw lastError || new Error('All models failed');
    }

    const botText = response.text || 'Sorry, I could not generate a response right now.';

    await chatRef.collection('messages').add({
      senderId: 'gemini-bot',
      text: botText,
      type: 'text',
      status: 'sent',
      readBy: [],
      createdAt: FieldValue.serverTimestamp(),
    });

    await chatRef.update({
      lastMessage: {
        text: botText,
        senderId: 'gemini-bot',
        type: 'text',
        timestamp: FieldValue.serverTimestamp(),
      },
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.json({ success: true, response: botText });
  } catch (error) {
    console.error('Gemini message error:', error);
    return res.status(500).json({ error: 'Failed to generate Gemini response', details: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('OrbitChat Gemini Bot Server');
  console.log(`Running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log('========================================');
});
