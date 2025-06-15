import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuiz } from '../context/QuizContext';
import { logout } from '../auth/authService';

export default function ProfileScreen({ navigation }) {
  const { quizHistory } = useQuiz();
  const [user, setUser] = useState({
    username: 'OutGrow User',
    email: 'user@example.com',
    joinDate: 'June 2025',
    avatar: 'https://ui-avatars.com/api/?name=OutGrow+User&background=0D8ABC&color=fff'
  });
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user_data');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(prevUser => ({
          ...prevUser,
          ...parsedUser
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            Alert.alert('Logged out', 'You have been logged out successfully');
            navigation.replace('LoginScreen');
          }
        }
      ]
    );
  };

  // Calculate quiz statistics
  const totalQuizzes = quizHistory.length;
  const totalQuestions = quizHistory.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
  const correctAnswers = quizHistory.reduce((sum, quiz) => sum + quiz.correctAnswers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Get streak (consecutive days with quizzes)
  const streak = calculateStreak(quizHistory);

  return (
    <ScrollView className="flex-1 bg-[#111618]">
      {/* Header Section */}
      <View className="py-6 px-4 bg-[#181F2A] rounded-b-3xl">
        <View className="flex-row items-center mb-6">
          <Image 
            source={{ uri: user.avatar }} 
            className="w-20 h-20 rounded-full mr-4"
            style={{ backgroundColor: '#232D3F' }}
          />
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold">{user.username}</Text>
            <Text className="text-[#a2afb3] text-sm">{user.email}</Text>
            <Text className="text-[#0cb9f2] text-xs mt-1">Joined {user.joinDate}</Text>
          </View>
        </View>
        
        {/* Stats Highlights */}
        <View className="flex-row justify-between bg-[#232D3F] rounded-xl p-4">
          <View className="items-center">
            <Text className="text-[#0cb9f2] text-2xl font-bold">{totalQuizzes}</Text>
            <Text className="text-[#a2afb3] text-xs">Quizzes</Text>
          </View>
          <View className="items-center">
            <Text className="text-[#0cb9f2] text-2xl font-bold">{accuracy}%</Text>
            <Text className="text-[#a2afb3] text-xs">Accuracy</Text>
          </View>
          <View className="items-center">
            <Text className="text-[#0cb9f2] text-2xl font-bold">{streak}</Text>
            <Text className="text-[#a2afb3] text-xs">Day Streak</Text>
          </View>
        </View>
      </View>
      
      {/* Achievements Section */}
      <View className="px-4 py-6">
        <Text className="text-white text-xl font-bold mb-3">Achievements</Text>
        <View className="flex-row flex-wrap">
          {renderAchievementBadge('🔥', 'Streak Master', streak >= 3)}
          {renderAchievementBadge('🎯', 'Accuracy King', accuracy >= 80)}
          {renderAchievementBadge('🧠', 'Knowledge Seeker', totalQuizzes >= 5)}
          {renderAchievementBadge('⚡', 'Quick Thinker', false)}
        </View>
      </View>
      
      {/* Settings Section */}
      <View className="px-4 py-6">
        <Text className="text-white text-xl font-bold mb-3">Settings</Text>
        <View className="bg-[#181F2A] rounded-xl overflow-hidden">
          {/* Dark Mode Setting */}
          <View className="flex-row justify-between items-center p-4 border-b border-[#232D3F]">
            <View>
              <Text className="text-white text-base">Dark Mode</Text>
              <Text className="text-[#a2afb3] text-xs">Toggle dark/light appearance</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#3b4e54', true: '#0cb9f2' }}
              thumbColor="#fff"
            />
          </View>
          
          {/* Notifications Setting */}
          <View className="flex-row justify-between items-center p-4 border-b border-[#232D3F]">
            <View>
              <Text className="text-white text-base">Quiz Notifications</Text>
              <Text className="text-[#a2afb3] text-xs">Receive quiz reminders</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#3b4e54', true: '#0cb9f2' }}
              thumbColor="#fff"
            />
          </View>
          
          {/* Other Settings */}
          <TouchableOpacity className="p-4 border-b border-[#232D3F] active:opacity-80">
            <Text className="text-white text-base">Privacy Policy</Text>
            <Text className="text-[#a2afb3] text-xs">Read our privacy policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="p-4 active:opacity-80">
            <Text className="text-white text-base">About OutGrow</Text>
            <Text className="text-[#a2afb3] text-xs">App version 1.0.0</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Logout Button */}
      <View className="px-4 py-6">
        <TouchableOpacity
          className="bg-[#283539] rounded-xl py-4 items-center"
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text className="text-[#ff3b30] text-base font-medium">Logout</Text>
        </TouchableOpacity>
        
        {/* App Info */}
        <Text className="text-[#a2afb3] text-xs text-center mt-8">
          OutGrow • Learn, Grow, Excel
        </Text>
      </View>
    </ScrollView>
  );
}

// Helper function to render achievement badges
function renderAchievementBadge(emoji, title, unlocked) {
  return (
    <View 
      className={`rounded-xl p-3 mr-2 mb-2 items-center ${unlocked ? 'bg-[#1e493e]' : 'bg-[#232D3F]'}`}
      style={{ width: 80 }}
    >
      <Text className="text-2xl mb-1">{emoji}</Text>
      <Text className="text-white text-xs text-center font-medium">{title}</Text>
      {!unlocked && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 rounded-xl items-center justify-center">
          <Text className="text-white text-lg">🔒</Text>
        </View>
      )}
    </View>
  );
}

// Helper function to calculate streak
function calculateStreak(quizHistory) {
  if (!quizHistory || quizHistory.length === 0) return 0;
  
  // Sort by date, newest first
  const sortedHistory = [...quizHistory].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  // Simple streak implementation (could be enhanced)
  return Math.min(sortedHistory.length, 7); // Cap at 7 for now
}
