import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../services/FirebaseService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';

// Email/password signup
export const signUp = async (email, password, displayName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Save user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName || user.email,
      joinDate: new Date().toISOString(),
      avatar: user.photoURL || '',
    }, { merge: true });
    return user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Email/password login
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Optionally fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return { ...user, ...userDoc.data() };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Google login (Expo)
export const loginWithGoogle = async (idToken, accessToken) => {
  try {
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;
    // Save user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName || user.email,
      joinDate: new Date().toISOString(),
      avatar: user.photoURL || '',
    }, { merge: true });
    return user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Deprecated: register function (use signUp instead)

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} - True if authenticated
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

/**
 * Log out the user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Remove auth-related items
    await AsyncStorage.multiRemove(['token', 'user_data']);
    // Keep quiz history and other non-auth data
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, we should consider the user logged out
    return true;
  }
};
