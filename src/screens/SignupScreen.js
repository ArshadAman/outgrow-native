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
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <ScrollView
        className="flex-1 bg-auth-background"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="light-content" backgroundColor="#10131a" />
        <View className="h-8" />

        {/* Logo */}
        <View className="items-center mb-2">
          <Image
            source={require("../../assets/icon.png")}
            className="w-[90px] h-[90px] rounded-3xl bg-auth-card border-2 border-auth-border"
            style={{
              shadowColor: "#0cb9f2",
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 6,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Heading */}
        <Text className="mx-6 mt-2 text-auth-xl text-center font-bold text-auth-text tracking-wide mb-2">
          Create Your Account
        </Text>

        {/* Google Sign Up Button */}
        <TouchableOpacity 
          className="flex-row items-center justify-center mx-6 mt-[18px] h-[45px] bg-auth-card rounded-[14px] border border-auth-border"
          style={{
            shadowColor: "#0cb9f2",
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 2,
          }}
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: 'https://img.icons8.com/plasticine/100/google-logo.png' }}
            className="w-8 h-8 mr-2"
            resizeMode="contain"
          />
          <Text className="text-auth-lg font-semibold text-auth-text">
            Sign up with Google
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center mx-6 mt-8">
          <View className="flex-1 h-px bg-auth-border opacity-50" />
          <Text className="mx-[10px] bg-auth-background text-auth-textMuted text-[15px] font-medium">
            or sign up with email
          </Text>
          <View className="flex-1 h-px bg-auth-border opacity-50" />
        </View>

        {/* Form */}
        <View className="mx-6 mt-8">
          <Text className="text-auth-base font-medium text-auth-text mb-[7px]">
            Username
          </Text>
          <TextInput
            className="w-full h-[45px] bg-auth-card rounded-[10px] px-4 text-auth-text border border-auth-border mb-2 text-auth-sm"
            placeholderTextColor="#7e8a9a"
            placeholder="Enter your username"
            value={values.username}
            onChangeText={v => handleChange('username', v)}
            autoCapitalize="none"
          />
          <Text className="text-auth-error min-h-[18px] mb-1 text-[13px]">
            {errors.username || " "}
          </Text>

          <Text className="text-auth-base font-medium text-auth-text mb-[7px]">
            Password
          </Text>
          <TextInput
            className="w-full h-[45px] bg-auth-card rounded-[10px] px-4 text-auth-text border border-auth-border mb-2 text-auth-sm"
            placeholderTextColor="#7e8a9a"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={v => handleChange('password', v)}
            secureTextEntry
          />
          <Text className="text-auth-error min-h-[18px] mb-1 text-[13px]">
            {errors.password || " "}
          </Text>

          <Text className="text-auth-base font-medium text-auth-text mb-[7px]">
            Confirm Password
          </Text>
          <TextInput
            className="w-full h-[45px] bg-auth-card rounded-[10px] px-4 text-auth-text border border-auth-border mb-2 text-auth-sm"
            placeholderTextColor="#7e8a9a"
            placeholder="Confirm your password"
            value={values.confirmPassword}
            onChangeText={v => handleChange('confirmPassword', v)}
            secureTextEntry
          />
          <Text className="text-auth-error min-h-[18px] mb-1 text-[13px]">
            {errors.confirmPassword || " "}
          </Text>
        </View>

        {/* Sign Up Button */}
        <View className="mx-6 mt-2">
          <TouchableOpacity
            className="h-[45px] bg-auth-primary rounded-[14px] items-center justify-center"
            style={{
              shadowColor: "#0cb9f2",
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-auth-background text-auth-md font-bold tracking-wide">
                Sign Up
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign In */}
        <View className="mt-6 mb-8 items-center">
          <View className="flex-row justify-center">
            <Text className="text-auth-textMuted text-auth-base font-medium">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text className="text-auth-primary text-auth-base font-bold ml-[2px]">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
