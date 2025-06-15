import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import './global.css';
import AppHeader from './src/components/AppHeader';
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
      if (response.notification.request.content.data.screen === 'QuizScreen') {
        // Check if user is logged in
        AsyncStorage.getItem('token').then(token => {
          if (token) {
            navigationRef.current?.navigate('App', {
              screen: 'MainTabs',
              params: {
                screen: 'Quiz'
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
        <AppHeader />
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </QuizProvider>
  );
}
