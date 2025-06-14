import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginSchema } from '../utils/validation';

const SOCIALS = [
  { name: 'Google', icon: { uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' } },
  { name: 'Apple', icon: { uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' } },
  { name: 'GitHub', icon: { uri: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' } },
];

export default function LoginScreen({ navigation }) {
  const [values, setValues] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleLogin = async () => {
    try {
      await loginSchema.validate(values, { abortEarly: false });
      setLoading(true);
      console.log('Login values:', values); // Debug log
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
    //   console.log('API response:', data); // Debug log
      setLoading(false);
      if (data.accessToken) {
        await AsyncStorage.setItem('token', data.accessToken);
        Alert.alert('Login Success', 'Welcome back!');
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
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
    <View className="flex-1 bg-[#111618] justify-center px-6">
      <View className="items-center mb-10 mt-8">
        <Image source={require('../assets/icon.png')} className="w-16 h-16 mb-4" style={{ borderRadius: 20 }} />
        <Text className="text-white text-4xl font-extrabold tracking-tight mb-2">Welcome</Text>
        <Text className="text-[#a2afb3] text-base">Sign in to continue your journey</Text>
      </View>
      <View className="mb-4">
        <TextInput
          className="bg-[#181F2A] text-white rounded-2xl px-5 py-4 mb-2 text-base shadow-sm"
          placeholder="Username"
          placeholderTextColor="#a2afb3"
          value={values.username}
          onChangeText={v => handleChange('username', v)}
          autoCapitalize="none"
        />
        {errors.username && <Text className="text-red-400 mb-2 text-xs">{errors.username}</Text>}
        <TextInput
          className="bg-[#181F2A] text-white rounded-2xl px-5 py-4 mb-2 text-base shadow-sm"
          placeholder="Password"
          placeholderTextColor="#a2afb3"
          value={values.password}
          onChangeText={v => handleChange('password', v)}
          secureTextEntry
        />
        {errors.password && <Text className="text-red-400 mb-2 text-xs">{errors.password}</Text>}
      </View>
      {/* Show validation errors above the button */}
      {(errors.username || errors.password) && (
        <View className="mb-2">
          {errors.username && <Text className="text-red-400 text-xs mb-1">{errors.username}</Text>}
          {errors.password && <Text className="text-red-400 text-xs mb-1">{errors.password}</Text>}
        </View>
      )}
      <TouchableOpacity
        className="bg-[#0cb9f2] rounded-2xl py-4 items-center mb-6 shadow-lg"
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
        style={{ shadowColor: '#0cb9f2', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
      >
        {loading ? <ActivityIndicator color="#111618" /> : <Text className="text-[#111618] text-lg font-bold">Sign In</Text>}
      </TouchableOpacity>
      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-[#232D3F]" />
        <Text className="text-[#a2afb3] mx-3">or sign in with</Text>
        <View className="flex-1 h-px bg-[#232D3F]" />
      </View>
      <View className="flex-row justify-center mb-8">
        {SOCIALS.map(s => (
          <TouchableOpacity key={s.name} className="mx-3 bg-[#181F2A] rounded-full p-4 shadow" activeOpacity={0.8}>
            <Image source={s.icon} className="w-7 h-7" />
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex-row justify-center">
        <Text className="text-[#a2afb3]">Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text className="text-[#0cb9f2] font-bold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
