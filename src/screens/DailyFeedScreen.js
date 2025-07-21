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
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();
  // Helper to force refresh: clear Firestore doc and reload
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { getFirestore, doc, deleteDoc } = require('firebase/firestore');
      const db = getFirestore();
      if (user?.uid && dateStr) {
        const feedRef = doc(db, `users/${user.uid}/dailyFeed/${dateStr}`);
        await deleteDoc(feedRef);
      }
      setTimeout(() => {
        setRefreshing(false);
        // In React Native, trigger a state update to force re-fetch
        // Option 1: Use a key prop on ScrollView or FeedCard
        // Option 2: Use a refresh state in useDailyFeed (recommended for production)
        // For now, just call completeItem(-1) to trigger a re-render
        completeItem(-1);
      }, 500);
    } catch (err) {
      setRefreshing(false);
      console.error('Error refreshing feed:', err);
    }
  };

  // Calculate progress
  const completedCount = feed ? feed.filter(item => item.completed).length : 0;
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
              <Text className="text-[#0cb9f2] text-2xl font-extrabold drop-shadow">{completedCount}/4</Text>
              <Text className="text-[#a2afb3] text-xs font-medium mt-1">Completed</Text>
            </View>
            <View className="items-center bg-[#232D3F] rounded-2xl py-3 px-7 mx-2 min-w-[90px] shadow">
              <Text className="text-[#34c759] text-2xl font-extrabold drop-shadow">{totalXP} XP</Text>
              <Text className="text-[#a2afb3] text-xs font-medium mt-1">Earned</Text>
            </View>
          </View>
          <TouchableOpacity
            className={`flex-row items-center justify-center self-center px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0cb9f2] to-[#0a7cff] shadow-md ${refreshing ? 'opacity-60' : 'active:scale-95'}`}
            onPress={handleRefresh}
            disabled={refreshing}
            activeOpacity={0.85}
            style={{ minWidth: 160 }}
          >
            <Text className="text-white text-lg font-bold tracking-wide">
              {refreshing ? 'Refreshing...' : '⟳ Refresh Feed'}
            </Text>
          </TouchableOpacity>
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

