import { useState, useEffect, useCallback } from 'react';
import i18n from 'i18next';
import { initReactI18next, setI18n } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import am from './am.json';

const LANGUAGE_KEY = 'app_language';

setI18n(i18n);

let initPromise = null;

export const initI18n = async () => {
  if (i18n.isInitialized) return true;
  if (!initPromise) {
    initPromise = (async () => {
      let lng = 'en';
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (saved === 'am' || saved === 'en') {
          lng = saved;
        }
      } catch (e) {
        console.warn('Failed to load language pref:', e);
      }

      await i18n.use(initReactI18next).init({
        resources: {
          en: { translation: en },
          am: { translation: am },
        },
        lng,
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        react: {
          useSuspense: false,
        },
      });
      return true;
    })();
  }
  try {
    await initPromise;
    return true;
  } catch (e) {
    console.warn('i18n init failed:', e);
    return false;
  }
};

export const changeLanguage = async (lang) => {
  try {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.warn('changeLanguage failed:', e);
  }
};

export function useTranslation() {
  const [lang, setLang] = useState(i18n.language || 'en');

  useEffect(() => {
    const handleChanged = (l) => setLang(l);
    i18n.on('languageChanged', handleChanged);
    return () => {
      i18n.off('languageChanged', handleChanged);
    };
  }, []);

  const t = useCallback((key, options) => {
    return i18n.t(key, options);
  }, [lang]);

  return { t, i18n };
}

export default i18n;
