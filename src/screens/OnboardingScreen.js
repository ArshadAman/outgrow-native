import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function OnboardingScreen({ navigation, route }) {
  const [values, setValues] = useState({ college: '', branch: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleContinue = async () => {
    // College and branch are now optional. No validation required.
    setLoading(true);
    try {
      // Save to user profile in Firestore (implement this logic in your onboarding flow)
      // await updateUserProfile({ college: values.college, branch: values.branch });
      Alert.alert('Onboarding Complete', 'Your details have been saved.');
      navigation.replace('App', { screen: 'MainTabs', params: { screen: 'Home' } });
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save details');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#111618', justifyContent: 'center', alignItems: 'center' }}>
      <KeyboardAvoidingView
        style={{ width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 }}>Tell us about you</Text>
          <Text style={{ fontSize: 16, color: '#9cb2ba', textAlign: 'center' }}>This helps us personalize your experience</Text>
        </View>
        {/* College Field */}
        <View style={{ marginBottom: 18, marginHorizontal: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#232D3F', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2c3335' }}>
            <MaterialCommunityIcons name="school-outline" size={20} color="#7e8a9a" style={{ marginRight: 8 }} />
            <TextInput
              style={{ flex: 1, height: 48, color: '#fff', fontSize: 16 }}
              placeholderTextColor="#7e8a9a"
              placeholder="College Name"
              value={values.college}
              onChangeText={v => handleChange('college', v)}
              autoCapitalize="words"
              returnKeyType="next"
              selectionColor="#0cb9f2"
            />
          </View>
          {errors.college ? (
            <Text style={{ color: '#ff5a5f', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.college}</Text>
          ) : null}
        </View>
        {/* Branch Field */}
        <View style={{ marginBottom: 18, marginHorizontal: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#232D3F', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2c3335' }}>
            <MaterialCommunityIcons name="book-outline" size={20} color="#7e8a9a" style={{ marginRight: 8 }} />
            <TextInput
              style={{ flex: 1, height: 48, color: '#fff', fontSize: 16 }}
              placeholderTextColor="#7e8a9a"
              placeholder="Branch (e.g. MCA, CSE)"
              value={values.branch}
              onChangeText={v => handleChange('branch', v)}
              autoCapitalize="characters"
              returnKeyType="done"
              selectionColor="#0cb9f2"
            />
          </View>
          {errors.branch ? (
            <Text style={{ color: '#ff5a5f', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.branch}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={{ height: 52, backgroundColor: '#0cb9f2', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 18, marginTop: 10 }}
          onPress={handleContinue}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.2 }}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}
