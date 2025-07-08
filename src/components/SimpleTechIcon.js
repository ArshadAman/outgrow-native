import React from 'react';
import { View, Text } from 'react-native';

export default function SimpleTechIcon({ name, size = 48, color = '#0cb9f2' }) {
  // Simple tech icon using initials - navigation context safe
  const initials = name
    .split(/\s|\./)
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  
  return (
    <View 
      style={{
        width: size,
        height: size,
        borderRadius: size / 8, // Slightly rounded corners
        backgroundColor: '#232D3F',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: color + '40', // Semi-transparent border
        shadowColor: color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
      }}
    >
      <Text 
        style={{
          color: color,
          fontSize: size / 2.5,
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        {initials}
      </Text>
    </View>
  );
}
