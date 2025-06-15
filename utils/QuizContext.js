import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

// Constants
const GEMINI_API_KEY = "AIzaSyB1dfw9FMlxVUe44ekb_KbQ5ImKpqO70BI"; // Replace with your API key
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
const SUBJECTS = [
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

// Function to fetch quiz from Gemini
async function fetchQuizFromGemini(subject) {
  try {
    const prompt = `Create a quiz with 5 multiple-choice questions on the topic of ${subject}.
    Format the response as a valid JSON object with this structure:
    {
      "subject": "${subject}",
      "questions": [
        {
          "question": "Question text here",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctOptionIndex": correct_index_number_here,
          "explanation": "A thorough explanation of why the correct answer is right and why the other options are incorrect. Be educational and clear."
        }
      ]
    }
    Make sure the questions are challenging but appropriate for computer science students.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      // Extract JSON from response text
      const text = data.candidates[0].content.parts[0].text;
      console.log("Gemini response:", text.substring(0, 200) + "..."); // Log partial response
      const jsonMatch = text.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[0]) {
        try {
          const quizData = JSON.parse(jsonMatch[0]);
          
          // Validate quiz data structure
          if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
            console.error("Invalid quiz data: missing or empty questions array");
            return createFallbackQuiz(subject);
          }
          
          // Validate each question has the required fields
          for (const q of quizData.questions) {
            if (!q.question || !q.options || !Array.isArray(q.options) || q.correctOptionIndex === undefined) {
              console.error("Invalid question data", q);
              return createFallbackQuiz(subject);
            }
            
            // Add explanation field if missing
            if (!q.explanation) {
              q.explanation = `The correct answer is "${q.options[q.correctOptionIndex]}", which is the most accurate option based on standard definitions and practices in ${subject}.`;
            }
          }
          
          console.log("Quiz data successfully parsed and validated");
          return quizData;
        } catch (error) {
          console.error("Error parsing quiz JSON:", error);
          return createFallbackQuiz(subject);
        }
      }
    }
    
    console.error("Couldn't extract valid quiz JSON from Gemini response");
    return createFallbackQuiz(subject);
  } catch (error) {
    console.error('Error fetching quiz from Gemini:', error);
    return createFallbackQuiz(subject);
  }
}

// Create fallback quiz for when API fails
function createFallbackQuiz(subject) {
  console.log("Creating fallback quiz for", subject);
  return {
    subject: subject,
    questions: [
      {
        question: `What is a key concept in ${subject}?`,
        options: ["Abstraction", "Inheritance", "Polymorphism", "Encapsulation"],
        correctOptionIndex: 0,
        explanation: "Abstraction is a fundamental concept that involves simplifying complex systems by modeling classes based on their essential properties. It focuses on what an object does rather than how it does it, reducing complexity by hiding implementation details."
      },
      {
        question: `Which tool is most commonly used in ${subject}?`,
        options: ["Debugger", "Compiler", "IDE", "Version Control"],
        correctOptionIndex: 2,
        explanation: "Integrated Development Environments (IDEs) combine multiple tools including editors, compilers, debuggers, and code completion in one application. They are essential for efficient development, providing a complete toolset for coding, testing, and debugging."
      },
      {
        question: `A common challenge in ${subject} is:`,
        options: ["Memory management", "Performance optimization", "Security", "All of the above"],
        correctOptionIndex: 3,
        explanation: "All three options represent significant challenges in software development. Memory management prevents leaks, performance optimization ensures efficiency, and security protects against vulnerabilities. Together, they form the pillars of robust software engineering."
      },
      {
        question: `Which is NOT typically associated with ${subject}?`,
        options: ["Documentation", "Testing", "Marketing", "Design patterns"],
        correctOptionIndex: 2,
        explanation: "Marketing is not typically part of the technical development process. While documentation, testing, and design patterns are integral to software development, marketing is a business function that focuses on promoting the product rather than building it."
      },
      {
        question: `Best practice for ${subject} includes:`,
        options: ["Code reviews", "Continuous integration", "Test-driven development", "All of the above"],
        correctOptionIndex: 3,
        explanation: "All three practices are essential for high-quality software development. Code reviews catch bugs and share knowledge, continuous integration ensures code integrates smoothly, and test-driven development produces more reliable code. Together they form a comprehensive quality assurance approach."
      }
    ]
  };
}

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
