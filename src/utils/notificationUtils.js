/**
 * Notification utility functions for timezone-aware scheduling
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// Default notification times (in 24-hour format)
export const DEFAULT_NOTIFICATION_TIMES = [
  { hour: 8, minute: 30, enabled: true, id: 'morning' },      // 8:30 AM
  { hour: 12, minute: 0, enabled: true, id: 'noon' },        // 12:00 PM
  { hour: 15, minute: 30, enabled: true, id: 'afternoon' },  // 3:30 PM
  { hour: 18, minute: 0, enabled: true, id: 'evening' },     // 6:00 PM
  { hour: 21, minute: 0, enabled: true, id: 'night' }        // 9:00 PM
];

// Storage key for notification preferences
export const NOTIFICATION_TIMES_KEY = 'notification_times';

/**
 * Get the next occurrence of a specific time today or tomorrow
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {Date} Next occurrence of the specified time
 */
export function getNextScheduleTime(hour, minute) {
  const now = new Date();
  const scheduleTime = new Date();
  
  scheduleTime.setHours(hour, minute, 0, 0);
  
  // If the time has already passed today, schedule for tomorrow
  if (scheduleTime <= now) {
    scheduleTime.setDate(scheduleTime.getDate() + 1);
  }
  
  return scheduleTime;
}

/**
 * Calculate seconds until a specific date/time
 * @param {Date} targetDate - Target date/time
 * @returns {number} Seconds until target time
 */
export function getSecondsUntil(targetDate) {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / 1000));
}

/**
 * Format time for display (e.g., "8:30 AM")
 * @param {number} hour - Hour in 24-hour format
 * @param {number} minute - Minute
 * @returns {string} Formatted time string
 */
export function formatTimeDisplay(hour, minute) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, '0');
  
  return `${displayHour}:${displayMinute} ${period}`;
}

/**
 * Save notification times to AsyncStorage
 * @param {Array} notificationTimes - Array of notification time objects
 */
export async function saveNotificationTimes(notificationTimes) {
  try {
    await AsyncStorage.setItem(NOTIFICATION_TIMES_KEY, JSON.stringify(notificationTimes));
    console.log('Notification times saved:', notificationTimes);
  } catch (error) {
    console.error('Error saving notification times:', error);
    throw error;
  }
}

/**
 * Load notification times from AsyncStorage
 * @returns {Array} Array of notification time objects
 */
export async function loadNotificationTimes() {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_TIMES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded notification times:', parsed);
      return parsed;
    }
    
    // Return default times if none stored
    console.log('Using default notification times');
    return DEFAULT_NOTIFICATION_TIMES;
  } catch (error) {
    console.error('Error loading notification times:', error);
    return DEFAULT_NOTIFICATION_TIMES;
  }
}

/**
 * Validate if a notification time is valid
 * @param {Object} timeObj - Time object with hour and minute
 * @returns {boolean} True if valid
 */
export function isValidNotificationTime(timeObj) {
  if (!timeObj || typeof timeObj.hour !== 'number' || typeof timeObj.minute !== 'number') {
    return false;
  }
  
  return timeObj.hour >= 0 && timeObj.hour <= 23 && 
         timeObj.minute >= 0 && timeObj.minute <= 59;
}

/**
 * Get all scheduled notifications for debugging
 * @returns {Array} Array of scheduled notification objects
 */
export async function getScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Currently scheduled notifications:', notifications.length);
    notifications.forEach((notif, index) => {
      console.log(`${index + 1}. ID: ${notif.identifier}, Trigger:`, notif.trigger);
    });
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

/**
 * Calculate the next notification time for display
 * @param {Array} notificationTimes - Array of notification time objects
 * @returns {string} Formatted string of next notification time
 */
export function getNextNotificationInfo(notificationTimes) {
  const enabledTimes = notificationTimes.filter(time => time.enabled);
  
  if (enabledTimes.length === 0) {
    return 'No notifications scheduled';
  }
  
  const now = new Date();
  let nextTime = null;
  let nextTimeDisplay = '';
  
  for (const time of enabledTimes) {
    const scheduleTime = getNextScheduleTime(time.hour, time.minute);
    
    if (!nextTime || scheduleTime < nextTime) {
      nextTime = scheduleTime;
      nextTimeDisplay = formatTimeDisplay(time.hour, time.minute);
    }
  }
  
  if (nextTime) {
    const isToday = nextTime.toDateString() === now.toDateString();
    const dayText = isToday ? 'today' : 'tomorrow';
    return `Next: ${nextTimeDisplay} ${dayText}`;
  }
  
  return 'No notifications scheduled';
}

