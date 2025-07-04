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
  getScheduledNotifications,
  getNextOccurrence,
  scheduleNextDailyNotification,
  cancelAllScheduledNotifications,
  scheduleAllDailyNotifications
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
  rescheduleNotifications: () => {},
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

// Function to schedule robust daily quiz notifications
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

  // Function to generate notification content for a time slot
  const getNotificationContent = (timeSlot) => {
    const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    return {
      title: `${randomSubject} Quiz! 🎓`,
      body: `${randomMessage} Topic: ${randomSubject}`,
      data: { 
        screen: 'QuizScreen',
        subject: randomSubject,
        type: 'daily_quiz',
        timeSlot: timeSlot.id
      },
      sound: 'default',
    };
  };

  // Use the robust scheduling utility
  const scheduledCount = await scheduleAllDailyNotifications(userNotificationTimes, getNotificationContent);

  // Log all scheduled notifications for debugging
  await getScheduledNotifications();

  console.log(`📅 Successfully scheduled ${scheduledCount} robust daily notifications`);
  return scheduledCount > 0;
}

// Function to reschedule a notification after it fires
async function rescheduleNotificationAfterFiring(notificationData) {
  try {
    if (!notificationData?.timeSlot) {
      console.log('No timeSlot in notification data, skipping reschedule');
      return false;
    }

    // Load current notification times
    const userNotificationTimes = await loadNotificationTimes();
    const timeSlot = userNotificationTimes.find(time => time.id === notificationData.timeSlot);
    
    if (!timeSlot || !timeSlot.enabled) {
      console.log(`TimeSlot ${notificationData.timeSlot} not found or disabled, skipping reschedule`);
      return false;
    }

    const motivationalMessages = [
      'Ready to challenge your brain? 🧠',
      'Time for a quick knowledge boost! ⚡',
      'Let\'s test what you know! 🎯',
      'Brain training time! 💪',
      'Quick quiz break! 📚'
    ];

    // Generate content for the rescheduled notification
    const randomSubject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    const notificationContent = {
      title: `${randomSubject} Quiz! 🎓`,
      body: `${randomMessage} Topic: ${randomSubject}`,
      data: { 
        screen: 'QuizScreen',
        subject: randomSubject,
        type: 'daily_quiz',
        timeSlot: timeSlot.id
      },
      sound: 'default',
    };

    // Schedule the next occurrence of this time slot
    const notificationId = await scheduleNextDailyNotification(timeSlot, notificationContent);
    
    if (notificationId) {
      console.log(`🔄 Rescheduled notification for timeSlot ${timeSlot.id} successfully`);
      return true;
    } else {
      console.log(`❌ Failed to reschedule notification for timeSlot ${timeSlot.id}`);
      return false;
    }

  } catch (error) {
    console.error('Error rescheduling notification after firing:', error);
    return false;
  }
}
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
        
        // If this was a daily quiz notification, reschedule it for tomorrow
        if (notificationData.type === 'daily_quiz') {
          console.log('Rescheduling daily quiz notification after user interaction');
          rescheduleNotificationAfterFiring(notificationData);
        }
      }
    });
    
    // Also listen for notifications received when app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      
      // Extract notification data
      const notificationData = notification.request.content.data;
      
      // If this was a daily quiz notification, reschedule it for tomorrow
      if (notificationData?.type === 'daily_quiz') {
        console.log('Rescheduling daily quiz notification after foreground delivery');
        rescheduleNotificationAfterFiring(notificationData);
      }
    });
    
    // Load initial data
    loadQuizHistory();
    loadNotificationSettings();

    return () => {
      subscription.remove();
      foregroundSubscription.remove();
    };
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
        await cancelAllScheduledNotifications();
        setNotificationsEnabled(false);
        await AsyncStorage.setItem('notifications_enabled', 'false');
        console.log('All notifications cancelled using robust cancellation');
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

  // Manual reschedule function for UI components
  const rescheduleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        console.log('Notifications are disabled, skipping reschedule');
        return false;
      }
      
      const success = await scheduleRandomQuizNotifications();
      console.log('Manual reschedule result:', success);
      return success;
    } catch (error) {
      console.error('Error manually rescheduling notifications:', error);
      return false;
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
        rescheduleNotifications,
        sendTestNotification,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook for using the quiz context
export const useQuiz = () => useContext(QuizContext);
