import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './global.css';
import AppNavigator from './src/navigation/AppNavigator';
import { QuizProvider } from './src/context/QuizContext';
import * as Notifications from 'expo-notifications';

export default function App() {
  const navigationRef = React.useRef();

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

    // Handle notification responses (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const notificationData = response.notification.request.content.data;
      
      if (notificationData.screen === 'QuizScreen') {
        // Check if user is logged in
        AsyncStorage.getItem('token').then(token => {
          if (token) {
            navigationRef.current?.navigate('App', {
              screen: 'MainTabs',
              params: {
                screen: 'Quiz',
                params: {
                  autoStartSubject: notificationData.subject
                }
              }
            });
          } else {
            navigationRef.current?.navigate('App', {
              screen: 'LoginScreen'
            });
          }
        });
      }
    });
    
    return () => subscription.remove();
  }, []);

  return (
    <QuizProvider>
      <NavigationContainer ref={navigationRef}>
        {/* Using dark-content for black status bar text/icons on white background */}
        <StatusBar style="dark-content" backgroundColor="#ffffff" />
        <AppNavigator />
      </NavigationContainer>
    </QuizProvider>
  );
}
