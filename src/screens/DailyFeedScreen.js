// DailyFeedScreen.js
// Screen for daily personalized content (quizzes, tips, reminders)
import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDailyFeed from '../hooks/useDailyFeed';
import FeedCard from '../components/FeedCard';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../auth/AuthContext';

function DailyFeedScreen() {
  const { feed, loading, error, completeItem, dateStr } = useDailyFeed();
  const { user } = useAuth();
  const navigation = useNavigation();

  // Calculate progress
  const completedCount = feed ? feed.filter(item => item.completed).length : 0;
  const totalTasks = feed ? feed.length : 0;
  const totalXP = feed ? feed.reduce((sum, item) => sum + (item.completed ? item.xp : 0), 0) : 0;

  return (
    <SafeAreaView className="flex-1 bg-[#10141a]">
      <ScrollView className="flex-1 px-2 pt-6 pb-8" contentContainerStyle={{ paddingBottom: 32 }}>
      <View className="w-full items-center mb-6">
        <View className="w-full max-w-xl bg-[#181F2A] rounded-3xl shadow-lg px-6 py-6 mb-4 border border-[#232D3F]">
          <Text className="text-white text-3xl font-extrabold mb-1 tracking-wide text-center drop-shadow">Daily Feed</Text>
          <Text className="text-[#0cb9f2] text-base font-semibold mb-3 text-center">{dateStr}</Text>
          <View className="flex-row justify-center gap-6 mb-4">
            <View className="items-center bg-[#232D3F] rounded-2xl py-3 px-7 mx-2 min-w-[90px] shadow">
              <Text className="text-[#0cb9f2] text-2xl font-extrabold drop-shadow">{completedCount}/{totalTasks}</Text>
              <Text className="text-[#a2afb3] text-xs font-medium mt-1">Completed</Text>
            </View>
            <View className="items-center bg-[#232D3F] rounded-2xl py-3 px-7 mx-2 min-w-[90px] shadow">
              <Text className="text-[#34c759] text-2xl font-extrabold drop-shadow">{totalXP} XP</Text>
              <Text className="text-[#a2afb3] text-xs font-medium mt-1">Earned</Text>
            </View>
          </View>
          {/* Refresh Feed button removed */}
        </View>
        <View className="w-full max-w-xl h-1 bg-[#232D3F] rounded-full mb-2 opacity-70" />
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center mt-10"><ActivityIndicator size="large" color="#0cb9f2" /></View>
      ) : error ? (
        <View className="flex-1 items-center justify-center mt-10"><Text className="text-red-500">Error loading feed.</Text></View>
      ) : (
        feed && feed.map((item, idx) => (
          <FeedCard key={idx} item={item} onComplete={() => completeItem(idx)} navigation={navigation} />
        ))
      )}
      </ScrollView>
    </SafeAreaView>
  );
}
export default DailyFeedScreen;

