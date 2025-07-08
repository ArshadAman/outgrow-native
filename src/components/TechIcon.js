import React from 'react';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

// Safer import approach for simple-icons
let icons = {};
try {
  icons = require('simple-icons');
} catch (error) {
  console.warn('Simple icons not available:', error);
  icons = {};
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default function TechIcon({ name, size = 48, color = '#0cb9f2' }) {
  const normName = normalize(name);
  let icon = null;
  
  // Safely iterate through icons
  if (icons && typeof icons === 'object') {
    for (const key in icons) {
      const ic = icons[key];
      if (!ic || typeof ic !== 'object') continue;
      if (
        normalize(ic.title) === normName ||
        (ic.slug && normalize(ic.slug) === normName) ||
        (ic.id && normalize(ic.id) === normName)
      ) {
        icon = ic;
        break;
      }
    }
  }
  
  if (!icon) {
    // fallback: show initials using react-native-svg Text
    const initials = name.split(/\s|\./).map(w => w[0]).join('').slice(0,3).toUpperCase();
    return (
      <Svg width={size} height={size} viewBox="0 0 48 48">
        <Path d="M0 0h48v48H0z" fill="#232D3F" />
        <SvgText
          x="24" y="28" textAnchor="middle"
          fontSize={size/2} fill={color} fontWeight="bold"
        >{initials}</SvgText>
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={icon.path} fill={color} />
    </Svg>
  );
}
