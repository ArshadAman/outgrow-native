import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useQuiz } from '../context/QuizContext';
import {
  loadNotificationSlots,
  updateNotificationSlot,
  scheduleAllNotificationSlots,
  sendTestNotification
} from '../utils/notificationUtils';

export default function NotificationSettingsScreen({ navigation }) {
  const { notificationsEnabled, toggleNotifications } = useQuiz();
  const [notificationSlots, setNotificationSlots] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const slots = await loadNotificationSlots();
      setNotificationSlots(slots);
    } catch (error) {
      console.error('Error loading notification slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotToggle = async (slotId, enabled) => {
    try {
      const updatedSlots = await updateNotificationSlot(slotId, { enabled });
      if (updatedSlots) {
        setNotificationSlots(updatedSlots);
      }
    } catch (error) {
      console.error('Error updating slot:', error);
      Alert.alert('Error', 'Failed to update notification slot');
    }
  };

  const handleTimeChange = async (slotId, selectedTime) => {
    try {
      if (selectedTime) {
        const hour = selectedTime.getHours();
        const minute = selectedTime.getMinutes();
        
        const updatedSlots = await updateNotificationSlot(slotId, { hour, minute });
        if (updatedSlots) {
          setNotificationSlots(updatedSlots);
        }
      }
    } catch (error) {
      console.error('Error updating time:', error);
      Alert.alert('Error', 'Failed to update notification time');
    } finally {
      setShowTimePicker(null);
    }
  };

  const formatTime = (hour, minute) => {
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleTestNotification = async () => {
    try {
      const success = await sendTestNotification();
      if (success) {
        Alert.alert(
          'Test Notification Sent! 🔔',
          'Check your notifications - a test quiz should appear immediately!'
        );
      } else {
        Alert.alert('Error', 'Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const rescheduleAll = async () => {
    try {
      Alert.alert(
        'Reschedule Notifications',
        'This will reschedule all notifications with new random subjects. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reschedule',
            onPress: async () => {
              await scheduleAllNotificationSlots();
              Alert.alert('Success', 'All notifications rescheduled with new subjects!');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error rescheduling notifications:', error);
      Alert.alert('Error', 'Failed to reschedule notifications');
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#111618] justify-center items-center">
        <ActivityIndicator size="large" color="#0cb9f2" />
        <Text className="text-white text-lg mt-4">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-[#232D3F]">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#0cb9f2" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Notification Settings</Text>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {/* Master Toggle */}
        <View className="bg-[#181F2A] rounded-2xl p-5 mb-6 border border-[#232D3F]">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-lg font-bold">Quiz Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#3b4e54", true: "#0cb9f2" }}
              thumbColor="#fff"
            />
          </View>
          <Text className="text-[#a2afb3] text-sm mb-4">
            {notificationsEnabled 
              ? 'Receive daily quiz reminders at your scheduled times'
              : 'Enable to receive quiz reminders'
            }
          </Text>
          
          {notificationsEnabled && (
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleTestNotification}
                className="flex-1 bg-[#0cb9f2] py-3 px-4 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-semibold">Test Notification</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={rescheduleAll}
                className="flex-1 bg-[#232D3F] py-3 px-4 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-semibold">Reschedule All</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Notification Slots */}
        {notificationsEnabled && (
          <View className="bg-[#181F2A] rounded-2xl p-5 border border-[#232D3F]">
            <Text className="text-white text-lg font-bold mb-4">Notification Schedule</Text>
            <Text className="text-[#a2afb3] text-sm mb-4">
              Customize your 5 daily notification slots. Each notification will have a random quiz subject.
            </Text>

            {notificationSlots.map((slot, index) => (
              <View 
                key={slot.id}
                className={`flex-row justify-between items-center py-4 ${
                  index < notificationSlots.length - 1 ? 'border-b border-[#232D3F]' : ''
                }`}
              >
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold">
                    Slot {slot.id}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(slot.id)}
                    disabled={!slot.enabled}
                    className="mt-1"
                  >
                    <Text className={`text-lg font-bold ${
                      slot.enabled ? 'text-[#0cb9f2]' : 'text-[#3b4e54]'
                    }`}>
                      {formatTime(slot.hour, slot.minute)}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Switch
                  value={slot.enabled}
                  onValueChange={(enabled) => handleSlotToggle(slot.id, enabled)}
                  trackColor={{ false: "#3b4e54", true: "#0cb9f2" }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
        )}

        {/* Info Section */}
        <View className="bg-[#232D3F] rounded-2xl p-5 mt-6 mb-10">
          <View className="flex-row items-center mb-3">
            <Ionicons name="information-circle" size={20} color="#0cb9f2" />
            <Text className="text-white text-base font-semibold ml-2">How it works</Text>
          </View>
          <Text className="text-[#a2afb3] text-sm leading-6">
            • Set up to 5 notification times per day{'\n'}
            • Each notification will have a random quiz subject{'\n'}
            • Tap on a time to change it{'\n'}
            • Toggle individual slots on/off{'\n'}
            • Notifications will repeat daily at your set times
          </Text>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={(() => {
            const slot = notificationSlots.find(s => s.id === showTimePicker);
            const date = new Date();
            date.setHours(slot.hour, slot.minute);
            return date;
          })()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            if (Platform.OS === 'android') {
              if (event.type === 'set') {
                handleTimeChange(showTimePicker, selectedTime);
              } else {
                setShowTimePicker(null);
              }
            } else {
              handleTimeChange(showTimePicker, selectedTime);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
