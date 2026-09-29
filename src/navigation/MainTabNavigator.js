import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../firebase/context/ThemeContext';
import { useAuth } from '../firebase/context/AuthContext';
import { useTranslation } from '../i18n';
import T from '../components/T';
import ChatsListScreen from '../screens/home/ChatListScreen';
import ContactsScreen from '../screens/home/homescreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const Icon = ({ name, size = 24, color = '#000' }) => {
  let path = '';
  if (name === 'chatbubble-ellipses-outline') path = 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-13.1c1.5 0 3 .4 4.3 1.1L21 1.5l-1.1 4.2c.7 1.3 1.1 2.8 1.1 4.3z M8 12h.01 M12 12h.01 M16 12h.01';
  if (name === 'call-outline') path = 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z';
  if (name === 'people-outline') path = 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0-4-4 4 4 0 0 0 4 4z';
  if (name === 'settings-outline') path = 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z';
  if (name === 'person-outline') path = 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2';

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <Path d={path} />
    </Svg>
  );
};

export default function MainTabNavigator() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  const initial = (user?.fullName || user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: colors.background,
          borderRadius: 28,
          borderTopWidth: 0,
          height: 68,
          paddingBottom: 4,
          paddingTop: 6,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatsListScreen}
        options={{
          tabBarLabel: ({ color }) => <T style={{ color, fontSize: 11 }}>{t('tabs.chats')}</T>,
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarLabel: ({ color }) => <T style={{ color, fontSize: 11 }}>{t('tabs.contacts')}</T>,
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: ({ color }) => <T style={{ color, fontSize: 11 }}>{t('tabs.settings')}</T>,
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ color }) => <T style={{ color, fontSize: 11 }}>{t('tabs.profile')}</T>,
          tabBarIcon: ({ color, size, focused }) =>
            user?.profilePicture ? (
              <View
                style={{
                  width: size + 4,
                  height: size + 4,
                  borderRadius: (size + 4) / 2,
                  borderWidth: focused ? 2 : 0,
                  borderColor: color,
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={{ uri: user.profilePicture }}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            ) : (
              <View
                style={{
                  width: size + 4,
                  height: size + 4,
                  borderRadius: (size + 4) / 2,
                  borderWidth: focused ? 2 : 0,
                  borderColor: color,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: size * 0.55, fontWeight: 'bold' }}>
                  {initial}
                </Text>
              </View>
            ),
        }}
      />
    </Tab.Navigator>
  );
}
