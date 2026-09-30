import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from '../i18n';

export default function T({ style, ...props }) {
  const { i18n } = useTranslation();
  const isAmharic = i18n?.language === 'am' || i18n?.language?.startsWith('am');
  const fontStyle = isAmharic
    ? { fontFamily: 'NotoSansEthiopic-Regular', fontWeight: 'normal', fontStyle: 'normal' }
    : null;
  return <Text {...props} style={[style, fontStyle]} />;
}
