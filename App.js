import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screen/HomeScreen';
import QuizScreen from './screen/QuizScreen';
import TipScreen from './screen/TipScreen';
import SavedScreen from './screen/SavedScreen';
import TechDetailScreen from './screen/TechDetailScreen';
import { Text } from 'react-native';
import './global.css';
import AppHeader from './components/AppHeader';

const Tab = createBottomTabNavigator();
function HomeStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="TechDetailScreen" component={TechDetailScreen} /> 
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AppHeader />
      <StatusBar style="dark" />
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
        <Tab.Screen name="Quiz" component={QuizScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>❓</Text> }} />
        <Tab.Screen name="Tips" component={TipScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>💡</Text> }} />
        <Tab.Screen name="Saved" component={SavedScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>🔖</Text> }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
