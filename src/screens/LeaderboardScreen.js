// LeaderboardScreen.js
// Screen for viewing user XP-based rankings
import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useAuth } from '../auth/AuthContext';

const LeaderboardScreen = () => {
  const { user } = useAuth();
  const { leaderboard, loading } = useLeaderboard(user?.username || user?.email || '');

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Leaderboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.userId}
          renderItem={({ item, index }) => (
            <View className="border-b border-gray-200 py-2 flex-row items-center">
              <Text className="w-8 text-lg font-bold">#{index + 1}</Text>
              <View className="flex-1">
                <Text className="text-lg font-semibold">{item.username || item.userId}</Text>
                <Text>XP: {item.xp}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default LeaderboardScreen;
