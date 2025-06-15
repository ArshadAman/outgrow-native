/**
 * Application configuration constants
 */

// API Keys
export const GEMINI_API_KEY = "AIzaSyB1dfw9FMlxVUe44ekb_KbQ5ImKpqO70BI";

// API Endpoints
export const AUTH_API = "https://dummyjson.com/auth";
export const USERS_API = "https://dummyjson.com/users";

// Quiz Subjects
export const QUIZ_SUBJECTS = [
  'Computer Networks',
  'Database Systems',
  'Object-Oriented Programming',
  'C/C++ Programming',
  'Operating Systems',
  'Data Structures and Algorithms'
];

// Notification channels
export const QUIZ_NOTIFICATION_CHANNEL = 'quiz-notifications';

// Storage keys
export const STORAGE_KEYS = {
  token: 'token',
  userData: 'user_data',
  quizHistory: 'quiz_history',
  latestQuiz: 'latest_quiz',
  scheduleMorning: 'quiz-morning',
  scheduleNoon: 'quiz-noon',
  scheduleAfternoon: 'quiz-afternoon',
  scheduleEvening: 'quiz-evening',
  scheduleNight: 'quiz-night',
};

// Task names
export const TASK_NAMES = {
  fetchQuiz: 'FETCH_QUIZ_TASK'
};
