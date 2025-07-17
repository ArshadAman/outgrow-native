// DailyFeedScreen.js
// Screen for daily personalized content (quizzes, tips, reminders)
import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useDailyFeed } from '../hooks/useDailyFeed';
import { useAuth } from '../auth/AuthContext';

const DailyFeedScreen = () => {
  const { user } = useAuth();
  const { feed, loading } = useDailyFeed(user?.username || user?.email || '');

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Your Daily Feed</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : feed ? (
        // TODO: Render quizzes, tips, reminders from feed
        <Text>Personalized content will appear here.</Text>
      ) : (
        <Text>No feed available. Check back later!</Text>
      )}
    </ScrollView>
  );
};

export default DailyFeedScreen;
