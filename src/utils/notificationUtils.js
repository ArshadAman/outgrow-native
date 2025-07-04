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