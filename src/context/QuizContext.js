import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { fetchQuizFromGemini, createFallbackQuiz } from '../api/quizApi';
import {
  scheduleAllNotificationSlots,
  cancelAllScheduledNotifications,
  getNextNotificationsInfo,
  sendTestNotification,
  loadNotificationSlots,
  updateNotificationSlot
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

// QuizProvider component
export const QuizProvider = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timerDuration, setTimerDuration] = useState(300); // 5 min in seconds
  const [quizFinished, setQuizFinished] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);  // Listen for notifications received in foreground and handle rescheduling
  useEffect(() => {
    // Listen for notifications received when app is in foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      
      // Extract notification data
      const notificationData = notification.request.content.data;
      
      // If this was a daily quiz notification, reschedule all slots for tomorrow
      if (notificationData?.type === 'daily_quiz' && notificationsEnabled) {
        console.log('Rescheduling all notification slots after foreground delivery');
        scheduleAllNotificationSlots();
      }
    });

    // Listen for notification responses to handle rescheduling
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received in QuizContext:', response);
      
      // Extract notification data
      const notificationData = response.notification.request.content.data;
      
      // If this was a daily quiz notification, reschedule all slots for tomorrow
      if (notificationData?.type === 'daily_quiz' && notificationsEnabled) {
        console.log('Rescheduling all notification slots after user interaction');
        scheduleAllNotificationSlots();
      }
    });
    
    // Load initial data
    loadQuizHistory();
    loadNotificationSettings();

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
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
        // Request permissions first
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permissions denied');
          return false;
        }

        // Schedule notifications for all enabled slots
        const notificationIds = await scheduleAllNotificationSlots();
        if (notificationIds.length > 0) {
          setNotificationsEnabled(true);
          await AsyncStorage.setItem('notifications_enabled', 'true');
          
          // Send welcome test notification after 10 seconds
          setTimeout(() => {
            sendTestNotification();
          }, 10000);
          
          return true;
        }
        return false;
      } else {
        await cancelAllScheduledNotifications();
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

  // Manual reschedule function for UI components
  const rescheduleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        console.log('Notifications are disabled, skipping reschedule');
        return false;
      }
      
      const success = await scheduleAllNotificationSlots();
      console.log('Manual reschedule result:', success);
      return success.length > 0;
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
        loadNotificationSlots,
        updateNotificationSlot,
        scheduleAllNotificationSlots,
        getNextNotificationsInfo,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook for using the quiz context
export const useQuiz = () => useContext(QuizContext);
