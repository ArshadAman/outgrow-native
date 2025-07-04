import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signupSchema } from '../utils/validation';
import { register } from '../auth/authService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Dimensions } from 'react-native';

const SOCIALS = [
  { name: 'Google', icon: { uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' } },
  { name: 'Apple', icon: { uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' } },
  { name: 'GitHub', icon: { uri: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' } },
];

// --- Symbol physics config ---
const SYMBOLS = [
  '{ }', '<>', '</>', '()', '/* */', '//', 'const', 'let', '=>', '===', '[ ]', 'import', 'export', 'return', 'if', 'else', 'try', 'catch', 'function', 'class', '...', '||', '&&', 'async', 'await'
];
const SYMBOL_COUNT = 18; // Fewer for clarity and performance
const SYMBOL_AREA_WIDTH = 350;

export default function SignupScreen({ navigation }) {
  const separatorRef = useRef(null);
  const googleBtnRef = useRef(null);
  const [values, setValues] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [symbolAreaHeight, setSymbolAreaHeight] = useState(160); // Default, will update
  const [symbolAreaReady, setSymbolAreaReady] = useState(false); // Only scatter after real area is set
  const shiftAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(1)).current;

  // Animated values for background
  const barAnim = useRef(new Animated.Value(0)).current;
  const bracketAnim = useRef(new Animated.Value(0)).current;

  // --- Symbol physics state ---
  const [symbolPositions, setSymbolPositions] = useState(() =>
    Array.from({ length: SYMBOL_COUNT }, () => new Animated.ValueXY({
      x: Math.random() * (SYMBOL_AREA_WIDTH - 40),
      y: Math.random() * (symbolAreaHeight - 40),
    }))
  );
  const [symbolVelocities, setSymbolVelocities] = useState(() =>
    Array.from({ length: SYMBOL_COUNT }, () => ({
      x: (Math.random() - 0.5) * 1.2,
      y: (Math.random() - 0.5) * 1.2,
    }))
  );
  // Add floatPhases for floating animation
  const [floatPhases] = useState(() =>
    Array.from({ length: SYMBOL_COUNT }, () => Math.random() * Math.PI * 2)
  );
  const floatAnim = useRef(new Animated.Value(0)).current;
  // Keep refs to always have latest arrays for animation
  const symbolPositionsRef = useRef(symbolPositions);
  const symbolVelocitiesRef = useRef(symbolVelocities);
  useEffect(() => { symbolPositionsRef.current = symbolPositions; }, [symbolPositions]);
  useEffect(() => { symbolVelocitiesRef.current = symbolVelocities; }, [symbolVelocities]);

  useEffect(() => {
    const onKeyboardShow = (e) => {
      const height = e.endCoordinates ? e.endCoordinates.height : 0;
      setKeyboardHeight(height);
      Animated.parallel([
        Animated.spring(shiftAnim, {
          toValue: -height / 2.8,
          speed: 18,
          bounciness: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 0.7,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();
    };
    const onKeyboardHide = () => {
      setKeyboardHeight(0);
      Animated.parallel([
        Animated.timing(shiftAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();
    };
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      onKeyboardShow
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      onKeyboardHide
    );
    // Animate background elements
    Animated.loop(
      Animated.timing(barAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.timing(bracketAnim, {
        toValue: 1,
        duration: 12000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    ).start();
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [shiftAnim, logoAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [floatAnim]);

  useEffect(() => {
    let lastTime = Date.now();
    let rafId;
    function animateSymbols() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 1/30); // Clamp to avoid big jumps
      lastTime = now;
      const positions = symbolPositionsRef.current;
      const velocities = symbolVelocitiesRef.current;
      for (let i = 0; i < SYMBOL_COUNT; i++) {
        let pos = positions[i];
        let vel = velocities[i];
        let { x, y } = pos.__getValue();
        if (x < 0) { vel.x = Math.abs(vel.x); }
        if (x > SYMBOL_AREA_WIDTH - 40) { vel.x = -Math.abs(vel.x); }
        if (y < 0) { vel.y = Math.abs(vel.y); }
        if (y > symbolAreaHeight - 40) { vel.y = -Math.abs(vel.y); }
        for (let j = 0; j < SYMBOL_COUNT; j++) {
          if (i !== j) {
            let other = positions[j].__getValue();
            let dx = x - other.x;
            let dy = y - other.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 36) {
              let angle = Math.atan2(dy, dx);
              vel.x += Math.cos(angle) * 0.2 * dt * 60;
              vel.y += Math.sin(angle) * 0.2 * dt * 60;
            }
          }
        }
        vel.x *= 0.995;
        vel.y *= 0.995;
        vel.x = Math.max(-0.7, Math.min(0.7, vel.x));
        vel.y = Math.max(-0.7, Math.min(0.7, vel.y));
        pos.setValue({ x: x + vel.x, y: y + vel.y });
      }
      rafId = requestAnimationFrame(animateSymbols);
    }
    rafId = requestAnimationFrame(animateSymbols);
    return () => cancelAnimationFrame(rafId);
  }, [symbolAreaHeight]);

  useEffect(() => {
    // Only re-scatter when area is ready and height is meaningful
    if (symbolAreaReady && symbolAreaHeight > 50) {
      const newPositions = [];
      const newVelocities = [];
      for (let i = 0; i < SYMBOL_COUNT; i++) {
        // Limit y to symbolAreaHeight
        const x = Math.random() * (SYMBOL_AREA_WIDTH - 60) + 10 + Math.random() * 10;
        const y = Math.random() * (symbolAreaHeight - 60) + 10 + Math.random() * 10;
        newPositions.push(new Animated.ValueXY({ x, y }));
        newVelocities.push({
          x: (Math.random() - 0.5) * 1.2,
          y: (Math.random() - 0.5) * 1.2,
        });
      }
      setSymbolPositions(newPositions);
      setSymbolVelocities(newVelocities);
    }
  }, [symbolAreaHeight, symbolAreaReady]);

  const handleChange = (field, value) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleSignup = async () => {
    try {
      await signupSchema.validate(values, { abortEarly: false });
      setLoading(true);
      try {
        const userData = {
          username: values.username,
          password: values.password,
          email: `${values.username}@example.com`,
        };
        const result = await register(userData);
        Alert.alert('Signup Success', 'Account created!');
        navigation.navigate('LoginScreen');
      } catch (apiError) {
        Alert.alert('Signup Failed', apiError.message || 'Unable to create account');
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.name === 'ValidationError') {
        const fieldErrors = {};
        err.inner.forEach(e => { fieldErrors[e.path] = e.message; });
        setErrors(fieldErrors);
      } else {
        Alert.alert('Error', err.message || 'Something went wrong');
      }
    }
  };

  // Set symbol area to just below the Google button
  useEffect(() => {
    // No-op: area is set by onLayout below
  }, []);

  // Set symbol area to full screen height
  useEffect(() => {
    const { height } = Dimensions.get('window');
    setSymbolAreaHeight(height);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#111618' }}>
      {/* Subtle, animated code-inspired background */}
      <View style={styles.bgContainer} pointerEvents="none">
        {/* Animated gradient diagonal bars */}
        <Animated.View style={[
          styles.gradientBar,
          {
            top: 0,
            left: -80,
            backgroundColor: '#0cb9f2',
            opacity: 0.07,
            transform: [
              { rotate: '-18deg' },
              { translateY: Animated.multiply(barAnim, 18) },
            ],
          },
        ]} />
        <Animated.View style={[
          styles.gradientBar,
          {
            top: 180,
            right: -100,
            backgroundColor: '#7e8a9a',
            opacity: 0.06,
            transform: [
              { rotate: '-18deg' },
              { translateY: Animated.multiply(barAnim, -16) },
            ],
          },
        ]} />
        {/* Physics-animated coding symbols, use limited area */}
        {symbolPositions.map((pos, i) => {
          const floatY = floatAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.sin(floatPhases[i] + Math.PI * 2) * 12],
          });
          const floatX = floatAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.cos(floatPhases[i] + Math.PI * 2) * 8],
          });
          return (
            <Animated.Text
              key={`${i}-${symbolAreaHeight}`}
              style={[
                styles.codeElement,
                {
                  color: i % 3 === 0 ? '#0cb9f2' : i % 3 === 1 ? '#7e8a9a' : '#fff',
                  fontSize: 22 + (i % 4) * 4,
                  opacity: 0.10 + (i % 4) * 0.04,
                  position: 'absolute',
                  transform: [
                    { translateX: Animated.add(pos.x, floatX) },
                    { translateY: Animated.add(pos.y, floatY) },
                  ],
                },
              ]}
            >{SYMBOLS[i % SYMBOLS.length]}</Animated.Text>
          );
        })}
        {/* Dots grid for techy feel, more subtle and animated */}
        {[...Array(36)].map((_, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: 18 + (i % 6) * 38,
              top: 120 + Math.floor(i / 6) * 32,
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: i % 2 === 0 ? '#0cb9f2' : '#7e8a9a',
              opacity: 0.06 + (i % 3) * 0.03,
              transform: [
                { translateY: Animated.multiply(barAnim, (i % 2 === 0 ? 2 : -2)) },
              ],
            }}
          />
        ))}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 90 : 70, transform: [{ translateY: shiftAnim }] }}>
          {/* Logo, title, and subtitle all shift and animate together */}
          <Animated.View style={{ alignItems: 'center', marginTop: 24, marginBottom: 0, opacity: logoAnim, transform: [{ scale: logoAnim }] }}>
            <Image
              source={require("../../assets/icon.png")}
              style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: '#232D3F', borderWidth: 2, borderColor: '#0cb9f2', marginBottom: 10, shadowColor: '#0cb9f2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 8 }}
              resizeMode="contain"
            />
          </Animated.View>
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <Text style={{ fontSize: 27, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4, letterSpacing: -0.5 }}>Create Account</Text>
            <Text style={{ fontSize: 16, color: '#9cb2ba', textAlign: 'center', marginBottom: 28 }}>Join OutGrow and unlock your potential</Text>
          </View>
          {/* Form area */}
          <View style={{ width: '100%' }}>
            {/* Google Sign Up Button */}
            <TouchableOpacity 
              ref={googleBtnRef}
              onLayout={e => {
                // Set symbol area to just below the Google button, with extra space
                const layout = e.nativeEvent.layout;
                setSymbolAreaHeight(layout.y + layout.height + 410); // 80px below for more area
                setSymbolAreaReady(true); // Mark area as ready for scatter
              }}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 24, height: 52, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: '#e0e0e0', marginHorizontal: 18, elevation: 2 }}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: 'https://img.icons8.com/plasticine/100/google-logo.png' }}
                style={{ width: 28, height: 28, marginRight: 12 }}
                resizeMode="contain"
              />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#232D3F' }}>Sign up with Google</Text>
            </TouchableOpacity>
            {/* Divider */}
            <View
              ref={separatorRef}
              onLayout={null} // No longer needed
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginHorizontal: 18 }}
            >
              <View style={{ flex: 1, height: 1, backgroundColor: '#232D3F', opacity: 0.6 }} />
              <Text style={{ marginHorizontal: 12, color: '#7e8a9a', fontSize: 14, fontWeight: '500' }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#232D3F', opacity: 0.6 }} />
            </View>
            {/* Username Field */}
            <View style={{ marginBottom: 16, marginHorizontal: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#232D3F', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2c3335' }}>
                <Ionicons name="person-outline" size={20} color="#7e8a9a" style={{ marginRight: 8 }} />
                <TextInput
                  style={{ flex: 1, height: 48, color: '#fff', fontSize: 16 }}
                  placeholderTextColor="#7e8a9a"
                  placeholder="Username"
                  value={values.username}
                  onChangeText={v => handleChange('username', v)}
                  autoCapitalize="none"
                  returnKeyType="next"
                  selectionColor="#0cb9f2"
                />
              </View>
              {errors.username ? (
                <Text style={{ color: '#ff5a5f', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.username}</Text>
              ) : null}
            </View>
            {/* Password Field */}
            <View style={{ marginBottom: 16, marginHorizontal: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#232D3F', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2c3335' }}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#7e8a9a" style={{ marginRight: 8 }} />
                <TextInput
                  style={{ flex: 1, height: 48, color: '#fff', fontSize: 16 }}
                  placeholderTextColor="#7e8a9a"
                  placeholder="Password"
                  value={values.password}
                  onChangeText={v => handleChange('password', v)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="next"
                  selectionColor="#0cb9f2"
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#7e8a9a" />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={{ color: '#ff5a5f', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.password}</Text>
              ) : null}
            </View>
            {/* Confirm Password Field */}
            <View style={{ marginBottom: 10, marginHorizontal: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#232D3F', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2c3335' }}>
                <MaterialCommunityIcons name="lock-check-outline" size={20} color="#7e8a9a" style={{ marginRight: 8 }} />
                <TextInput
                  style={{ flex: 1, height: 48, color: '#fff', fontSize: 16 }}
                  placeholderTextColor="#7e8a9a"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={v => handleChange('confirmPassword', v)}
                  secureTextEntry={!showConfirm} // <-- ensure this is controlled by showConfirm
                  autoCapitalize="none"
                  returnKeyType="done"
                  selectionColor="#0cb9f2"
                />
                <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
                  <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color="#7e8a9a" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword ? (
                <Text style={{ color: '#ff5a5f', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.confirmPassword}</Text>
              ) : null}
            </View>
          </View>
        </Animated.View>
        {/* Sign Up Button pinned to bottom */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingBottom: Platform.OS === 'ios' ? 32 : 18, backgroundColor: '#111618' }}>
          <TouchableOpacity
            style={{ height: 52, backgroundColor: '#0cb9f2', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.2 }}>Sign Up</Text>
            )}
          </TouchableOpacity>
          <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
            <Text style={{ color: '#9cb2ba', fontSize: 14, fontWeight: '500' }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}> 
              <Text style={{ color: '#0cb9f2', fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' }}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  gradientBar: {
    position: 'absolute',
    width: 340,
    height: 60,
    borderRadius: 30,
  },
  codeElement: {
    position: 'absolute',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  circle: {
    position: 'absolute',
  },
});
