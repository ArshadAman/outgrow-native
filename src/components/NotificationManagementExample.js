import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useQuiz } from '../context/QuizContext';
import { 
  getNextNotificationsInfo,
  scheduleAllNotificationSlots,
  sendTestNotification
} from '../utils/notificationUtils';

/**
 * Example component showing how to use the 5-slot notification system
 * This can be used in any UI component to manage notifications
 */
export default function NotificationManagementExample() {
  const { 
    notificationsEnabled, 
    toggleNotifications
  } = useQuiz();
  
  const [nextNotificationInfo, setNextNotificationInfo] = useState('Loading...');

  // Load notification status on component mount
  useEffect(() => {
    loadNotificationStatus();
  }, [notificationsEnabled]);

  const loadNotificationStatus = async () => {
    try {
      if (notificationsEnabled) {
        const info = await getNextNotificationsInfo();
        setNextNotificationInfo(info);
      } else {
        setNextNotificationInfo('Notifications disabled');
      }
    } catch (error) {
      console.error('Error loading notification status:', error);
      setNextNotificationInfo('Error loading status');
    }
  };

  // Handle enable/disable notifications
  const handleToggleNotifications = async () => {
    try {
      const success = await toggleNotifications(!notificationsEnabled);
      if (success) {
        await loadNotificationStatus();
        Alert.alert(
          'Success',
          notificationsEnabled 
            ? 'Notifications disabled successfully' 
            : 'Notifications enabled successfully'
        );
      } else {
        Alert.alert('Error', 'Failed to toggle notifications');
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Failed to toggle notifications');
    }
  };

  // Handle manual reschedule
  const handleRescheduleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        Alert.alert('Info', 'Please enable notifications first');
        return;
      }

      const notificationIds = await scheduleAllNotificationSlots();
      if (notificationIds.length > 0) {
        await loadNotificationStatus();
        Alert.alert('Success', `Rescheduled ${notificationIds.length} notification slots!`);
      } else {
        Alert.alert('Error', 'Failed to reschedule notifications');
      }
    } catch (error) {
      console.error('Error rescheduling notifications:', error);
      Alert.alert('Error', 'Failed to reschedule notifications');
    }
  };

  // Handle test notification
  const handleSendTestNotification = async () => {
    try {
      const success = await sendTestNotification();
      if (success) {
        Alert.alert('Test Sent!', 'Check your notifications in a few seconds.');
      } else {
        Alert.alert('Error', 'Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 10, margin: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        📱 5-Slot Quiz Notifications
      </Text>
      
      {/* Current Status */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
          Status: {notificationsEnabled ? '✅ Enabled' : '❌ Disabled'}
        </Text>
        <Text style={{ fontSize: 14, color: '#666' }}>
          {nextNotificationInfo}
        </Text>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        <TouchableOpacity
          style={{
            backgroundColor: notificationsEnabled ? '#dc3545' : '#28a745',
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: 'center'
          }}
          onPress={handleToggleNotifications}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {notificationsEnabled ? 'Disable' : 'Enable'}
          </Text>
        </TouchableOpacity>

        {notificationsEnabled && (
          <TouchableOpacity
            style={{
              backgroundColor: '#007bff',
              padding: 10,
              borderRadius: 5,
              flex: 1,
              alignItems: 'center'
            }}
            onPress={handleRescheduleNotifications}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Reschedule All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Test Notification Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#6c757d',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
          marginBottom: 10
        }}
        onPress={handleSendTestNotification}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Send Test Notification
        </Text>
      </TouchableOpacity>

      {/* Info */}
      <Text style={{ 
        fontSize: 12, 
        color: '#888', 
        fontStyle: 'italic' 
      }}>
        💡 This demonstrates 5-slot notification scheduling. 
        Users can customize 5 daily notification times with individual toggle control. 
        Each notification gets a random quiz subject!
      </Text>
    </View>
  );
}

/**
 * Example of how to handle notification events in a component
 * This would typically be used in a screen that receives notification navigation
 */
export function NotificationEventHandlerExample({ route, navigation }) {
  useEffect(() => {
    // Check if this screen was opened from a notification
    if (route?.params?.notificationData) {
      const { type, subject } = route.params.notificationData;
      
      // If it was a daily quiz notification, show feedback
      if (type === 'daily_quiz') {
        console.log(`Quiz notification received for subject: ${subject}`);
        
        Alert.alert(
          'Quiz Time! 🎓',
          `Ready for your ${subject} quiz? The next notification will be scheduled automatically.`,
          [{ text: 'Let\'s Go!' }]
        );
      }
    }
  }, [route?.params?.notificationData]);

  // This component would render your quiz or other content
  return (
    <View>
      <Text>Quiz content here...</Text>
    </View>
  );
}