import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const tabList = ["Quizzes", "Tips"];

export default function SavedScreen() {
  const [tab, setTab] = useState("Quizzes");
  const [savedQuizzes, setSavedQuizzes] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      loadSavedQuizzes();
    }, [])
  );

  const loadSavedQuizzes = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_quizzes');
      if (saved) {
        setSavedQuizzes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved quizzes:', error);
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

  const handleSubjectPress = (subject) => {
    navigation.navigate('SavedQuizzesDetail', { subject, quizzes: quizzesBySubject[subject] });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#111618] justify-center items-center">
        <ActivityIndicator size="large" color="#0cb9f2" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#111618]">
      {/* Title & Settings */}
      <View className="flex-row items-center bg-[#111618] p-4 pb-2 justify-between">
        <Text className="text-white text-lg font-bold flex-1 text-center pl-12">Saved</Text>
        <TouchableOpacity className="w-12 items-end">
          <Text className="text-white text-2xl">⚙️</Text>
        </TouchableOpacity>
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

      {/* Saved Quizzes List */}
      <ScrollView className="flex-1">
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
              No saved quizzes yet. Complete quizzes and save questions to see them here!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
