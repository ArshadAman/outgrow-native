import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQuiz } from '../context/QuizContext';
import {
  loadNotificationTimes,
  saveNotificationTimes,
  formatTimeDisplay,
  getNextNotificationInfo,
  hasTimeConflicts,
  DEFAULT_NOTIFICATION_TIMES
} from '../utils/notificationUtils';

export default function NotificationSettingsScreen({ navigation }) {
  const { notificationsEnabled, toggleNotifications, rescheduleNotifications } = useQuiz();
  const [notificationTimes, setNotificationTimes] = useState(DEFAULT_NOTIFICATION_TIMES);
  const [showTimePicker, setShowTimePicker] = useState(null);
  const [tempTime, setTempTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const times = await loadNotificationTimes();
      setNotificationTimes(times);
    } catch (error) {
      console.error('Error loading notification settings:', error);
      Alert.alert('Error', 'Failed to load notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(null);
    }
    
    if (selectedTime && showTimePicker !== null) {
      const newTimes = [...notificationTimes];
      newTimes[showTimePicker] = {
        ...newTimes[showTimePicker],
        hour: selectedTime.getHours(),
        minute: selectedTime.getMinutes()
      };
      
      setNotificationTimes(newTimes);
      setHasChanges(true);
      
      if (Platform.OS === 'ios') {
        // On iOS, we need to manually close the picker
        setShowTimePicker(null);
      }
    }
  };

  const toggleTimeSlot = (index) => {
    const newTimes = [...notificationTimes];
    newTimes[index] = {
      ...newTimes[index],
      enabled: !newTimes[index].enabled
    };
    
    setNotificationTimes(newTimes);
    setHasChanges(true);
  };

  const openTimePicker = (index) => {
    const time = notificationTimes[index];
    const date = new Date();
    date.setHours(time.hour, time.minute, 0, 0);
    setTempTime(date);
    setShowTimePicker(index);
  };

  const saveSettings = async () => {
    try {
      // Check for time conflicts
      if (hasTimeConflicts(notificationTimes)) {
        Alert.alert(
          'Time Conflict',
          'Multiple notifications are set for the same time. Please choose different times.',
          [{ text: 'OK' }]
        );
        return;
      }

      await saveNotificationTimes(notificationTimes);
      
      // If notifications are enabled, reschedule them with new times using robust method
      if (notificationsEnabled) {
        const success = await rescheduleNotifications();
        if (!success) {
          Alert.alert('Warning', 'Settings saved but failed to reschedule notifications. Please try toggling notifications off and on again.');
          return;
        }
      }
      
      setHasChanges(false);
      
      Alert.alert(
        'Settings Saved! ✅',
        'Your notification preferences have been updated.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save notification settings');
    }
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset to Defaults',
      'This will reset all notification times to their default values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setNotificationTimes(DEFAULT_NOTIFICATION_TIMES);
            setHasChanges(true);
          }
        }
      ]
    );
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. What would you like to do?',
        [
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
          { text: 'Save', onPress: saveSettings },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const getTimeSlotLabel = (id) => {
    const labels = {
      morning: 'Morning',
      noon: 'Noon',
      afternoon: 'Afternoon',
      evening: 'Evening',
      night: 'Night'
    };
    return labels[id] || 'Custom';
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#111618] justify-center items-center">
        <Text className="text-white text-lg">Loading settings...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-[#3b4e54]">
        <TouchableOpacity onPress={handleBack} className="flex-row items-center">
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text className="text-white text-lg font-semibold ml-2">Notification Settings</Text>
        </TouchableOpacity>
        
        {hasChanges && (
          <TouchableOpacity 
            onPress={saveSettings}
            className="bg-[#0cb9f2] px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1">
        {/* Master notification toggle */}
        <View className="p-4 border-b border-[#232D3F]">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">Quiz Notifications</Text>
              <Text className="text-[#a2afb3] text-sm mt-1">
                {getNextNotificationInfo(notificationTimes)}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#3b4e54", true: "#0cb9f2" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Notification times */}
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-semibold">Custom Times</Text>
            <TouchableOpacity onPress={resetToDefaults}>
              <Text className="text-[#0cb9f2] font-medium">Reset to Defaults</Text>
            </TouchableOpacity>
          </View>

          {notificationTimes.map((time, index) => (
            <View key={time.id} className="mb-4">
              <View className="flex-row items-center justify-between bg-[#232D3F] p-4 rounded-lg">
                <View className="flex-1">
                  <Text className="text-white font-medium">
                    {getTimeSlotLabel(time.id)}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => openTimePicker(index)}
                    className="mt-1"
                  >
                    <Text className="text-[#0cb9f2] text-lg font-bold">
                      {formatTimeDisplay(time.hour, time.minute)}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <Switch
                  value={time.enabled}
                  onValueChange={() => toggleTimeSlot(index)}
                  trackColor={{ false: "#3b4e54", true: "#0cb9f2" }}
                  thumbColor="#fff"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Information section */}
        <View className="p-4 mx-4 bg-[#232D3F] rounded-lg mb-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle-outline" size={20} color="#0cb9f2" />
            <Text className="text-[#0cb9f2] font-semibold ml-2">Tips</Text>
          </View>
          <Text className="text-[#a2afb3] text-sm leading-5">
            • Notifications will appear even when the app is closed{'\n'}
            • Times are based on your device's local timezone{'\n'}
            • Tap on a time to change it{'\n'}
            • Use the switches to enable/disable specific times{'\n'}
            • Master toggle controls all notifications
          </Text>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      {showTimePicker !== null && (
        <DateTimePicker
          value={tempTime}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
}