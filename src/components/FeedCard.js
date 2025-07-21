// FeedCard.js
// Displays a daily feed item with action
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, TextInput, ScrollView } from 'react-native';
import { Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';

function FeedCard({ item, onComplete, navigation }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(item.completed);
  const [challengeInput, setChallengeInput] = useState('');
  const [challengeResult, setChallengeResult] = useState(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  // const [language, setLanguage] = useState('javascript');
  // For demo, randomly pick answer index (simulate Gemini returning answer)
  const answerIdx = item.content.answer !== undefined ? item.content.answer : Math.floor(Math.random() * 4);

  const handleQuizSelect = (idx) => {
    setSelected(idx);
    if (idx === answerIdx) {
      setShowResult(true);
      setTimeout(() => {
        setQuizCompleted(true);
        if (typeof onComplete === 'function') {
          onComplete();
        }
        if (navigation && navigation.replace) {
          navigation.replace('App');
        }
      }, 600);
    } else {
      setShowResult(true);
      // Do not grant XP or complete quiz, just show incorrect and allow retry
      setTimeout(() => {
        setShowResult(false);
        setSelected(null);
      }, 1200);
    }
  };

  // Challenge validation with Gemini
  const handleChallengeSubmit = async () => {
    setChallengeLoading(true);
    setChallengeResult(null);
    try {
      // Call Gemini API to validate code
      // Prompt: "Here is a coding challenge: ... Here is the user's solution: ... Is it correct? Reply only 'yes' or 'no'."
      const prompt = `Here is a coding challenge: ${item.content}\nHere is the user's solution:\n${challengeInput}\nIs this solution correct? Reply only 'yes' or 'no'.`;
      // Use GeminiService.generateQuizOrTip (import if needed)
      const { GeminiService } = require('../services/GeminiService');
      const result = await GeminiService.generateQuizOrTip(prompt);
      if (result && result.toLowerCase().includes('yes')) {
        setChallengeResult('Correct! XP Granted.');
        setTimeout(() => {
          setChallengeLoading(false);
          onComplete();
        }, 800);
      } else {
        setChallengeResult('Incorrect or incomplete. Try again!');
        setChallengeLoading(false);
      }
    } catch (err) {
      setChallengeResult('Error validating solution.');
      setChallengeLoading(false);
    }
  };

  return (
    <View className="bg-[#181F2A] rounded-2xl p-5 mb-5 shadow-lg">
      {/* Tip Card */}
      {item.type === 'tip' && (
        <>
          <Text className="text-lg font-bold text-white mb-2">{item.title}</Text>
          <Text className="text-[#a2afb3] mb-3">{item.content}</Text>
        </>
      )}
      {/* Coding Challenge Card */}
      {item.type === 'challenge' && (
        <View style={{
          marginBottom: 24,
          backgroundColor: '#181F2A',
          borderRadius: 18,
          overflow: 'hidden',
          // Use same horizontal padding as quiz/tip cards
          paddingHorizontal: 0,
        }}>
          {/* XP badge, language selector row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0, paddingTop: 18, paddingBottom: 2 }}>
            <View style={{ backgroundColor: '#232D3F', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2 }}>
              <Text style={{ color: '#0cb9f2', fontWeight: 'bold', fontSize: 13 }}>+{item.xp} XP</Text>
            </View>
          </View>
          {/* Challenge description and controls */}
          <View style={{ paddingHorizontal: 0, paddingTop: 14, paddingBottom: 16 }}>
            <Text
              style={{
                color: '#a2afb3',
                fontSize: 16,
                marginBottom: 18,
                fontWeight: '600',
                lineHeight: 23,
                letterSpacing: 0.1,
                fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'sans-serif',
                textAlign: 'left',
              }}
            >
              {item.content}
            </Text>
            {/* Toolbar for code symbols */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10, paddingVertical: 2 }}>
              {/* Add Tab button for indentation */}
              <TouchableOpacity
                key={'tab'}
                onPress={() => {
                  if (!item.completed && !challengeLoading) setChallengeInput(challengeInput + '    ');
                }}
                style={{
                  backgroundColor: '#232D3F',
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 12,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: '#0cb9f2',
                  minWidth: 38,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                disabled={item.completed || challengeLoading}
              >
                <Text style={{ color: '#0cb9f2', fontSize: 16, fontWeight: 'bold' }}>Tab</Text>
              </TouchableOpacity>
              {['{', '}', '(', ')', '[', ']', ';', ':', '=', '+', '-', '*', '/', '<', '>', '"', '\'', ',', '.', '#'].map(symbol => (
                <TouchableOpacity
                  key={symbol}
                  onPress={() => {
                    if (!item.completed && !challengeLoading) setChallengeInput(challengeInput + symbol);
                  }}
                  style={{
                    backgroundColor: '#232D3F',
                    borderRadius: 6,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    marginRight: 6,
                    borderWidth: 1,
                    borderColor: '#0cb9f2',
                    minWidth: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  disabled={item.completed || challengeLoading}
                >
                  <Text style={{ color: '#0cb9f2', fontSize: 16 }}>{symbol}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Code input area with paste icon inside */}
            <View style={{ position: 'relative', backgroundColor: '#232D3F', borderRadius: 14, padding: 12, minHeight: 180, maxHeight: 340, marginBottom: 12, borderWidth: 0 }}>
              {/* Paste icon in top right of code input */}
              <TouchableOpacity
                onPress={async () => {
                  if (!item.completed && !challengeLoading) {
                    try {
                      const text = await Clipboard.getStringAsync();
                      if (text) setChallengeInput(challengeInput + text);
                    } catch (e) {}
                  }
                }}
                style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, backgroundColor: '#232D3F', borderRadius: 6, padding: 4 }}
                disabled={item.completed || challengeLoading}
              >
                <Text style={{ color: '#0cb9f2', fontSize: 18 }}>📋</Text>
              </TouchableOpacity>
              <ScrollView
                style={{ maxHeight: 300 }}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
              >
                <TextInput
                  value={challengeInput}
                  onChangeText={text => {
                    setChallengeInput(text);
                  }}
                  placeholder={`Write your code here...`}
                  placeholderTextColor="#6b7680"
                  multiline
                  editable={!item.completed && !challengeLoading}
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    minHeight: 180,
                    maxHeight: 300,
                    textAlignVertical: 'top',
                    fontFamily: 'Menlo',
                    letterSpacing: 0.2,
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  spellCheck={false}
                  scrollEnabled
                />
              </ScrollView>
            </View>
            {/* Submit button and result */}
            <View style={{ width: '100%', marginTop: 2 }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 15,
                  borderRadius: 18,
                  width: '100%',
                  marginBottom: 2,
                  opacity: item.completed || challengeLoading || !challengeInput.trim() ? 0.7 : 1,
                  backgroundColor: item.completed ? '#34c759' : '#0cb9f2',
                }}
                onPress={handleChallengeSubmit}
                disabled={item.completed || challengeLoading || !challengeInput.trim()}
                activeOpacity={0.92}
              >
                <Text style={{
                  fontSize: 19,
                  color: '#fff',
                  fontWeight: 'bold',
                  letterSpacing: 0.7,
                  textTransform: 'uppercase',
                  fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed',
                }}>
                  {item.completed ? 'Completed' : challengeLoading ? 'Checking...' : 'Submit Solution'}
                </Text>
              </TouchableOpacity>
              {challengeResult && (
                <Text style={{
                  marginTop: 10,
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: challengeResult.includes('Correct') ? '#34c759' : '#ff3b30',
                  textAlign: 'center',
                }}>{challengeResult}</Text>
              )}
            </View>
          </View>
        </View>
      )}
      {/* Resource Card */}
      {item.type === 'resource' && (
        <View className="mb-3">
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text
              style={{
                color: '#0cb9f2',
                fontSize: 20,
                fontWeight: 'bold',
                letterSpacing: 0.5,
                textShadowColor: '#232D3F',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 6,
                fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'sans-serif-condensed',
                textAlign: 'left',
                flex: 1,
              }}
            >
              {item.content.title || 'Resource'}
            </Text>
            {item.xp && (
              <View style={{ backgroundColor: '#232D3F', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2, marginLeft: 8 }}>
                <Text style={{ color: '#0cb9f2', fontWeight: 'bold', fontSize: 13 }}>+{item.xp} XP</Text>
              </View>
            )}
          </View>
          <Text className="text-[#a2afb3] mb-2">{item.content.desc && item.content.desc.replace(/^URL:?\s*/i, '')}</Text>
          <TouchableOpacity
            className={`flex-row items-center justify-center mt-4 py-3 px-6 rounded-xl border-2 border-[#0cb9f2] ${item.completed ? 'bg-[#34c759]' : 'bg-[#0cb9f2]'} ${item.completed ? 'opacity-80' : 'active:scale-95'}`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={() => {
              if (!item.completed) onComplete();
              Linking.openURL(item.content.url);
            }}
            disabled={item.completed}
            activeOpacity={0.85}
          >
            {!item.completed && (
              <Text className="mr-2 text-xl">🌐</Text>
            )}
            <Text className="text-white text-lg font-bold tracking-wide drop-shadow">
              {item.completed ? 'Completed' : 'Open Resource'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Quiz Card */}
      {item.type === 'quiz' && (
        <View className="mb-2">
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text className="text-[#a2afb3] font-semibold flex-1">{item.content.question}</Text>
            <View style={{ backgroundColor: '#232D3F', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 2, marginLeft: 8 }}>
              <Text style={{ color: '#0cb9f2', fontWeight: 'bold', fontSize: 13 }}>+{item.xp} XP</Text>
            </View>
          </View>
          {item.content.options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              className={`py-2 px-3 rounded-lg mb-2 ${selected === i ? (i === answerIdx ? 'bg-[#34c759]' : 'bg-[#ff3b30]') : 'bg-[#232D3F]'}`}
              disabled={quizCompleted || showResult}
              onPress={() => handleQuizSelect(i)}
            >
              <Text className="text-white text-base">
                {String.fromCharCode(65 + i)}. {opt}
              </Text>
            </TouchableOpacity>
          ))}
          {showResult && (
            <Text className={`mt-2 text-base font-bold ${selected === answerIdx ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
              {selected === answerIdx
                ? 'Correct! XP Granted.'
                : `Incorrect. Correct answer: ${String.fromCharCode(65 + answerIdx)}. ${item.content.options[answerIdx]}`}
            </Text>
          )}
        </View>
      )}
      {/* Completed badge for quiz */}
      {item.type === 'quiz' && quizCompleted && (
        <View className="mt-4 py-2 px-4 rounded-xl bg-[#34c759] items-center">
          <Text className="text-white text-base font-semibold">Completed</Text>
        </View>
      )}
    </View>
)
}

export default FeedCard;
