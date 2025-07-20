import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../auth/AuthContext';
import { getSavedQuizzes, getSavedTips } from '../services/SavedContentService';
import { Ionicons } from '@expo/vector-icons';

const tabList = ["Quizzes", "Tips"];

export default function SavedScreen() {
  const [tab, setTab] = useState("Quizzes");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [savedTips, setSavedTips] = useState([]);
  const navigation = useNavigation();
  const { user } = useAuth();

  // Load data from Firebase
  const loadSavedData = async () => {
    setLoading(true);
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    try {
      const quizzesObj = await getSavedQuizzes(user.uid);
      const tipsObj = await getSavedTips(user.uid);
      setSavedQuizzes(Array.isArray(quizzesObj) ? quizzesObj : Object.values(quizzesObj || {}));
      // Convert tips object to array and attach key
      let tipsArr = [];
      if (Array.isArray(tipsObj)) {
        tipsArr = tipsObj;
      } else {
        tipsArr = Object.entries(tipsObj || {}).map(([key, tip]) => ({ ...tip, key }));
      }
      setSavedTips(tipsArr);
    } catch (error) {
      setSavedQuizzes([]);
      setSavedTips([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSavedData();
    }, [user?.uid])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadSavedData();
  };

  // Group quizzes by subject
  const groupedQuizzes = savedQuizzes.reduce((acc, quiz) => {
    const subject = quiz.subject || 'Other';
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(quiz);
    return acc;
  }, {});

  // Group tips by category
  const groupedTips = savedTips.reduce((acc, tip) => {
    const category = tip.category || tip.techName || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(tip);
    return acc;
  }, {});

  const handleTopicPress = (topic, type) => {
    if (type === 'quiz') {
      navigation.navigate('SavedQuizzesDetail', { 
        subject: topic, 
        quizzes: groupedQuizzes[topic] || []
      });
    } else {
      navigation.navigate('SavedTipsDetail', { 
        category: topic, 
        tips: groupedTips[topic] || []
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#111618]">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0cb9f2" />
          <Text className="text-white text-lg mt-4">Loading saved content...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      <View className="p-4">
        <Text className="text-white text-2xl font-bold text-center">Saved</Text>
      </View>
      {/* Tabs */}
      <View className="pb-3 bg-[#181F2A] mx-4 rounded-xl">
        <View className="flex-row p-2">
          {tabList.map((t) => (
            <TouchableOpacity
              key={t}
              className={`flex-1 py-3 mx-1 rounded-lg ${tab === t ? "bg-white/10" : "bg-transparent"}`}
              onPress={() => setTab(t)}
            >
              <Text style={{color: tab === t ? '#fff' : '#9cb2ba', fontWeight: 'bold', textAlign: 'center'}}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* Content */}
      <ScrollView
        className="flex-1 px-4 mt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0cb9f2" />
        }
      >
        {tab === "Quizzes" ? (
          Object.keys(groupedQuizzes).length === 0 ? (
            <View className="flex-1 justify-center items-center p-8 mt-20">
              <Text className="text-[#9cb2ba] text-center text-lg">No saved quizzes found.</Text>
              <Text className="text-[#9cb2ba] text-center text-sm mt-2">Pull down to refresh or save some quizzes to see them here.</Text>
            </View>
          ) : (
            Object.entries(groupedQuizzes).map(([subject, quizzes]) => (
              <TouchableOpacity
                key={subject}
                className="mb-2 p-4 bg-[#181F2A] border-b border-[#232D3F] flex-row items-center justify-between"
                onPress={() => handleTopicPress(subject, 'quiz')}
              >
                <View>
                  <Text className="text-white text-lg font-bold">{subject}</Text>
                  <Text className="text-[#9cb2ba] text-sm mt-1">{quizzes.length} saved {quizzes.length === 1 ? 'question' : 'questions'}</Text>
                </View>
                <Ionicons name="arrow-forward-outline" size={22} color="#9cb2ba" />
              </TouchableOpacity>
            ))
          )
        ) : (
          Object.keys(groupedTips).length === 0 ? (
            <View className="flex-1 justify-center items-center p-8 mt-20">
              <Text className="text-[#9cb2ba] text-center text-lg">No saved tips found.</Text>
              <Text className="text-[#9cb2ba] text-center text-sm mt-2">Pull down to refresh or save some tips to see them here.</Text>
            </View>
          ) : (
            Object.entries(groupedTips).map(([category, tips]) => (
              <TouchableOpacity
                key={category}
                className="mb-2 p-4 bg-[#181F2A] border-b border-[#232D3F] flex-row items-center justify-between"
                onPress={() => handleTopicPress(category, 'tip')}
              >
                <View>
                  <Text className="text-white text-lg font-bold">{category}</Text>
                  <Text className="text-[#9cb2ba] text-sm mt-1">{tips.length} saved {tips.length === 1 ? 'tip' : 'tips'}</Text>
                </View>
                <Ionicons name="arrow-forward-outline" size={22} color="#9cb2ba" />
              </TouchableOpacity>
            ))
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
