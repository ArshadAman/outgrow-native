// PremiumLoader.js
// A beautiful, smooth Lottie-based loading animation for premium feel
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';

// You can replace this with any premium Lottie JSON animation you like
// Example: https://lottiefiles.com/animations/loading-gradient-2-1k6v1v1v
const ANIMATION = require('../assets/lottie/premium-loader.json');

export default function PremiumLoader({ size = 180 }) {
  return (
    <View style={styles.container}>
      <LottieView
        source={ANIMATION}
        autoPlay
        loop
        style={{ width: size, height: size }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
});
