// AuthContext.js
// Provides user authentication context for the app
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAuthenticated } from './authService';

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if user is logged in and load user data
    const loadUser = async () => {
      setLoading(true);
      const authed = await isAuthenticated();
      if (authed) {
        const userData = await AsyncStorage.getItem('user_data');
        setUser(userData ? JSON.parse(userData) : null);
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
