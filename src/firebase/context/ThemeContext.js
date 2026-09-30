import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme Presets
export const THEME_PRESETS = {
  ssgiBlue: {
    name: 'SSGI Blue',
    primary: '#0080ce',
    accent: '#de994a',
  },
  gold: {
    name: 'Gold',
    primary: '#b8860b',
    accent: '#f0c040',
  },
  purple: {
    name: 'Purple',
    primary: '#6c5ce7',
    accent: '#a29bfe',
  },
  deepSpace: {
    name: 'Deep Space',
    primary: '#0080ce',
    accent: '#6c5ce7',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();

  const [themeMode, setThemeMode] = useState('dark');
  const [preset, setPreset] = useState('ssgiBlue');
  const [accentColor, setAccentColor] = useState(null);

  const theme = themeMode === 'system'
    ? (systemScheme === 'dark' ? 'dark' : 'light')
    : themeMode;

  const isDark = theme === 'dark';

  // Base palettes
  const baseColors = {
    light: {
      background: '#ffffff',
      text: '#1a1a1a',
      headerBg: '#0080ce',
      headerText: '#ffffff',
      searchBg: 'rgba(255,255,255,0.88)',
      searchText: '#333333',
      tabBg: 'transparent',
      tabActiveBg: '#de994a',
      tabText: '#4a3b1f',
      tabActiveText: '#ffffff',
      rowBg: '#ffffff',
      rowText: '#111111',
      rowPreview: '#666666',
      rowTime: '#8a8a8a',
      border: '#e0e0e0',
      unreadBg: '#1b5674',
      bottomBarBg: '#b6a378',
      navCapsuleBg: '#ffffff',
      navIconActive: '#1b5674',
      navIconInactive: '#aaaaaa',
      modalBg: '#ffffff',
      modalText: '#111111',
      primary: '#0088cc',
      // Telegram-style gradient (subtle)
      gradientStart: '#ffffff',
      gradientEnd: '#f0f4f8',
    },
    dark: {
      // Telegram-style blue-gray palette
      background: '#17212b',
      text: '#e9edf2',
      headerBg: '#005a94',
      headerText: '#ffffff',
      searchBg: '#242f3e',
      searchText: '#e9edf2',
      tabBg: 'transparent',
      tabActiveBg: '#0080ce',
      tabText: '#8a9aab',
      tabActiveText: '#ffffff',
      rowBg: '#1e2b38',
      rowText: '#e9edf2',
      rowPreview: '#8a9aab',
      rowTime: '#708499',
      border: '#2b3a4a',
      unreadBg: '#0080ce',
      bottomBarBg: '#17212b',
      navCapsuleBg: '#232e3c',
      navIconActive: '#0080ce',
      navIconInactive: '#708499',
      modalBg: '#232e3c',
      modalText: '#e9edf2',
      primary: '#0080ce',
      // Telegram-style dark gradient (deep blue -> darker)
      gradientStart: '#1a2532',
      gradientEnd: '#0f1821',
    },
  };

  // Layer preset + custom accent on top of the base palette
  const presetColors = THEME_PRESETS[preset] || THEME_PRESETS.ssgiBlue;
  const resolvedAccent = accentColor || presetColors.accent;

  const currentTheme = {
    ...(baseColors[theme] || baseColors.light),
    primary: presetColors.primary,
    tabActiveBg: resolvedAccent,
    unreadBg: resolvedAccent,
    navIconActive: presetColors.primary,
  };

  // Persistence
  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    savePreferences();
  }, [themeMode, preset, accentColor]);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme_prefs');
      if (saved) {
        const prefs = JSON.parse(saved);
        if (prefs.themeMode) setThemeMode(prefs.themeMode);
        if (prefs.preset) setPreset(prefs.preset);
        if (prefs.accentColor) setAccentColor(prefs.accentColor);
      }
    } catch (error) {
      console.warn('Failed to load theme preferences', error);
    }
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('theme_prefs', JSON.stringify({
        themeMode,
        preset,
        accentColor,
      }));
    } catch (error) {
      console.warn('Failed to save theme preferences', error);
    }
  };

  const setTheme = (mode) => setThemeMode(mode);
  const setThemePreset = (p) => setPreset(p);
  const setCustomAccent = (color) => setAccentColor(color);

  const toggleTheme = () => {
    setThemeMode(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        themeMode,
        preset,
        accentColor,
        colors: currentTheme,
        toggleTheme,
        setTheme,
        setThemePreset,
        setCustomAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
