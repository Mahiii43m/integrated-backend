import i18n from 'i18next';
import { initReactI18next, setI18n, useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import am from './am.json';

const LANGUAGE_KEY = 'app_language';

setI18n(i18n);

export const initI18n = async () => {
  let lng = 'en';
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved === 'am' || saved === 'en') {
      lng = saved;
    }
  } catch (e) {
    console.warn('Failed to load language pref:', e);
  }

  if (!i18n.isInitialized) {
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
  } else {
    i18n.addResourceBundle('en', 'translation', en, true, true);
    i18n.addResourceBundle('am', 'translation', am, true, true);
    if (i18n.language !== lng) {
      await i18n.changeLanguage(lng);
    }
  }
  return true;
};

export const changeLanguage = async (lang) => {
  try {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.warn('changeLanguage failed:', e);
  }
};

export { useTranslation };
export default i18n;
