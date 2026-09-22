import React from 'react';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';
import SsgiLogo from '../assets/images/ssgi-logo.svg';

export function LogoSVG({ width = 200, height = 90 }) {
  return <SsgiLogo width={width} height={height} />;
}

export function AntennaTip({ width = 110, height = 110 }) {
  const ORANGE = '#de994a';

  return (
    <Svg width={width} height={height} viewBox="0 0 220 220" fill="none">
      {/* Left broadcast waves */}
      <Path d="M92 65 Q82 80 92 95" stroke={ORANGE} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <Path d="M82 55 Q68 80 82 105" stroke={ORANGE} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <Path d="M72 45 Q54 80 72 115" stroke={ORANGE} strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* Right broadcast waves */}
      <Path d="M128 65 Q138 80 128 95" stroke={ORANGE} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <Path d="M138 55 Q152 80 138 105" stroke={ORANGE} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <Path d="M148 45 Q166 80 148 115" stroke={ORANGE} strokeWidth="4.5" fill="none" strokeLinecap="round" />

      {/* Antenna: top dot */}
      <Circle cx="110" cy="60" r="3.5" fill={ORANGE} />

      {/* Antenna: upper stem */}
      <Path d="M110 63 L110 72" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />

      {/* Antenna: main body */}
      <Ellipse cx="110" cy="85" rx="6" ry="13" fill={ORANGE} />

      {/* Antenna: lower stem — reaches the BOTTOM of the viewBox */}
      <Path d="M110 98 L110 220" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}
