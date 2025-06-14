import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screen/HomeScreen';
import QuizScreen from '../screen/QuizScreen';
import TipScreen from '../screen/TipScreen';
import SavedScreen from '../screen/SavedScreen';
import ProfileScreen from '../screen/ProfileScreen';
import LoginScreen from '../screen/LoginScreen';
import SignupScreen from '../screen/SignupScreen';
import TechDetailScreen from '../screen/TechDetailScreen';
import TipDetailScreen from '../screen/TipDetailScreen';
import { Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack for Quiz flow 
function QuizStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuizMain" component={QuizScreen} />
      {/* We could add QuizResultScreen here later */}
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="TechDetailScreen" component={TechDetailScreen} />
      <Stack.Screen name="TipDetailScreen" component={TipDetailScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1e2324', borderTopColor: '#2c3335', paddingBottom: 8, paddingTop: 4, height: 60 },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#a2afb3',
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🏠</Text> }} />
      <Tab.Screen name="Quiz" component={QuizStack} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>❓</Text> }} />
      <Tab.Screen name="Tips" component={TipScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>💡</Text> }} />
      <Tab.Screen name="Saved" component={SavedScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🔖</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const navigationRef = useRef();

  useEffect(() => {
    // Handle notification responses (when user taps notification)
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.notification.request.content.data.screen === 'QuizScreen') {
        // Check if user is logged in
        AsyncStorage.getItem('user_token').then(token => {
          if (token) {
            navigationRef.current?.navigate('MainTabs', {
              screen: 'Quiz'
            });
          } else {
            navigationRef.current?.navigate('LoginScreen');
          }
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      ref={navigationRef}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
