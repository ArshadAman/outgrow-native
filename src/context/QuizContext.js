import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { fetchQuizFromGemini, createFallbackQuiz } from '../api/quizApi';

// Constants
const QUIZ_TASK = 'FETCH_QUIZ_TASK';
const QUIZ_NOTIFICATION_CHANNEL = 'quiz-notifications';
const SCHEDULE_KEYS = {
  morning: 'quiz-morning',
  noon: 'quiz-noon', 
  afternoon: 'quiz-afternoon',
  evening: 'quiz-evening',
  night: 'quiz-night'
};

// Define the subjects for quizzes
export const SUBJECTS = [
  'Computer Networks',
  'Database Systems',
  'Object-Oriented Programming',
  'C/C++ Programming',
  'Operating Systems',
  'Data Structures and Algorithms'
];

// Context for quiz management
export const QuizContext = createContext({
  currentQuiz: null,
  isLoading: false,
  quizHistory: [],
  timerDuration: 300, // 5 minutes in seconds
  fetchQuiz: () => {},
  startQuiz: () => {},
  submitAnswer: () => {},
  finishQuiz: () => {},
});

// Define task handler for background quiz fetching
TaskManager.defineTask(QUIZ_TASK, async () => {
  try {
    // Generate a random subject
    const subjectIndex = Math.floor(Math.random() * SUBJECTS.length);
    const subject = SUBJECTS[subjectIndex];
    
    // Fetch a quiz from Gemini
    const quiz = await fetchQuizFromGemini(subject);
    
    // Save to AsyncStorage
    if (quiz) {
      await AsyncStorage.setItem('latest_quiz', JSON.stringify({
        quiz,
        timestamp: new Date().toISOString(),
        subject
      }));
    
      // Send notification
      await sendQuizNotification(subject);
    }
    
    return { result: true };
  } catch (error) {
    console.error('Background task failed:', error);
    return { result: false };
  }
});

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to send quiz notification
async function sendQuizNotification(subject) {
  // Create notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(QUIZ_NOTIFICATION_CHANNEL, {
      name: 'Quiz Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0CB9F2',
    });
  }

  // Send notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `New ${subject} Quiz Ready!`,
      body: 'Test your knowledge with 5 quick questions. Tap to start!',
      data: { screen: 'QuizScreen' },
    },
    trigger: null, // Send immediately
  });
}

// Schedule the quiz notifications
async function scheduleQuizNotifications() {
  // Cancel existing tasks first
  await TaskManager.unregisterAllTasksAsync();
  
  // Schedule 5 daily notifications at different times
  const schedules = [
    { hour: 8, minute: 0, key: SCHEDULE_KEYS.morning },    // 8:00 AM
    { hour: 12, minute: 0, key: SCHEDULE_KEYS.noon },      // 12:00 PM
    { hour: 15, minute: 30, key: SCHEDULE_KEYS.afternoon },// 3:30 PM
    { hour: 18, minute: 0, key: SCHEDULE_KEYS.evening },   // 6:00 PM
    { hour: 21, minute: 0, key: SCHEDULE_KEYS.night }      // 9:00 PM
  ];
  
  // Register for notifications permission
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }
  
  // Register background fetch task (this will be simulated in development)
  await TaskManager.registerTaskAsync(QUIZ_TASK, {
    minimumInterval: 3600, // 1 hour minimum
    stopOnTerminate: false,
    startOnBoot: true,
  });
  
  // In a production app, you'd set up a server to send push notifications
  // at these times. For this demo, we'll use scheduled notifications
  // to simulate the experience.
  
  // For this demo, let's create one scheduled task in 15 seconds to test
  const testNotificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'First Quiz Ready!',
      body: 'Test your knowledge with 5 quick questions. Tap to start!',
      data: { screen: 'QuizScreen' },
    },
    trigger: { seconds: 15 }
  });
  
  console.log('Test notification scheduled with ID:', testNotificationId);
}

// QuizProvider component
export const QuizProvider = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timerDuration, setTimerDuration] = useState(300); // 5 min in seconds
  const [quizFinished, setQuizFinished] = useState(false);

  // Listen for notification clicks
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      // This will be handled by the navigation container's linking
      console.log('Notification clicked:', response);
    });
    
    // Schedule quiz notifications
    scheduleQuizNotifications();
    
    // Check for any stored quiz
    loadLatestQuiz();

    return () => subscription.remove();
  }, []);

  // Load the latest quiz from storage
  const loadLatestQuiz = async () => {
    try {
      const latestQuizData = await AsyncStorage.getItem('latest_quiz');
      if (latestQuizData) {
        const parsed = JSON.parse(latestQuizData);
        // Don't set as current automatically, just keep it ready
        if (parsed && parsed.quiz) {
          setCurrentQuiz(parsed.quiz);
        }
      }
    } catch (error) {
      console.error('Error loading latest quiz:', error);
    }
  };

  // Fetch a new quiz
  const fetchQuiz = async (forceSubject = null) => {
    // Reset state
    setIsLoading(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizFinished(false);
    
    try {
      const subject = forceSubject || SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
      const quizData = await fetchQuizFromGemini(subject);
      
      if (quizData) {
        setCurrentQuiz(quizData);
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('latest_quiz', JSON.stringify({
          quiz: quizData,
          timestamp: new Date().toISOString(),
          subject
        }));
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a quiz
  const startQuiz = () => {
    console.log("Starting quiz with current state:", { 
      currentQuiz, 
      quizFinished, 
      currentQuestion 
    });
    
    if (!currentQuiz || !currentQuiz.questions || !currentQuiz.questions.length) {
      console.error("Cannot start quiz - invalid quiz data");
      // Try to fetch a quiz if we don't have valid data
      fetchQuiz();
      return;
    }
    
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizFinished(false);
    
    // Set timer based on the number of questions
    setTimerDuration(currentQuiz.questions.length * 60);
    
    console.log("Quiz started successfully");
  };

  // Submit an answer for the current question
  const submitAnswer = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    // Move to next question if available
    if (currentQuiz && currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Finish the current quiz
  const finishQuiz = async (reset = false) => {
    // If reset is true, just reset the state without saving history
    if (reset) {
      setQuizFinished(false);
      setCurrentQuestion(0);
      setSelectedAnswers([]);
      return;
    }
    
    setQuizFinished(true);
    
    if (currentQuiz) {
      // Calculate score
      let correctCount = 0;
      currentQuiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctOptionIndex) {
          correctCount++;
        }
      });
      
      const score = {
        subject: currentQuiz.subject,
        totalQuestions: currentQuiz.questions.length,
        correctAnswers: correctCount,
        date: new Date().toISOString(),
        selectedAnswers,
      };
      
      // Save to quiz history
      const updatedHistory = [...quizHistory, score];
      setQuizHistory(updatedHistory);
      
      // Store history in AsyncStorage
      try {
        await AsyncStorage.setItem('quiz_history', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error saving quiz history:', error);
      }
    }
  };

  return (
    <QuizContext.Provider
      value={{
        currentQuiz,
        isLoading,
        quizHistory,
        currentQuestion,
        selectedAnswers,
        timerDuration,
        quizFinished,
        fetchQuiz,
        startQuiz,
        submitAnswer,
        finishQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook for using the quiz context
export const useQuiz = () => useContext(QuizContext);
