import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedQuizzesDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { subject, quizzes: initialQuizzes } = route.params;
  const [savedQuizzes, setSavedQuizzes] = useState({});
  const [quizzes, setQuizzes] = useState(initialQuizzes);

  useEffect(() => {
    loadSavedQuizzes();
  }, []);

  const loadSavedQuizzes = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_quizzes');
      if (saved) {
        setSavedQuizzes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved quizzes:', error);
    }
  };

  const toggleSaveQuiz = async (quiz, index) => {
    try {
      const quizKey = `${subject}_${index}`;
      const newSavedQuizzes = { ...savedQuizzes };
      
      if (newSavedQuizzes[quizKey]) {
        delete newSavedQuizzes[quizKey];
        await AsyncStorage.setItem('saved_quizzes', JSON.stringify(newSavedQuizzes));
        setSavedQuizzes(newSavedQuizzes);
        
        // Update the quizzes list by removing the unsaved quiz
        const updatedQuizzes = quizzes.filter((_, i) => i !== index);
        setQuizzes(updatedQuizzes);
        
        // If this was the last quiz in this subject, go back to the saved screen
        if (updatedQuizzes.length === 0) {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error('Error unsaving quiz:', error);
      Alert.alert('Error', 'Failed to unsave the quiz. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-[#3b4e54]">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold flex-1">{subject}</Text>
        <Text className="text-[#9cb2ba] text-sm">
          {quizzes.length} {quizzes.length === 1 ? 'question' : 'questions'}
        </Text>
      </View>

      {/* Questions List */}
      <ScrollView className="flex-1">
        {quizzes.map((quiz, index) => (
          <View key={index} className="p-4 border-b border-[#3b4e54]">
            <View className="flex-row justify-between items-start mb-3">
              <Text className="text-white text-lg font-medium flex-1 mr-2">
                {quiz.question}
              </Text>
              <TouchableOpacity
                onPress={() => toggleSaveQuiz(quiz, index)}
                className="p-2"
              >
                <Ionicons
                  name="bookmark"
                  size={24}
                  color="#0cb9f2"
                />
              </TouchableOpacity>
            </View>

            {/* Options */}
            {quiz.options.map((option, optIdx) => (
              <View
                key={optIdx}
                className={`flex-row items-center p-3 mb-2 rounded-lg ${
                  optIdx === quiz.correctAnswer
                    ? 'bg-[#1e493e]'
                    : optIdx === quiz.userAnswer && optIdx !== quiz.correctAnswer
                      ? 'bg-[#4e2c35]'
                      : 'bg-[#232D3F]'
                }`}
              >
                <Text
                  className={`text-base ${
                    optIdx === quiz.correctAnswer
                      ? 'text-[#34c759] font-medium'
                      : optIdx === quiz.userAnswer && optIdx !== quiz.correctAnswer
                        ? 'text-[#ff3b30] font-medium'
                        : 'text-white'
                  }`}
                >
                  {option}
                </Text>

                {optIdx === quiz.correctAnswer && (
                  <Text className="text-[#34c759] ml-2">✓</Text>
                )}
                {optIdx === quiz.userAnswer && optIdx !== quiz.correctAnswer && (
                  <Text className="text-[#ff3b30] ml-2">✗</Text>
                )}
              </View>
            ))}

            {/* Explanation */}
            <View className="mt-3 pt-3 border-t border-[#3b4e54]">
              <Text className="text-[#0cb9f2] text-sm font-medium mb-1">Explanation:</Text>
              <Text className="text-[#a2afb3] text-sm leading-5">
                {quiz.explanation || "The correct answer is " + quiz.options[quiz.correctAnswer] + "."}
              </Text>
            </View>

            {/* Learning Tip for wrong answers */}
            {quiz.userAnswer !== undefined && quiz.userAnswer !== quiz.correctAnswer && (
              <View className="mt-3 bg-[#232D3F] p-3 rounded-lg">
                <Text className="text-[#ff9500] text-sm font-medium mb-1">💡 Learning Tip:</Text>
                <Text className="text-[#a2afb3] text-sm leading-5">
                  {`You selected "${quiz.options[quiz.userAnswer]}". ${
                    quiz.explanation
                      ? "Review the explanation above to understand why this isn't correct."
                      : `The correct answer is "${quiz.options[quiz.correctAnswer]}". Remember this for next time!`
                  }`}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
} 