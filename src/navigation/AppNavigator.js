import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import TechDetailScreen from '../screens/TechDetailScreen';
import TipDetailScreen from '../screens/TipDetailScreen';
import SavedQuizzesDetail from '../screens/SavedQuizzesDetail';
import { Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator(); // For handling screens shared across stacks

// Stack for Quiz flow 
function QuizStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="QuizMain" component={QuizScreen} />
      {/* We could add QuizResultScreen here later */}
    </Stack.Navigator>
  );
}

// Stack for Tips flow
function TipsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TipsMain" component={TipScreen} />
      {/* TechDetailScreen and TipDetailScreen moved to the root navigator */}
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1e2324', borderTopColor: '#2c3335', paddingBottom: 8, paddingTop: 4, height: 60 },
        tabBarActiveTintColor: '#0cb9f2',
        tabBarInactiveTintColor: '#a2afb3',
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name={focused ? 'lightbulb-on' : 'lightbulb-on-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 name={focused ? 'bookmark' : 'bookmark'} solid={focused} size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// This is the Main App Flow that combines auth screens with the tabs
function AppFlow() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  // Navigation ref and notification handler moved to App.js

  // This is the root navigator that can access ALL screens, including ones that need to be accessed across tabs
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="App">
      <RootStack.Screen name="App" component={AppFlow} />
      {/* These screens can be accessed from any tab */}
      <RootStack.Screen name="TechDetailScreen" component={TechDetailScreen} />
      <RootStack.Screen name="TipDetailScreen" component={TipDetailScreen} />
      <RootStack.Screen name="SavedQuizzesDetail" component={SavedQuizzesDetail} />
    </RootStack.Navigator>
  );
}
