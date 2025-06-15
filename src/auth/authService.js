import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, getUserProfile } from '../api/authApi';

/**
 * Handle user login
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<Object>} - User data
 */
export const login = async (username, password) => {
  try {
    // Call the API
    const userData = await loginUser(username, password);
    
    // Store auth token and user data
    if (userData.token) {
      await AsyncStorage.setItem('token', userData.token);
    } else {
      // For demo purposes, create a mock token if none exists
      await AsyncStorage.setItem('token', `mock-token-${Date.now()}`);
    }
    
    await AsyncStorage.setItem('user_data', JSON.stringify({
      username: userData.username || username,
      email: userData.email || 'user@example.com',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      avatar: userData.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(username) + '&background=0D8ABC&color=fff'
    }));
    
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Handle user registration
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Registered user data
 */
export const register = async (userData) => {
  try {
    // Call the API
    const result = await registerUser(userData);
    
    // For demo purposes, we don't need to store any token on registration
    // as users should log in afterwards
    
    return result;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

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
