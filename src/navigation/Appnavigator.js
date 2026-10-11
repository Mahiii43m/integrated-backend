import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../firebase/context/AuthContext';

import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import UserAgreementScreen from '../screens/onboarding/UserAgreementScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import ChatWindowScreen from '../screens/chat/ChatWindowScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ChatDetailsScreen from '../screens/Profile/ChatDetailsScreen';
import MainTabNavigator from './MainTabNavigator';
import CallsScreen from '../screens/home/CallsScreen';

import SettingsScreen from '../screens/settings/SettingsScreen';
import NotificationsScreen from '../screens/notification/NotificationsScreen';
import BaseScreen from '../screens/settings/BaseScreen';
import NewChatScreen from '../screens/chat/NewChatScreen';
import NewGroupScreen from '../screens/chat/NewGroupScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import AccountScreen from '../screens/settings/AccountScreen';
import ThemeScreen from '../screens/settings/ThemeScreen';
import NotificationSoundScreen from '../screens/settings/NotificationSoundScreen';
import LanguageScreen from '../screens/settings/LanguageScreen';
import NotificationsSettingsScreen from '../screens/settings/NotificationsSettingsScreen';
import PrivacySecurityScreen from '../screens/settings/PrivacySecurityScreen';
import HelpFAQScreen from '../screens/settings/HelpFAQScreen';
import AccentColorScreen from '../screens/settings/AccentColorScreen';
import ChatSettingsScreen from '../screens/settings/ChatSettingsScreen';
import BackupStorageScreen from '../screens/settings/BackupStorageScreen';
import MessageSettingsScreen from '../screens/settings/MessageSettingsScreen';
import DevicesScreen from '../screens/settings/DevicesScreen';

const Stack = createNativeStackNavigator();
const ONBOARDING_COMPLETED_KEY = 'has_completed_onboarding';
const AGREEMENT_ACCEPTED_KEY = 'has_accepted_agreement';

export default function AppNavigator() {
  const { user, loading } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState(null);
  const [hasAcceptedAgreement, setHasAcceptedAgreement] = useState(null);

  useEffect(() => {
    (async () => {
      const onboarded = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      const agreed = await AsyncStorage.getItem(AGREEMENT_ACCEPTED_KEY);
      setHasOnboarded(onboarded === 'true');
      setHasAcceptedAgreement(agreed === 'true');
    })();
  }, []);

  if (loading || hasOnboarded === null || hasAcceptedAgreement === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#DD984B" />
      </View>
    );
  }

  // STAGE 1: ONBOARDING
  if (!hasOnboarded) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding">
            {(props) => (
              <OnboardingScreen
                {...props}
                onFinish={async () => {
                  await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
                  setHasOnboarded(true);
                }}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // STAGE 1.5: USER AGREEMENT
  if (!hasAcceptedAgreement) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="UserAgreement">
            {(props) => (
              <UserAgreementScreen
                {...props}
                onAccept={async () => {
                  await AsyncStorage.setItem(AGREEMENT_ACCEPTED_KEY, 'true');
                  setHasAcceptedAgreement(true);
                }}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // STAGE 2: AUTH
  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // STAGE 3: MAIN APP
  if (!user.emailVerified) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Calls" component={CallsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatWindow" component={ChatWindowScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ChatDetails" component={ChatDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NewChat" component={NewChatScreen} />
        <Stack.Screen name="NewGroup" component={NewGroupScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />

        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
        <Stack.Screen name="Devices" component={DevicesScreen} />
        <Stack.Screen name="Chats" component={ChatSettingsScreen} />
        <Stack.Screen name="MessageSettings" component={MessageSettingsScreen} />
        <Stack.Screen name="BackupStorage" component={BackupStorageScreen} />
        <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />
        <Stack.Screen name="NotificationSound" component={NotificationSoundScreen} />
        <Stack.Screen name="ThemePicker" component={ThemeScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="AccentColor" component={AccentColorScreen} />
        <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});