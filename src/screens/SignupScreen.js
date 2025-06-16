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
  SafeAreaView,
  Dimensions 
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
        // Prepare user data
        const userData = {
          username: values.username,
          password: values.password,
          email: `${values.username}@example.com`, // Dummy email for demo
        };
        
        // Register user
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
    <SafeAreaView className="flex-1 bg-[#111618]">
      <StatusBar barStyle="light-content" backgroundColor="#111618" />
      <View className="h-16"></View>
      
      {/* Top image - large illustration */}
      <Image
        source={require("../../assets/icon.png")}
        className="w-64 h-64 mx-auto rounded-full"
        resizeMode="contain"
      />
      
      {/* Sign up heading - matching login design */}
      <Text className="mx-[21px] mt-5 text-3xl text-center font-bold text-white leading-[48px] tracking-wide">
        Create Your Account
      </Text>
      
      <TouchableOpacity
        className="mx-[21px] mt-[20px] h-16 bg-[#181F2A] rounded-xl border border-[#3b4e54] flex-row items-center justify-center"
        activeOpacity={0.8}
      >
        {/* Google icon */}
        <View className="w-8 h-8 mr-[10px]">
          <Image
            source={{ uri: "https://img.icons8.com/plasticine/100/google-logo.png" }}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </View>
        <Text className="text-2xl font-medium text-white">
          Sign up with Google
        </Text>
      </TouchableOpacity>
      
      {/* Divider with text */}
      <View className="flex-row items-center mx-[21px] mt-[20px]">
        <View className="flex-1 h-[1px] bg-[#3b4e54] opacity-70" />
        <Text className="mx-2.5 bg-[#111618] text-[#a2afb3] text-base">
          or sign up with email
        </Text>
        <View className="flex-1 h-[1px] bg-[#3b4e54] opacity-70" />
      </View>
      
      {/* Form fields - positioned exactly as in login design */}
      <View className="mx-[21px] mt-[10px]">
        {/* Username field label */}
        <Text className="text-xl font-normal text-white mb-[10px]">
          Username
        </Text>
        
        {/* Username input */}
        <TextInput
          className="w-[100%] h-16 bg-[#232D3F] rounded-md mb-[10px] px-4 text-white border border-[#3b4e54]"
          placeholderTextColor="#a2afb3"
          placeholder="Enter your username"
          value={values.username}
          onChangeText={v => handleChange('username', v)}
          autoCapitalize="none"
        />
        {errors.username && (
          <Text className="text-[#ff3b30] mb-1 text-xs">{errors.username}</Text>
        )}
        
        {/* Password field */}
        <Text className="text-xl font-normal text-white mb-[10px]">
          Password
        </Text>
        
        {/* Password input */}
        <TextInput
          className="w-[100%] h-16 bg-[#232D3F] rounded-md mb-[10px] px-4 text-white border border-[#3b4e54]"
          placeholderTextColor="#a2afb3"
          placeholder="Enter your password"
          value={values.password}
          onChangeText={v => handleChange('password', v)}
          secureTextEntry
        />
        {errors.password && (
          <Text className="text-[#ff3b30] mb-1 text-xs">{errors.password}</Text>
        )}
        
        {/* Confirm Password field */}
        <Text className="text-xl font-normal text-white mb-[10px]">
          Confirm Password
        </Text>
        
        {/* Confirm Password input */}
        <TextInput
          className="w-[100%] h-16 bg-[#232D3F] rounded-md mb-[10px] px-4 text-white border border-[#3b4e54]"
          placeholderTextColor="#a2afb3"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChangeText={v => handleChange('confirmPassword', v)}
          secureTextEntry
        />
        {errors.confirmPassword && (
          <Text className="text-[#ff3b30] mb-1 text-xs">{errors.confirmPassword}</Text>
        )}
      </View>
      
      {/* Sign Up Button - positioned toward bottom as in login design */}
      <View className="mx-auto w-full absolute bottom-[140px]">
        <TouchableOpacity
          className="mx-[21px] h-20 bg-[#0cb9f2] rounded-xl shadow-lg items-center justify-center"
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.8}
          style={{ shadowColor: '#0cb9f2', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}
        >
          {loading ? (
            <ActivityIndicator color="#111618" />
          ) : (
            <Text className="text-[#111618] text-2xl font-bold">Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Sign In text - positioned at bottom as in login design */}
      <View className="mx-auto w-full absolute bottom-[75px]">
        <View className="flex-row justify-center">
          <Text className="text-[#a2afb3] text-xl font-normal">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text className="text-[#0cb9f2] text-xl font-bold">Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
