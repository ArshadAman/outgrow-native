import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { removeSavedQuiz } from '../services/SavedContentService';

export default function SavedQuizzesDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { subject, quizzes: initialQuizzes = [] } = route.params || {};
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteAnim, setDeleteAnim] = useState(0);

  // Helper to reload quizzes from Firestore after deletion
  const reloadQuizzes = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const { getSavedQuizzes } = require('../services/SavedContentService');
      const allQuizzes = await getSavedQuizzes(user.uid);
      // Filter for current subject
      const quizzesArr = Object.values(allQuizzes || {}).filter(q => (q.subject || subject) === subject);
      setQuizzes(quizzesArr);
    } catch (err) {
      // fallback: keep current
    } finally {
      setLoading(false);
    }
  };

  const removeQuiz = async (quizToRemove) => {
    try {
      Alert.alert(
        'Remove Quiz',
        'Are you sure you want to remove this quiz from your saved list?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              setDeleting(true);
              let anim = 0;
              setDeleteAnim(anim);
              // Animate spinner
              const interval = setInterval(() => {
                anim += 30;
                setDeleteAnim(anim);
              }, 16);
              await removeSavedQuiz(user.uid, quizToRemove.key);
              await reloadQuizzes();
              clearInterval(interval);
              setDeleting(false);
              // If no quizzes left, go back
              setTimeout(() => {
                if (quizzes.length === 1) navigation.goBack();
              }, 200);
            },
          },
        ]
      );
    } catch (error) {
      setDeleting(false);
      console.error('Error removing quiz:', error);
      Alert.alert('Error', 'Failed to remove quiz.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      {/* Overlay for deleting animation */}
      {deleting && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(17,22,24,0.55)',
          zIndex: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicons name="refresh" size={60} color="#0cb9f2" style={{ marginBottom: 20, transform: [{ rotate: `${deleteAnim}deg` }] }} />
          <Text className="text-white text-xl font-bold mb-2">Deleting...</Text>
          <Text className="text-[#9cb2ba] text-base text-center">Please wait while we remove your quiz.</Text>
        </View>
      )}
      {/* Header */}
      <View className="flex-row items-center px-6 py-5 border-b border-[#232D3F] bg-[#181F2A]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={26} color="#0cb9f2" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold flex-1">{subject} Quizzes</Text>
      </View>

      {/* Quizzes List */}
      <ScrollView className="flex-1 px-6 py-4">
        {loading ? (
          <View className="flex-1 justify-center items-center p-8 mt-20">
            <Text className="text-[#9cb2ba] text-center text-lg">Loading...</Text>
          </View>
        ) : quizzes.length === 0 ? (
          <View className="flex-1 justify-center items-center p-8 mt-20">
            <Text className="text-[#9cb2ba] text-center text-lg">
              No quizzes found in this topic.
            </Text>
          </View>
        ) : (
          quizzes.map((quiz, index) => (
            <View key={quiz.key || `${quiz.subject || subject}_${index}`} className="mb-5 p-5 bg-[#181F2A] rounded-2xl border border-[#232D3F] shadow-md">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white text-lg font-bold flex-1 mr-2">{quiz.question || quiz.title || 'Untitled Quiz'}</Text>
                <TouchableOpacity onPress={() => removeQuiz({ ...quiz, key: quiz.key || `${quiz.subject || subject}_${index}` })} className="ml-2">
                  <Ionicons name="trash-outline" size={22} color="#ff4444" />
                </TouchableOpacity>
              </View>
              <View className="mb-2">
                {quiz.options && quiz.options.map((option, idx) => (
                  <View 
                    key={idx} 
                    className={`mb-3 p-3 rounded-lg ${idx === quiz.correctAnswer ? 'bg-[#34c759]' : 'bg-[#232D3F]'}`}
                  >
                    <Text className={`${idx === quiz.correctAnswer ? 'text-white' : 'text-[#9cb2ba]'} font-medium text-base`}>
                      {String.fromCharCode(65 + idx)}. {option}
                    </Text>
                  </View>
                ))}
              </View>
              {quiz.explanation && (
                <View className="mt-3 p-3 bg-[#232D3F] rounded-lg">
                  <Text className="text-[#0cb9f2] text-base font-bold mb-1">Explanation:</Text>
                  <Text className="text-[#9cb2ba] text-base">{quiz.explanation}</Text>
                </View>
              )}
              <Text className="text-[#9cb2ba] text-xs mt-3">
                Saved: {quiz.timestamp ? new Date(quiz.timestamp).toLocaleDateString() : 'Unknown'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}