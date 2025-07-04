import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { fetchQuizFromGemini, createFallbackQuiz } from '../api/quizApi';
import {
  loadNotificationTimes,
  getNextScheduleTime,
  getSecondsUntil,
  formatTimeDisplay,
  getScheduledNotifications
} from '../utils/notificationUtils';

// Constants
const QUIZ_NOTIFICATION_CHANNEL = 'quiz-notifications';

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
  notificationsEnabled: false,
  fetchQuiz: () => {},
  startQuiz: () => {},
  submitAnswer: () => {},
  finishQuiz: () => {},
  toggleNotifications: () => {},
  sendTestNotification: () => {},
});

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Function to schedule random quiz notifications with timezone-aware absolute scheduling
async function scheduleRandomQuizNotifications() {
  // Request notification permissions
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Notification permission not granted');
    return false;
  }

  // Create notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(QUIZ_NOTIFICATION_CHANNEL, {
      name: 'Quiz Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0CB9F2',
      sound: 'default',
    });
  }

  // Cancel any existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Load user's custom notification times
  const userNotificationTimes = await loadNotificationTimes();
  const enabledTimes = userNotificationTimes.filter(time => time.enabled);

  if (enabledTimes.length === 0) {
    console.log('No notification times enabled');
    return true; // Still considered successful
  }

  const motivationalMessages = [
    'Ready to challenge your brain? 🧠',
    'Time for a quick knowledge boost! ⚡',
    'Let\'s test what you know! 🎯',
    'Brain training time! 💪',
    'Quick quiz break! 📚'
  ];

  let scheduledCount = 0;

  for (const time of enabledTimes) {
    // Get random subject and message
    const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    try {
      // Calculate the next occurrence of this time using timezone-aware scheduling
      const scheduleTime = getNextScheduleTime(time.hour, time.minute);
      const secondsUntil = getSecondsUntil(scheduleTime);

      // Schedule using absolute seconds (more reliable than hour/minute)
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${randomSubject} Quiz! 🎓`,
          body: `${randomMessage} Topic: ${randomSubject}`,
          data: { 
            screen: 'QuizScreen',
            subject: randomSubject,
            type: 'daily_quiz',
            timeSlot: time.id
          },
          sound: 'default',
        },
        trigger: {
          seconds: secondsUntil,
          repeats: false, // We'll reschedule after each notification
        },
      });
      
      const timeDisplay = formatTimeDisplay(time.hour, time.minute);
      const scheduleDate = scheduleTime.toLocaleDateString();
      console.log(`✅ Scheduled notification for ${randomSubject} at ${timeDisplay} on ${scheduleDate} (in ${secondsUntil} seconds)`);
      scheduledCount++;
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  // Schedule a welcome notification in 10 seconds if this is the first time enabling
  try {
    const testSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Welcome to OutGrow! 🎉',
        body: `Notifications are now active! Here's a ${testSubject} quiz to get started.`,
        data: { 
          screen: 'QuizScreen',
          subject: testSubject,
          type: 'welcome'
        },
      },
      trigger: { seconds: 10 }
    });
    console.log('✅ Welcome notification scheduled');
  } catch (error) {
    console.error('Error scheduling welcome notification:', error);
  }

  // Log all scheduled notifications for debugging
  await getScheduledNotifications();

  console.log(`📅 Successfully scheduled ${scheduledCount} notifications`);
  return true;
}

// Function to send immediate quiz notification
async function sendTestNotification() {
  try {
    const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Test: ${randomSubject} Quiz! 🔔`,
        body: 'This is a test notification. Tap to start the quiz!',
        data: { 
          screen: 'QuizScreen',
          subject: randomSubject,
          type: 'test'
        },
        sound: 'default',
      },
      trigger: null, // Send immediately
    });
    
    console.log('Test notification sent for:', randomSubject);
    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
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
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Listen for notification clicks and initialize
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification clicked:', response);
      
      // Extract subject from notification data
      const notificationData = response.notification.request.content.data;
      if (notificationData?.subject) {
        // Fetch quiz for the specific subject
        fetchQuiz(notificationData.subject);
      }
    });
    
    // Load initial data
    loadQuizHistory();
    loadNotificationSettings();

    return () => subscription.remove();
  }, []);

  // Load notification settings
  const loadNotificationSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('notifications_enabled');
      setNotificationsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  // Load quiz history from storage
  const loadQuizHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('quiz_history');
      if (historyData) {
        setQuizHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Error loading quiz history:', error);
    }
  };

  // Toggle notifications
  const toggleNotifications = async (enabled) => {
    try {
      if (enabled) {
        const success = await scheduleRandomQuizNotifications();
        if (success) {
          setNotificationsEnabled(true);
          await AsyncStorage.setItem('notifications_enabled', 'true');
          return true;
        }
        return false;
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
        setNotificationsEnabled(false);
        await AsyncStorage.setItem('notifications_enabled', 'false');
        console.log('All notifications cancelled');
        return true;
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      return false;
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
      console.log('Fetching quiz for subject:', subject);
      const quizData = await fetchQuizFromGemini(subject);
      
      if (quizData) {
        setCurrentQuiz({
          ...quizData,
          subject: subject // Ensure subject is included
        });
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('latest_quiz', JSON.stringify({
          quiz: quizData,
          timestamp: new Date().toISOString(),
          subject
        }));
        
        console.log('Quiz fetched successfully for:', subject);
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
        notificationsEnabled,
        fetchQuiz,
        startQuiz,
        submitAnswer,
        finishQuiz,
        toggleNotifications,
        sendTestNotification,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook for using the quiz context
export const useQuiz = () => useContext(QuizContext);
