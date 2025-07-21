import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../services/FirebaseService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import * as Google from 'expo-auth-session/providers/google';

// Sign out user (for use in signup/login flows)
export const signOutUser = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'user_data']);
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
};
// Email/password signup
export const signUp = async (email, password, displayName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Save user profile in Firestore
    const profile = {
      email: user.email,
      displayName: displayName || user.email,
      joinDate: new Date().toISOString(),
      avatar: user.photoURL || '',
      uid: user.uid,
    };
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    await AsyncStorage.setItem('user_data', JSON.stringify(profile));
    return profile;
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
    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let profile;
    if (userDoc.exists() && userDoc.data()) {
      profile = { ...userDoc.data(), email: user.email, uid: user.uid, avatar: user.photoURL || userDoc.data().avatar || '' };
    } else {
      // Create profile if doesn't exist
      profile = {
        email: user.email,
        displayName: user.displayName || user.email,
        joinDate: new Date().toISOString(),
        avatar: user.photoURL || '',
        uid: user.uid,
      };
      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    }
    await AsyncStorage.setItem('user_data', JSON.stringify(profile));
    return profile;
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
    const profile = {
      email: user.email,
      displayName: user.displayName || user.email,
      joinDate: new Date().toISOString(),
      avatar: user.photoURL || '',
      uid: user.uid,
    };
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    await AsyncStorage.setItem('user_data', JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Deprecated: register function (use signUp instead)

/**
 * Fetch user profile from Firestore by UID
 * @param {string} uid - User UID
 * @returns {Promise<object|null>} - User profile object or null
 */
export const getUserProfile = async (uid) => {
  try {
    console.log('Fetching user profile for UID:', uid);
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists() && userDoc.data()) {
      const data = userDoc.data();
      console.log('User profile data from Firestore:', data);
      // Ensure UID is present in returned object
      return { ...data, uid };
    } else {
      console.warn('User profile not found for UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Fetch user profile error:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} - True if authenticated
 */
export const isAuthenticated = async () => {
  try {
    const userData = await AsyncStorage.getItem('user_data');
    return !!userData;
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
