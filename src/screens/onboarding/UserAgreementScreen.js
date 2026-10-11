import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import T from '../../components/T';
import { LogoSVG } from '../../components/Branding';

export default function UserAgreementScreen({ onAccept, onDecline }) {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);

  const getText = (key, fallback) => {
    const val = t(key);
    if (!val || val === key) return fallback;
    return val;
  };

  const handleAccept = () => {
    if (!isChecked) return;
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    Alert.alert(
      getText('agreement.declineTitle', 'Agreement Required'),
      getText(
        'agreement.declineMessage',
        'You must accept the User Agreement and Privacy Policy to use Orbit Chat.',
      ),
      [{ text: getText('common.ok', 'OK') }],
    );
    if (onDecline) onDecline();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <LogoSVG width={42} height={42} />
        <T style={styles.appName}>ORBIT CHAT</T>
      </View>

      <View style={styles.titleWrap}>
        <T style={styles.title}>
          {getText('agreement.title', 'User Agreement')}
        </T>
        <T style={styles.subtitle}>
          {getText(
            'agreement.subtitle',
            'Please review and accept our terms to continue.',
          )}
        </T>
      </View>

      <View style={styles.scrollWrap}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <T style={styles.sectionHeading}>
            {getText('agreement.section1Title', '1. Acceptance of Terms')}
          </T>
          <T style={styles.paragraph}>
            {getText(
              'agreement.section1Body',
              'By accessing or using Orbit Chat, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use the application.',
            )}
          </T>

          <T style={styles.sectionHeading}>
            {getText('agreement.section2Title', '2. Use of Service')}
          </T>
          <T style={styles.paragraph}>
            {getText(
              'agreement.section2Body',
              'Orbit Chat is provided for secure communication among SSGI staff, researchers, and authorized personnel. You agree to use the service only for lawful purposes and in accordance with all applicable organizational policies.',
            )}
          </T>

          <T style={styles.sectionHeading}>
            {getText('agreement.section3Title', '3. Privacy and Data Protection')}
          </T>
          <T style={styles.paragraph}>
            {getText(
              'agreement.section3Body',
              'We take your privacy seriously. Messages, files, and personal data are handled in accordance with our Privacy Policy. Data may be stored securely and used only to provide and improve the service.',
            )}
          </T>

          <T style={styles.sectionHeading}>
            {getText('agreement.section4Title', '4. Confidentiality')}
          </T>
          <T style={styles.paragraph}>
            {getText(
              'agreement.section4Body',
              'You agree to maintain the confidentiality of all information shared through Orbit Chat and not to disclose sensitive content to unauthorized parties.',
            )}
          </T>

          <T style={styles.sectionHeading}>
            {getText('agreement.section5Title', '5. Code of Conduct')}
          </T>
          <T style={styles.paragraph}>
            {getText(
              'agreement.section5Body',
              'You agree not to use Orbit Chat to transmit any unlawful, harassing, defamatory, or otherwise objectionable content. Violation may result in suspension or termination of access.',
            )}
          </T>

          <T style={styles.sectionHeading}>
            {getText('agreement.section6Title', '6. Changes to Terms')}
          </T>
          <T style={styles.paragraph}>
            {getText(
              'agreement.section6Body',
              'We reserve the right to update these terms at any time. Continued use of Orbit Chat after changes constitutes acceptance of the updated terms.',
            )}
          </T>

          <T style={styles.sectionHeading}>
            {getText('agreement.section7Title', '7. Contact')}
          </T>
          <T style={styles.paragraph}>
            {getText(
              'agreement.section7Body',
              'If you have any questions regarding these terms, please contact your system administrator or the SSGI IT support team.',
            )}
          </T>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        activeOpacity={0.7}
        onPress={() => setIsChecked(!isChecked)}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && (
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path
                d="M5 13l4 4L19 7"
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          )}
        </View>
        <T style={styles.checkboxLabel}>
          {getText(
            'agreement.checkbox',
            'I have read and agree to the Terms of Service and Privacy Policy.',
          )}
        </T>
      </TouchableOpacity>

      <View style={styles.buttonWrap}>
        <TouchableOpacity
          style={[styles.acceptButton, !isChecked && styles.acceptDisabled]}
          activeOpacity={0.88}
          onPress={handleAccept}
          disabled={!isChecked}
        >
          <T style={styles.acceptText}>
            {getText('agreement.accept', 'ACCEPT AND CONTINUE')}
          </T>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.declineButton}
          activeOpacity={0.7}
          onPress={handleDecline}
        >
          <T style={styles.declineText}>
            {getText('agreement.decline', 'Decline')}
          </T>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingBottom: 4,
  },
  appName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#102A43',
    letterSpacing: 2,
    marginTop: 4,
  },
  titleWrap: {
    paddingHorizontal: 26,
    marginTop: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F2238',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#627D98',
    marginTop: 6,
    lineHeight: 19,
  },
  scrollWrap: {
    flex: 1,
    marginHorizontal: 26,
    borderRadius: 12,
    backgroundColor: '#F6F8FB',
    borderWidth: 1,
    borderColor: '#E1E8F0',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F2238',
    marginTop: 12,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  paragraph: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 6,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
    marginTop: 16,
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#DD984B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#DD984B',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#102A43',
    lineHeight: 19,
    fontWeight: '600',
  },
  buttonWrap: {
    paddingHorizontal: 26,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
  },
  acceptButton: {
    backgroundColor: '#DD984B',
    paddingVertical: 16,
    borderRadius: 26,
    alignItems: 'center',
    shadowColor: '#DD984B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  acceptDisabled: {
    backgroundColor: '#C9CFD8',
    shadowOpacity: 0,
    elevation: 0,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  declineButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  declineText: {
    color: '#627D98',
    fontSize: 13,
    fontWeight: '700',
  },
});