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
import { Ionicons } from '@expo/vector-icons';
import { useQuiz } from "../context/QuizContext";
import { logout } from "../auth/authService";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNextNotificationsInfo } from '../utils/notificationUtils';
import { useAuth } from '../auth/AuthContext';
import { getUserProfile } from '../auth/authService';
import LeaderboardService from '../services/LeaderboardService';
import ProjectLibraryService from '../services/ProjectLibraryService';
import { getSavedTips, getSavedQuizzes } from '../services/SavedContentService';

export default function ProfileScreen({ navigation }) {
  const { quizHistory, notificationsEnabled, toggleNotifications, sendTestNotification } = useQuiz();
  const { user, loading: userLoading, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [nextNotificationInfo, setNextNotificationInfo] = useState('Loading...');
  const [leaderboard, setLeaderboard] = useState([]);
  const [projects, setProjects] = useState([]);
  const [savedQuizzes, setSavedQuizzesState] = useState({});
  const [savedTips, setSavedTipsState] = useState({});

  useEffect(() => {
    loadNotificationInfo();
    if (user && user.uid) {
      LeaderboardService.getLeaderboard().then(setLeaderboard);
      ProjectLibraryService.getUserProjects(user.uid).then(setProjects);
      getSavedQuizzes(user.uid).then(setSavedQuizzesState);
      getSavedTips(user.uid).then(setSavedTipsState);
      getUserProfile(user.uid).then((profileData) => {
        console.log('Fetched profile data:', profileData);
        setProfile(profileData);
        if (profileData && !user.displayName) {
          // Update context if we got better data
          refreshUser();
        }
      });
    }
  }, [notificationsEnabled, user]);

  const loadNotificationInfo = async () => {
    try {
      if (notificationsEnabled) {
        const info = await getNextNotificationsInfo();
        setNextNotificationInfo(info);
      } else {
        setNextNotificationInfo('Disabled - no quiz reminders');
      }
    } catch (error) {
      console.error('Error loading notification info:', error);
      setNextNotificationInfo('Error loading schedule');
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

  // Real analytics and progress
  const totalQuizzes = Object.keys(savedQuizzes).length;
  const totalTips = Object.keys(savedTips).length;
  const totalProjects = projects.length;
  const leaderboardRank = leaderboard.findIndex(l => l.userId === (user && user.uid)) + 1;
  const userXP = leaderboard.find(l => l.userId === (user && user.uid))?.xp || 0;
  // Example: streak and accuracy from quizHistory if available
  const totalQuestions = quizHistory.reduce((sum, quiz) => sum + (quiz.totalQuestions || 0), 0);
  const correctAnswers = quizHistory.reduce((sum, quiz) => sum + (quiz.correctAnswers || 0), 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const streak = calculateStreak(quizHistory);
  const achievements = [
    { emoji: "🔥", title: "Streak Master", unlocked: streak >= 3 },
    { emoji: "🎯", title: "Accuracy King", unlocked: accuracy >= 80 },
    { emoji: "🧠", title: "Knowledge Seeker", unlocked: totalQuizzes >= 5 },
    { emoji: "💎", title: "XP Pro", unlocked: userXP >= 1000 },
  ];

  const realName = profile?.displayName || profile?.name || profile?.username || 'User';
  const realEmail = profile?.email || 'No email';
  const joinDate = profile?.joinDate ? new Date(profile.joinDate).toLocaleDateString() : (profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown');

  console.log('ProfileScreen user data:', profile);
  console.log('ProfileScreen display values:', { realName, realEmail, joinDate });

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
                source={{ uri: profile?.avatar || profile?.photoURL || undefined }}
                className="w-24 h-24 rounded-full border-4 border-[#0cb9f2]"
                style={{ backgroundColor: "#232D3F" }}
              />
              <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#34c759] rounded-full border-2 border-[#232D3F]" />
            </View>
            <Text className="text-white text-2xl font-bold mt-3 tracking-wide">
              {realName}
            </Text>
            <Text className="text-[#a2afb3] text-base">{realEmail}</Text>
            <Text className="text-[#0cb9f2] text-sm mt-1 font-medium">
              Member since {joinDate}
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
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
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
              {achievements.map((a, idx) => renderAchievementBadge(a.emoji, a.title, a.unlocked, idx))}
            </View>
          </View>
        </View>

        {/* Quick Access Section */}
        <View className="px-6 py-2">
          <Text className="text-white text-xl font-bold mb-4">Your Library</Text>
          <View className="flex-row flex-wrap gap-4">
            <TouchableOpacity
              className="flex-1 min-w-[110px] bg-[#181F2A] rounded-2xl p-4 items-center border border-[#232D3F]"
              style={{ maxWidth: '48%' }}
              onPress={() => navigation.navigate('SavedScreen')}
            >
              <View className="relative items-center">
                <Ionicons name="bookmark" size={28} color="#0cb9f2" />
                {totalQuizzes + totalTips > 0 && (
                  <View className="absolute -top-2 -right-3 bg-[#34c759] rounded-full px-2 py-0.5">
                    <Text className="text-white text-xs font-bold">{totalQuizzes + totalTips}</Text>
                  </View>
                )}
              </View>
              <Text className="text-white text-base font-semibold mt-2">Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 min-w-[110px] bg-[#181F2A] rounded-2xl p-4 items-center border border-[#232D3F]"
              style={{ maxWidth: '48%' }}
              onPress={() => navigation.navigate('LeaderboardScreen')}
            >
              <View className="relative items-center">
                <Ionicons name="trophy" size={28} color="#ffd700" />
                {leaderboardRank > 0 && (
                  <View className="absolute -top-2 -right-3 bg-[#0cb9f2] rounded-full px-2 py-0.5">
                    <Text className="text-white text-xs font-bold">#{leaderboardRank}</Text>
                  </View>
                )}
              </View>
              <Text className="text-white text-base font-semibold mt-2">Leaderboard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 min-w-[110px] bg-[#181F2A] rounded-2xl p-4 items-center border border-[#232D3F]"
              style={{ maxWidth: '48%' }}
              onPress={() => navigation.navigate('ProjectLibraryScreen')}
            >
              <View className="relative items-center">
                <Ionicons name="folder" size={28} color="#7e8a9a" />
                {totalProjects > 0 && (
                  <View className="absolute -top-2 -right-3 bg-[#ff9500] rounded-full px-2 py-0.5">
                    <Text className="text-white text-xs font-bold">{totalProjects}</Text>
                  </View>
                )}
              </View>
              <Text className="text-white text-base font-semibold mt-2">Projects</Text>
            </TouchableOpacity>
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

            {/* Notifications Setting */}
            <View className="flex-row justify-between items-center p-5 border-b border-[#232D3F]">
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-white text-base font-semibold">Quiz Notifications</Text>
                  <View className={`ml-2 w-2 h-2 rounded-full ${notificationsEnabled ? 'bg-[#34c759]' : 'bg-[#3b4e54]'}`} />
                </View>
                <Text className="text-[#a2afb3] text-sm">
                  {notificationsEnabled ? nextNotificationInfo : 'Disabled - no quiz reminders'}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: "#3b4e54", true: "#0cb9f2" }}
                thumbColor="#fff"
              />
            </View>

            {/* Notification Settings */}
            <TouchableOpacity 
              className="flex-row justify-between items-center p-5 border-b border-[#232D3F] active:bg-[#232D3F]"
              onPress={() => navigation.navigate('NotificationSettingsScreen')}
            >
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-white text-base font-semibold">Notification Schedule</Text>
                  <View className="ml-2 w-2 h-2 bg-[#0cb9f2] rounded-full" />
                </View>
                <Text className="text-[#a2afb3] text-sm">
                  Customize your notification times and preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#a2afb3" />
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
function renderAchievementBadge(emoji, title, unlocked, key) {
  return (
    <View
      key={key}
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

  // Track unique days with at least one quiz completed
  const days = new Set();
  sortedHistory.forEach(q => {
    // Use only the date part (YYYY-MM-DD)
    const d = new Date(q.date);
    const dayStr = d.toISOString().slice(0, 10);
    days.add(dayStr);
  });

  // Streak is the number of consecutive days (from today backwards) with at least one quiz
  let streak = 0;
  let currentDate = new Date();
  for (;;) {
    const dayStr = currentDate.toISOString().slice(0, 10);
    if (days.has(dayStr)) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
