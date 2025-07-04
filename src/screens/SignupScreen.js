import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signupSchema } from '../utils/validation';
import { register } from '../auth/authService';
import { authStyles } from '../styles/authStyles';

const SOCIALS = [
  { name: 'Google', icon: { uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' } },
  { name: 'Apple', icon: { uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' } },
  { name: 'GitHub', icon: { uri: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' } },
];

export default function SignupScreen({ navigation }) {
  const [values, setValues] = useState({ username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <ScrollView
        style={authStyles.container}
        contentContainerStyle={authStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="light-content" backgroundColor="#10131a" />
        <View style={authStyles.topSpacing} />
        {/* Logo */}
        <Image
          source={require("../../assets/icon.png")}
          style={authStyles.logo}
          resizeMode="contain"
        />
        {/* Heading */}
        <Text style={authStyles.heading}>Create Your Account</Text>
        {/* Google Sign Up Button */}
        <TouchableOpacity style={authStyles.socialButton} activeOpacity={0.85}>
          <Image
            source={{ uri: 'https://img.icons8.com/plasticine/100/google-logo.png' }}
            style={authStyles.socialIcon}
            resizeMode="contain"
          />
          <Text style={authStyles.socialButtonText}>Sign up with Google</Text>
        </TouchableOpacity>
        {/* Divider */}
        <View style={authStyles.dividerRow}>
          <View style={authStyles.dividerLine} />
          <Text style={authStyles.dividerText}>or sign up with email</Text>
          <View style={authStyles.dividerLine} />
        </View>
        {/* Form */}
        <View style={authStyles.form}>
          <Text style={authStyles.label}>Username</Text>
          <TextInput
            style={authStyles.input}
            placeholderTextColor="#7e8a9a"
            placeholder="Enter your username"
            value={values.username}
            onChangeText={v => handleChange('username', v)}
            autoCapitalize="none"
          />
          <Text style={authStyles.errorTextFixed}>{errors.username || " "}</Text>

          <Text style={authStyles.label}>Password</Text>
          <TextInput
            style={authStyles.input}
            placeholderTextColor="#7e8a9a"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={v => handleChange('password', v)}
            secureTextEntry
          />
          <Text style={authStyles.errorTextFixed}>{errors.password || " "}</Text>

          <Text style={authStyles.label}>Confirm Password</Text>
          <TextInput
            style={authStyles.input}
            placeholderTextColor="#7e8a9a"
            placeholder="Confirm your password"
            value={values.confirmPassword}
            onChangeText={v => handleChange('confirmPassword', v)}
            secureTextEntry
          />
          <Text style={authStyles.errorTextFixed}>{errors.confirmPassword || " "}</Text>
        </View>
        {/* Sign Up Button */}
        <View style={authStyles.signInButtonWrapper}>
          <TouchableOpacity
            style={authStyles.signInButton}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.signInButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* Sign In */}
        <View style={authStyles.authSwitchWrapper}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={authStyles.authSwitchText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={authStyles.authSwitchLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
