/**
 * Notification utility functions for slot-based scheduling
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// List of quiz subjects
export const QUIZ_SUBJECTS = [
  'Computer Networks',
  'Database Systems',
  'Object-Oriented Programming',
  'C/C++ Programming',
  'Operating Systems',
  'Data Structures and Algorithms'
];

export const NOTIFICATION_SLOTS_KEY = 'notification_time_slots';

// Default 5 notification slots
export const DEFAULT_NOTIFICATION_SLOTS = [
  { id: 1, hour: 8, minute: 0, enabled: true, subject: null },
  { id: 2, hour: 12, minute: 30, enabled: true, subject: null },
  { id: 3, hour: 16, minute: 0, enabled: true, subject: null },
  { id: 4, hour: 19, minute: 0, enabled: true, subject: null },
  { id: 5, hour: 21, minute: 30, enabled: true, subject: null }
];

/**
 * Get a random subject from the list
 */
export function getRandomSubject() {
  const idx = Math.floor(Math.random() * QUIZ_SUBJECTS.length);
  return QUIZ_SUBJECTS[idx];
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllScheduledNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ All scheduled notifications cancelled');
    return true;
  } catch (error) {
    console.error('❌ Error cancelling notifications:', error);
    return false;
  }
}

/**
 * Load notification slots from storage
 */
export async function loadNotificationSlots() {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_SLOTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_NOTIFICATION_SLOTS;
  } catch (error) {
    console.error('Error loading notification slots:', error);
    return DEFAULT_NOTIFICATION_SLOTS;
  }
}

/**
 * Save notification slots to storage
 */
export async function saveNotificationSlots(slots) {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SLOTS_KEY, JSON.stringify(slots));
    return true;
  } catch (error) {
    console.error('Error saving notification slots:', error);
    return false;
  }
}

/**
 * Schedule notifications for all enabled slots
 */
export async function scheduleAllNotificationSlots() {
  try {
    await cancelAllScheduledNotifications();
    
    const slots = await loadNotificationSlots();
    const enabledSlots = slots.filter(slot => slot.enabled);
    
    if (enabledSlots.length === 0) {
      console.log('No enabled notification slots found');
      return [];
    }

    const notificationIds = [];
    
    for (const slot of enabledSlots) {
      const subject = getRandomSubject();
      const notificationId = await scheduleNotificationForSlot(slot, subject);
      if (notificationId) {
        notificationIds.push(notificationId);
      }
    }
    
    console.log(`📅 Scheduled ${notificationIds.length} notifications for enabled slots`);
    await getScheduledNotifications();
    return notificationIds;
  } catch (error) {
    console.error('❌ Error scheduling notification slots:', error);
    return [];
  }
}

/**
 * Schedule a notification for a specific slot
 */
async function scheduleNotificationForSlot(slot, subject) {
  try {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(slot.hour, slot.minute, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Quiz Time: ${subject}!`,
        body: `Ready for your ${subject} quiz? Tap to start.`,
        data: { 
          subject,
          type: 'daily_quiz',
          slotId: slot.id,
          screen: 'QuizScreen'
        }
      },
      trigger: scheduledTime
    });

    console.log(`📅 Scheduled notification for slot ${slot.id} at ${scheduledTime.toLocaleString()} - ${subject}`);
    return notificationId;
  } catch (error) {
    console.error(`❌ Error scheduling notification for slot ${slot.id}:`, error);
    return null;
  }
}

/**
 * Update a specific notification slot
 */
export async function updateNotificationSlot(slotId, updates) {
  try {
    const slots = await loadNotificationSlots();
    const updatedSlots = slots.map(slot => 
      slot.id === slotId ? { ...slot, ...updates } : slot
    );
    
    await saveNotificationSlots(updatedSlots);
    
    // Reschedule all notifications if any slot was updated
    await scheduleAllNotificationSlots();
    
    return updatedSlots;
  } catch (error) {
    console.error('Error updating notification slot:', error);
    return null;
  }
}

/**
 * Get information about next notifications
 */
export async function getNextNotificationsInfo() {
  try {
    const slots = await loadNotificationSlots();
    const enabledSlots = slots.filter(slot => slot.enabled);
    
    if (enabledSlots.length === 0) {
      return 'No notification slots enabled';
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find next notification today or tomorrow
    let nextSlot = null;
    let isToday = true;
    
    for (const slot of enabledSlots) {
      const slotTime = new Date(today);
      slotTime.setHours(slot.hour, slot.minute, 0, 0);
      
      if (slotTime > now) {
        nextSlot = { ...slot, time: slotTime };
        break;
      }
    }
    
    // If no slot found today, get first slot for tomorrow
    if (!nextSlot && enabledSlots.length > 0) {
      const firstSlot = enabledSlots[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(firstSlot.hour, firstSlot.minute, 0, 0);
      
      nextSlot = { ...firstSlot, time: tomorrow };
      isToday = false;
    }
    
    if (nextSlot) {
      const timeString = nextSlot.time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      const dayString = isToday ? 'today' : 'tomorrow';
      return `Next: ${timeString} ${dayString} (${enabledSlots.length} slots active)`;
    }
    
    return `${enabledSlots.length} notification slots active`;
  } catch (error) {
    console.error('Error getting next notifications info:', error);
    return 'Error loading notification info';
  }
}

/**
 * Send a test notification immediately
 */
export async function sendTestNotification() {
  try {
    const subject = getRandomSubject();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Test: ${subject} Quiz! 🔔`,
        body: 'This is a test notification. Tap to start the quiz!',
        data: { 
          subject,
          type: 'test_quiz',
          screen: 'QuizScreen'
        }
      },
      trigger: { seconds: 1 }
    });
    
    console.log('� Test notification sent');
    return true;
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    return false;
  }
}

/**
 * Debug: Get all scheduled notifications
 */
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📋 Found ${notifications.length} scheduled notifications:`);
    notifications.forEach((notif, index) => {
      console.log(`${index + 1}. ID: ${notif.identifier}, Trigger: ${JSON.stringify(notif.trigger)}`);
    });
    return notifications;
  } catch (error) {
    console.error('❌ Error getting scheduled notifications:', error);
    return [];
  }
}