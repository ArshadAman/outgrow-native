// SavedContentService.js
// Handles saving and loading quizzes/tips to both AsyncStorage and Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from './FirebaseService';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

// --- Quizzes ---
export async function getSavedQuizzes(userId) {
  try {
    console.log('getSavedQuizzes called with userId:', userId);
    if (!userId) {
      console.log('No userId provided, returning empty object');
      return {};
    }
    
    // Try Firestore first for most up-to-date data
    const quizDoc = doc(db, 'saved_quizzes', userId);
    const docSnap = await getDoc(quizDoc);
    
    if (docSnap.exists()) {
      const firestoreData = docSnap.data().quizzes || {};
      console.log('Found Firestore saved quizzes:', Object.keys(firestoreData).length);
      // Cache locally
          await AsyncStorage.setItem(`saved_quizzes_${userId}`, JSON.stringify(firestoreData));
      return firestoreData;
    } else {
      console.log('No Firestore document found, checking local storage');
      // Fallback to local
          const local = await AsyncStorage.getItem(`saved_quizzes_${userId}`);
      const localData = local ? JSON.parse(local) : {};
      console.log('Local saved quizzes:', Object.keys(localData).length);
      return localData;
    }
  } catch (error) {
    console.error('Error getting saved quizzes:', error);
    // Fallback to local storage
    try {
          const local = await AsyncStorage.getItem(`saved_quizzes_${userId}`);
      return local ? JSON.parse(local) : {};
    } catch (localError) {
      console.error('Error getting local saved quizzes:', localError);
      return {};
    }
  }
}

export async function setSavedQuizzes(userId, quizzes) {
  await AsyncStorage.setItem(`saved_quizzes_${userId}`, JSON.stringify(quizzes));
  if (userId) {
    const quizDoc = doc(db, 'saved_quizzes', userId);
    await setDoc(quizDoc, { quizzes }); // Overwrite quizzes object, remove deleted keys
  }
}

// --- Tips ---
export async function getSavedTips(userId) {
  try {
    console.log('getSavedTips called with userId:', userId);
    if (!userId) {
      console.log('No userId provided, returning empty object');
      return {};
    }
    
    // Try Firestore first for most up-to-date data
    const tipsDoc = doc(db, 'saved_tips', userId);
    const docSnap = await getDoc(tipsDoc);
    
    if (docSnap.exists()) {
      const firestoreData = docSnap.data().tips || {};
      console.log('Found Firestore saved tips:', Object.keys(firestoreData).length);
      // Cache locally
          await AsyncStorage.setItem(`saved_tips_${userId}`, JSON.stringify(firestoreData));
      return firestoreData;
    } else {
      console.log('No Firestore tips document found, checking local storage');
      // Fallback to local
          const local = await AsyncStorage.getItem(`saved_tips_${userId}`);
      const localData = local ? JSON.parse(local) : {};
      console.log('Local saved tips:', Object.keys(localData).length);
      return localData;
    }
  } catch (error) {
    console.error('Error getting saved tips:', error);
    // Fallback to local storage
    try {
          const local = await AsyncStorage.getItem(`saved_tips_${userId}`);
      return local ? JSON.parse(local) : {};
    } catch (localError) {
      console.error('Error getting local saved tips:', localError);
      return {};
    }
  }
}

export async function setSavedTips(userId, tips) {
  await AsyncStorage.setItem(`saved_tips_${userId}`, JSON.stringify(tips));
  if (userId) {
    const tipsDoc = doc(db, 'saved_tips', userId);
    await setDoc(tipsDoc, { tips }); // Overwrite tips object, remove deleted keys
  }
}

// Remove individual quiz
export async function removeSavedQuiz(userId, quizKey) {
  try {
    console.log('Removing quiz with key:', quizKey);
    const currentQuizzes = await getSavedQuizzes(userId);
    delete currentQuizzes[quizKey];
    await setSavedQuizzes(userId, currentQuizzes);
    console.log('Quiz removed successfully');
  } catch (error) {
    console.error('Error removing quiz:', error);
    throw error;
  }
}

// Remove individual tip
export async function removeSavedTip(userId, tipKey) {
  try {
    console.log('Removing tip with key:', tipKey);
    const currentTips = await getSavedTips(userId);
    delete currentTips[tipKey];
    await setSavedTips(userId, currentTips);
    console.log('Tip removed successfully');
  } catch (error) {
    console.error('Error removing tip:', error);
    throw error;
  }
}
