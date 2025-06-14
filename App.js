import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import './global.css';
import AppHeader from './components/AppHeader';
import AppNavigator from './navigation/AppNavigator';
import { QuizProvider } from './utils/QuizContext';
import * as Notifications from 'expo-notifications';

export default function App() {
  // Register notification handler
  useEffect(() => {
    // Set up notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  return (
    <QuizProvider>
      <NavigationContainer>
        <AppHeader />
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </QuizProvider>
  );
}
