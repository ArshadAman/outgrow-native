import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";

const tabList = ["Quizzes", "Tips"];

export default function SavedScreen() {
  const [tab, setTab] = useState("Quizzes");
  const [savedQuizzes, setSavedQuizzes] = useState({});
  const [savedTips, setSavedTips] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      loadSavedContent();
    }, [])
  );

  const loadSavedContent = async () => {
    try {
      // Load saved quizzes
      const savedQuizzesData = await AsyncStorage.getItem('saved_quizzes');
      if (savedQuizzesData) {
        setSavedQuizzes(JSON.parse(savedQuizzesData));
      }

      // Load saved tips
      const savedTipsData = await AsyncStorage.getItem('saved_tips');
      if (savedTipsData) {
        setSavedTips(JSON.parse(savedTipsData));
      }
    } catch (error) {
      console.error('Error loading saved content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group quizzes by subject
  const quizzesBySubject = Object.entries(savedQuizzes).reduce((acc, [key, quiz]) => {
    const subject = quiz.subject;
    if (!acc[subject]) {
      acc[subject] = [];
    }
    acc[subject].push(quiz);
    return acc;
  }, {});

  // Group tips by category (using techName as the category)
  const tipsByCategory = Object.entries(savedTips).reduce((acc, [key, tip]) => {
    const category = tip.techName || tip.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tip);
    return acc;
  }, {});

  const handleSubjectPress = (subject) => {
    navigation.navigate('SavedQuizzesDetail', { subject, quizzes: quizzesBySubject[subject] });
  };

  const handleTipCategoryPress = (category) => {
    navigation.navigate('SavedTipsDetail', { category, tips: tipsByCategory[category] });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#111618] justify-center items-center">
        <ActivityIndicator size="large" color="#0cb9f2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      {/* Title & Settings */}
      <View className="flex-row items-center bg-[#111618] p-4 pb-2 justify-between">
        <Text className="text-white text-2xl font-bold flex-1 text-center">Saved</Text>
      </View>

      {/* Tabs */}
      <View className="pb-3">
        <View className="flex-row border-b border-[#3b4e54] px-4 gap-8">
          {tabList.map((t) => (
            <TouchableOpacity
              key={t}
              className={`flex flex-col items-center justify-center pb-[13px] pt-4 ${tab === t ? "border-b-[3px] border-b-white" : "border-b-[3px] border-b-transparent"}`}
              onPress={() => setTab(t)}
            >
              <Text className={`text-sm font-bold tracking-[0.015em] ${tab === t ? "text-white" : "text-[#9cb2ba]"}`}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {tab === "Quizzes" ? (
          // Quizzes Tab Content
          <>
            {Object.entries(quizzesBySubject).map(([subject, quizzes]) => (
              <TouchableOpacity
                key={subject}
                className="p-4 border-b border-[#3b4e54]"
                onPress={() => handleSubjectPress(subject)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-white text-lg font-bold">{subject}</Text>
                    <Text className="text-[#9cb2ba] text-sm mt-1">
                      {quizzes.length} saved {quizzes.length === 1 ? 'question' : 'questions'}
                    </Text>
                  </View>
                  <Text className="text-[#0cb9f2] text-lg">→</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {Object.keys(quizzesBySubject).length === 0 && (
              <View className="flex-1 justify-center items-center p-8">
                <Text className="text-[#9cb2ba] text-center">
                  No saved quizzes yet. Start a quiz and save interesting questions!
                </Text>
              </View>
            )}
          </>
        ) : (
          // Tips Tab Content
          <>
            {Object.entries(tipsByCategory).map(([category, tips]) => (
              <TouchableOpacity
                key={category}
                className="p-4 border-b border-[#3b4e54]"
                onPress={() => handleTipCategoryPress(category)}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="text-white text-lg font-bold">{category}</Text>
                    <Text className="text-[#9cb2ba] text-sm mt-1">
                      {tips.length} saved {tips.length === 1 ? 'tip' : 'tips'}
                    </Text>
                    <Text className="text-[#9cb2ba] text-xs mt-1">
                      Latest: {new Date(tips[tips.length - 1]?.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="text-[#0cb9f2] text-lg">→</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            {Object.keys(tipsByCategory).length === 0 && (
              <View className="flex-1 justify-center items-center p-8">
                <Text className="text-[#9cb2ba] text-center">
                  No saved tips yet. Read some tips and save the ones you find useful!
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