/**
 * Check if two notification times conflict (same time)
 * @param {Array} times - Array of notification time objects
 * @returns {boolean} True if there are conflicts
 */
export function hasTimeConflicts(times) {
  const enabledTimes = times.filter(time => time.enabled);
  
  for (let i = 0; i < enabledTimes.length; i++) {
    for (let j = i + 1; j < enabledTimes.length; j++) {
      if (enabledTimes[i].hour === enabledTimes[j].hour && 
          enabledTimes[i].minute === enabledTimes[j].minute) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Get the next occurrence of a specific time, ensuring it's always in the future
 * This is an alias for getNextScheduleTime but with clearer semantics
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {Date} Next occurrence of the specified time (always in future)
 */
export function getNextOccurrence(hour, minute) {
  return getNextScheduleTime(hour, minute);
}

/**
 * Cancel all scheduled notifications
 * @returns {Promise<boolean>} True if successful
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
 * Schedule the next daily notification for a specific time slot
 * Never uses repeats:true, always schedules for next valid future occurrence
 * @param {Object} timeSlot - Time slot object with hour, minute, enabled, id
 * @param {Object} notificationContent - Notification content object
 * @returns {Promise<string|null>} Notification ID if successful, null if failed
 */
export async function scheduleNextDailyNotification(timeSlot, notificationContent) {
  try {
    if (!timeSlot.enabled || !isValidNotificationTime(timeSlot)) {
      console.log(`Skipping disabled or invalid time slot: ${timeSlot.id}`);
      return null;
    }

    // Get the next valid future occurrence
    const nextOccurrence = getNextOccurrence(timeSlot.hour, timeSlot.minute);
    const secondsUntil = getSecondsUntil(nextOccurrence);
    
    // Ensure we're not scheduling for immediate execution (unless it's really 'now')
    if (secondsUntil < 60) {
      console.log(`Time slot ${timeSlot.id} is too close (${secondsUntil}s), scheduling for tomorrow`);
      nextOccurrence.setDate(nextOccurrence.getDate() + 1);
      const newSecondsUntil = getSecondsUntil(nextOccurrence);
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          ...notificationContent,
          data: {
            ...notificationContent.data,
            timeSlot: timeSlot.id,
            scheduledFor: nextOccurrence.toISOString()
          }
        },
        trigger: {
          seconds: newSecondsUntil,
          repeats: false // Never use repeats for daily notifications
        },
      });
      
      const timeDisplay = formatTimeDisplay(timeSlot.hour, timeSlot.minute);
      const scheduleDate = nextOccurrence.toLocaleDateString();
      console.log(`✅ Scheduled notification for ${timeSlot.id} at ${timeDisplay} on ${scheduleDate} (in ${newSecondsUntil} seconds)`);
      
      return notificationId;
    }

    // Schedule for the calculated time
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        ...notificationContent,
        data: {
          ...notificationContent.data,
          timeSlot: timeSlot.id,
          scheduledFor: nextOccurrence.toISOString()
        }
      },
      trigger: {
        seconds: secondsUntil,
        repeats: false // Never use repeats for daily notifications
      },
    });
    
    const timeDisplay = formatTimeDisplay(timeSlot.hour, timeSlot.minute);
    const scheduleDate = nextOccurrence.toLocaleDateString();
    console.log(`✅ Scheduled notification for ${timeSlot.id} at ${timeDisplay} on ${scheduleDate} (in ${secondsUntil} seconds)`);
    
    return notificationId;
    
  } catch (error) {
    console.error(`❌ Error scheduling notification for ${timeSlot.id}:`, error);
    return null;
  }
}

/**
 * Schedule all enabled daily notifications, cancelling any existing ones first
 * @param {Array} notificationTimes - Array of notification time objects
 * @param {Function} getNotificationContent - Function that returns notification content for a time slot
 * @returns {Promise<number>} Number of notifications successfully scheduled
 */
export async function scheduleAllDailyNotifications(notificationTimes, getNotificationContent) {
  try {
    // Always cancel all existing notifications first
    await cancelAllScheduledNotifications();
    
    const enabledTimes = notificationTimes.filter(time => time.enabled);
    let scheduledCount = 0;
    
    for (const timeSlot of enabledTimes) {
      const content = getNotificationContent(timeSlot);
      const notificationId = await scheduleNextDailyNotification(timeSlot, content);
      
      if (notificationId) {
        scheduledCount++;
      }
    }
    
    console.log(`📅 Successfully scheduled ${scheduledCount} daily notifications`);
    return scheduledCount;
    
  } catch (error) {
    console.error('❌ Error scheduling daily notifications:', error);
    return 0;
  }
}