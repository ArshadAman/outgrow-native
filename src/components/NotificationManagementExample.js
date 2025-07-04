import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useQuiz } from '../context/QuizContext';
import { 
  loadNotificationTimes, 
  getNextNotificationInfo,
  getScheduledNotifications 
} from '../utils/notificationUtils';

/**
 * Example component showing how to use the robust notification scheduling
 * This can be used in any UI component to manage notifications
 */
export default function NotificationManagementExample() {
  const { 
    notificationsEnabled, 
    toggleNotifications, 
    rescheduleNotifications 
  } = useQuiz();
  
  const [nextNotificationInfo, setNextNotificationInfo] = useState('Loading...');
  const [scheduledCount, setScheduledCount] = useState(0);

  // Load notification status on component mount
  useEffect(() => {
    loadNotificationStatus();
  }, [notificationsEnabled]);

  const loadNotificationStatus = async () => {
    try {
      const times = await loadNotificationTimes();
      const info = getNextNotificationInfo(times);
      setNextNotificationInfo(info);

      // Get count of currently scheduled notifications
      const scheduled = await getScheduledNotifications();
      setScheduledCount(scheduled.length);
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

  // Handle manual reschedule (example of rescheduling after notification fires)
  const handleRescheduleNotifications = async () => {
    try {
      if (!notificationsEnabled) {
        Alert.alert('Info', 'Please enable notifications first');
        return;
      }

      const success = await rescheduleNotifications();
      if (success) {
        await loadNotificationStatus();
        Alert.alert('Success', 'Notifications rescheduled successfully');
      } else {
        Alert.alert('Error', 'Failed to reschedule notifications');
      }
    } catch (error) {
      console.error('Error rescheduling notifications:', error);
      Alert.alert('Error', 'Failed to reschedule notifications');
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 10, margin: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        📱 Notification Management
      </Text>
      
      {/* Current Status */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
          Status: {notificationsEnabled ? '✅ Enabled' : '❌ Disabled'}
        </Text>
        <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
          Scheduled: {scheduledCount} notifications
        </Text>
        <Text style={{ fontSize: 14, color: '#666' }}>
          {nextNotificationInfo}
        </Text>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
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
              Reschedule
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info */}
      <Text style={{ 
        fontSize: 12, 
        color: '#888', 
        marginTop: 10, 
        fontStyle: 'italic' 
      }}>
        💡 This demonstrates robust daily notification scheduling. 
        Notifications are always scheduled for future times and automatically 
        reschedule after firing. Never uses repeats:true for reliability.
      </Text>
    </View>
  );
}

/**
 * Example of how to handle notification events in a component
 * This would typically be used in a screen that receives notification navigation
 */
export function NotificationEventHandlerExample({ route, navigation }) {
  const { rescheduleNotifications } = useQuiz();

  useEffect(() => {
    // Check if this screen was opened from a notification
    if (route?.params?.notificationData) {
      const { type, timeSlot } = route.params.notificationData;
      
      // If it was a daily quiz notification, the automatic rescheduling
      // is already handled in QuizContext, but you could add additional
      // UI feedback here
      
      if (type === 'daily_quiz') {
        console.log(`Quiz notification received for timeSlot: ${timeSlot}`);
        
        // Optional: Show a toast or update UI to indicate 
        // that the next notification has been automatically scheduled
        Alert.alert(
          'Quiz Time! 🎓',
          'Your next quiz notification has been automatically scheduled for tomorrow.',
          [{ text: 'Got it!' }]
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