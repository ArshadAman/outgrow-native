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
      console.log('Notification tapped, data:', notificationData);
      
      if (notificationData.screen === 'QuizScreen') {
        console.log('Notification data matches QuizScreen, checking login status...');
        // Check if user is logged in
        AsyncStorage.getItem('token').then(token => {
          console.log('Token status:', token ? 'Found' : 'Not found');
          if (token) {
            console.log('User logged in, navigating to Quiz with subject:', notificationData.subject);
            navigationRef.current?.navigate('App', {
              screen: 'MainTabs',
              params: {
                screen: 'Quiz',
                params: {
                  screen: 'QuizMain',
                  params: {
                    autoStartSubject: notificationData.subject
                  }
                }
              }
            });
          } else {
            console.log('User not logged in, navigating to LoginScreen');
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
