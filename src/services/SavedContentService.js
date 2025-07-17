// SavedContentService.js
// Handles saving and loading quizzes/tips to both AsyncStorage and Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './FirebaseService';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// --- Quizzes ---
export async function getSavedQuizzes(userId) {
  // Try local first
  const local = await AsyncStorage.getItem('saved_quizzes');
  if (local) return JSON.parse(local);
  // If not found, fetch from Firestore
  if (!userId) return {};
  const userDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userDoc);
  const quizzes = docSnap.exists() ? docSnap.data().savedQuizzes || {} : {};
  // Cache locally
  await AsyncStorage.setItem('saved_quizzes', JSON.stringify(quizzes));
  return quizzes;
}

export async function setSavedQuizzes(userId, quizzes) {
  await AsyncStorage.setItem('saved_quizzes', JSON.stringify(quizzes));
  if (userId) {
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, { savedQuizzes: quizzes }, { merge: true });
  }
}

// --- Tips ---
export async function getSavedTips(userId) {
  const local = await AsyncStorage.getItem('saved_tips');
  if (local) return JSON.parse(local);
  if (!userId) return {};
  const userDoc = doc(db, 'users', userId);
  const docSnap = await getDoc(userDoc);
  const tips = docSnap.exists() ? docSnap.data().savedTips || {} : {};
  await AsyncStorage.setItem('saved_tips', JSON.stringify(tips));
  return tips;
}

export async function setSavedTips(userId, tips) {
  await AsyncStorage.setItem('saved_tips', JSON.stringify(tips));
  if (userId) {
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, { savedTips: tips }, { merge: true });
  }
}
