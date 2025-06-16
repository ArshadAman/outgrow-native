import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuiz } from "../context/QuizContext";
import { logout } from "../auth/authService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen({ navigation }) {
  const { 
    quizHistory, 
    notificationsEnabled, 
    toggleNotifications, 
    sendTestNotification 
  } = useQuiz();
  const [user, setUser] = useState({
    username: "OutGrow User",
    email: "user@example.com",
    joinDate: "June 2025",
    avatar:
      "https://ui-avatars.com/api/?name=OutGrow+User&background=0D8ABC&color=fff",
  });
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userToken = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user_data");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser((prevUser) => ({
          ...prevUser,
          ...parsedUser,
        }));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading user data:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout Confirmation", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          navigation.replace("LoginScreen");
        },
      },
    ]);
  };

  const handleNotificationToggle = async (enabled) => {
    try {
      const success = await toggleNotifications(enabled);
      if (success) {
        if (enabled) {
          Alert.alert(
            "Notifications Enabled! 🔔", 
            "You'll receive daily quiz reminders with random subjects. A test notification will arrive in 10 seconds!"
          );
        } else {
          Alert.alert(
            "Notifications Disabled", 
            "You won't receive quiz reminders anymore."
          );
        }
      } else {
        Alert.alert(
          "Permission Required", 
          "Please enable notifications in your device settings to receive quiz reminders."
        );
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert("Error", "Failed to update notification settings.");
    }
  };

  const handleTestNotification = async () => {
    try {
      const success = await sendTestNotification();
      if (success) {
        Alert.alert(
          "Test Notification Sent! 🔔", 
          "Check your notifications - a test quiz notification should appear immediately!"
        );
      } else {
        Alert.alert("Error", "Failed to send test notification.");
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert("Error", "Failed to send test notification.");
    }
  };

  // Calculate quiz statistics
  const totalQuizzes = quizHistory.length;
  const totalQuestions = quizHistory.reduce(
    (sum, quiz) => sum + quiz.totalQuestions,
    0
  );
  const correctAnswers = quizHistory.reduce(
    (sum, quiz) => sum + quiz.correctAnswers,
    0
  );
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  // Get streak (consecutive days with quizzes)
  const streak = calculateStreak(quizHistory);

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Section with gradient effect */}
        <View className="pt-8 pb-6 px-6 bg-[#181F2A] rounded-b-3xl shadow-lg"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8
              }}>
          <View className="items-center mb-6">
            <View className="relative">
              <Image
                source={{ uri: user.avatar }}
                className="w-24 h-24 rounded-full border-4 border-[#0cb9f2]"
                style={{ backgroundColor: "#232D3F" }}
              />
              <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#34c759] rounded-full border-2 border-[#232D3F]" />
            </View>
            <Text className="text-white text-2xl font-bold mt-3 tracking-wide">
              {user.username}
            </Text>
            <Text className="text-[#a2afb3] text-base">{user.email}</Text>
            <Text className="text-[#0cb9f2] text-sm mt-1 font-medium">
              Member since {user.joinDate}
            </Text>
          </View>

          {/* Enhanced Stats Grid */}
          <View className="bg-[#111618] rounded-2xl p-5 border border-[#232D3F]"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4
                }}>
            <Text className="text-[#0cb9f2] text-lg font-bold mb-4 text-center">Your Progress</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <View className="bg-[#232D3F] w-14 h-14 rounded-full items-center justify-center mb-2">
                  <Text className="text-[#0cb9f2] text-xl font-bold">
                    {totalQuizzes}
                  </Text>
                </View>
                <Text className="text-[#a2afb3] text-xs font-medium">Quizzes</Text>
              </View>
              <View className="items-center flex-1">
                <View className="bg-[#232D3F] w-14 h-14 rounded-full items-center justify-center mb-2">
                  <Text className="text-[#34c759] text-xl font-bold">
                    {accuracy}%
                  </Text>
                </View>
                <Text className="text-[#a2afb3] text-xs font-medium">Accuracy</Text>
              </View>
              <View className="items-center flex-1">
                <View className="bg-[#232D3F] w-14 h-14 rounded-full items-center justify-center mb-2">
                  <Text className="text-[#ff9500] text-xl font-bold">
                    {streak}
                  </Text>
                </View>
                <Text className="text-[#a2afb3] text-xs font-medium">Day Streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View className="px-6 py-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">
              Achievements
            </Text>
            <Text className="text-[#0cb9f2] text-sm font-medium">
              {[
                streak >= 3,
                accuracy >= 80,
                totalQuizzes >= 5,
                false
              ].filter(Boolean).length}/4
            </Text>
          </View>
          <View className="bg-[#181F2A] rounded-2xl p-4"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 6
                }}>
            <View className="flex-row flex-wrap gap-3">
              {renderAchievementBadge("🔥", "Streak Master", streak >= 3)}
              {renderAchievementBadge("🎯", "Accuracy King", accuracy >= 80)}
              {renderAchievementBadge(
                "🧠",
                "Knowledge Seeker",
                totalQuizzes >= 5
              )}
              {renderAchievementBadge("⚡", "Quick Thinker", false)}
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View className="px-6 py-6">
          <Text className="text-white text-xl font-bold mb-4">Settings</Text>
          <View className="bg-[#181F2A] rounded-2xl overflow-hidden border border-[#232D3F]"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 6
                }}>
            {/* Dark Mode Setting */}
            <View className="flex-row justify-between items-center p-5 border-b border-[#232D3F]">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-white text-base font-semibold">Dark Mode</Text>
                  <View className="ml-2 w-2 h-2 bg-[#0cb9f2] rounded-full" />
                </View>
                <Text className="text-[#a2afb3] text-sm">
                  Toggle dark/light appearance
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#3b4e54", true: "#0cb9f2" }}
                thumbColor="#fff"
              />
            </View>

            {/* Notifications Setting */}
            <View className="flex-row justify-between items-center p-5 border-b border-[#232D3F]">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-white text-base font-semibold">Quiz Notifications</Text>
                  <View className="ml-2 w-2 h-2 bg-[#34c759] rounded-full" />
                </View>
                <Text className="text-[#a2afb3] text-sm">
                  Receive daily quiz reminders with random subjects
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: "#3b4e54", true: "#0cb9f2" }}
                thumbColor="#fff"
              />
            </View>

            {/* Test Notifications */}
            <TouchableOpacity 
              className="p-5 border-b border-[#232D3F] active:bg-[#232D3F]"
              onPress={handleTestNotification}
            >
              <View className="flex-row items-center mb-1">
                <Text className="text-white text-base font-semibold">Test Notifications</Text>
                <View className="ml-2 w-2 h-2 bg-[#ff9500] rounded-full" />
                <Text className="text-[#a2afb3] ml-auto text-lg">🔔</Text>
              </View>
              <Text className="text-[#a2afb3] text-sm">
                Send a test quiz notification immediately
              </Text>
            </TouchableOpacity>

            {/* Other Settings */}
            <TouchableOpacity className="p-5 border-b border-[#232D3F] active:bg-[#232D3F]">
              <View className="flex-row items-center mb-1">
                <Text className="text-white text-base font-semibold">Privacy Policy</Text>
                <Text className="text-[#a2afb3] ml-auto text-lg">›</Text>
              </View>
              <Text className="text-[#a2afb3] text-sm">
                Read our privacy policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="p-5 active:bg-[#232D3F]">
              <View className="flex-row items-center mb-1">
                <Text className="text-white text-base font-semibold">About OutGrow</Text>
                <Text className="text-[#a2afb3] ml-auto text-lg">›</Text>
              </View>
              <Text className="text-[#a2afb3] text-sm">App version 1.0.0</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 py-8">
          <TouchableOpacity
            className="bg-[#ff3b30] rounded-2xl py-4 px-6 items-center shadow-lg"
            onPress={handleLogout}
            activeOpacity={0.85}
            style={{
              shadowColor: '#ff3b30',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 8
            }}
          >
            <Text className="text-white text-base font-bold uppercase tracking-wider">
              Sign Out
            </Text>
          </TouchableOpacity>

          {/* App Info */}
          <View className="items-center mt-8 pt-6 border-t border-[#232D3F]">
            <Text className="text-[#0cb9f2] text-lg font-bold mb-1">OutGrow</Text>
            <Text className="text-[#a2afb3] text-xs text-center">
              Learn • Grow • Excel
            </Text>
            <Text className="text-[#3b4e54] text-xs text-center mt-2">
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to render achievement badges
function renderAchievementBadge(emoji, title, unlocked) {
  return (
    <View
      className={`rounded-xl p-3 mr-2 mb-2 items-center ${
        unlocked ? "bg-[#1e493e]" : "bg-[#232D3F]"
      }`}
      style={{ width: 80 }}
    >
      <Text className="text-2xl mb-1">{emoji}</Text>
      <Text className="text-white text-xs text-center font-medium">
        {title}
      </Text>
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
  const sortedHistory = [...quizHistory].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Simple streak implementation (could be enhanced)
  return Math.min(sortedHistory.length, 7); // Cap at 7 for now
}
