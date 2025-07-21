// useDailyFeed.js
// React hook for daily personalized content
import { useState, useEffect, useCallback } from 'react';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../auth/AuthContext';
import { fetchGeminiTip, fetchGeminiQuiz, fetchGeminiChallenge, fetchGeminiResource } from '../services/GeminiService';
import moment from 'moment-timezone';
import { updateUserXP, updateUserStreak } from '../services/XPService';

const FEED_TYPES = ['tip', 'quiz', 'challenge', 'resource'];

export default function useDailyFeed() {
  const { user } = useAuth();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateStr, setDateStr] = useState('');

  // Get today's date in user's timezone
  useEffect(() => {
    const today = moment().tz(moment.tz.guess()).format('YYYY-MM-DD');
    setDateStr(today);
  }, []);

  // Fetch or generate daily feed
  const fetchFeed = useCallback(async () => {
    if (!user?.uid || !dateStr) return;
    setLoading(true);
    setError(null);
    try {
      const db = getFirestore();
      const feedRef = doc(db, `users/${user.uid}/dailyFeed/${dateStr}`);
      const feedSnap = await getDoc(feedRef);
      if (feedSnap.exists()) {
        setFeed(feedSnap.data().items || []);
      } else {
        // Fetch user's tech stack
        const userRef = doc(db, `users/${user.uid}`);
        const userSnap = await getDoc(userRef);
        const techStack = userSnap.data()?.techStack || [];
        // Generate feed items using Gemini
        const items = await Promise.all([
          fetchGeminiQuiz(techStack),
          fetchGeminiChallenge(techStack),
          fetchGeminiResource(techStack)
        ]);
        // Format feed
        const formatted = items.map((item, idx) => ({
          type: FEED_TYPES[idx + 1], // skip 'tip'
          ...item,
          xp: item.xp || 10,
          completed: false
        }));
        await setDoc(feedRef, { items: formatted, createdAt: serverTimestamp() });
        setFeed(formatted);
      }
    } catch (err) {
      console.error('[useDailyFeed] Error fetching or generating feed:', err);
      if (err && err.message) {
        setError(err.message);
      } else {
        setError(JSON.stringify(err));
      }
    } finally {
      setLoading(false);
    }
  }, [user, dateStr]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Mark item complete and grant XP
  const completeItem = async (idx) => {
    if (!user?.uid || !feed[idx] || feed[idx].completed) return;
    const db = getFirestore();
    const feedRef = doc(db, `users/${user.uid}/dailyFeed/${dateStr}`);
    // Get current xpEarned from Firestore
    let xpEarned = 0;
    try {
      const feedSnap = await getDoc(feedRef);
      if (feedSnap.exists()) {
        xpEarned = feedSnap.data().xpEarned || 0;
      }
    } catch (e) {
      // ignore, default to 0
    }
    const updatedFeed = [...feed];
    updatedFeed[idx].completed = true;
    setFeed(updatedFeed);
    const itemXP = updatedFeed[idx].xp || 0;
    const newXpEarned = xpEarned + itemXP;
    await setDoc(feedRef, { items: updatedFeed, xpEarned: newXpEarned }, { merge: true });
    await updateUserXP(user.uid, itemXP);
    await updateUserStreak(user.uid);
    // Update totalXpEarned and XP breakdowns in user profile for leaderboard
    try {
      const userRef = doc(db, `users/${user.uid}`);
      const userSnap = await getDoc(userRef);
      let totalXpEarned = 0;
      let xpByWeek = {};
      let xpByMonth = {};
      let xpByYear = {};
      let college = '';
      let branch = '';
      if (userSnap.exists()) {
        const data = userSnap.data();
        totalXpEarned = data.totalXpEarned || 0;
        xpByWeek = data.xpByWeek || {};
        xpByMonth = data.xpByMonth || {};
        xpByYear = data.xpByYear || {};
        college = data.college || '';
        branch = data.branch || '';
      }
      // Get current week, month, year keys
      const now = moment();
      const weekKey = now.format('GGGG-[W]WW'); // ISO week, e.g. 2025-W30
      const monthKey = now.format('YYYY-MM');   // e.g. 2025-07
      const yearKey = now.format('YYYY');       // e.g. 2025
      xpByWeek[weekKey] = (xpByWeek[weekKey] || 0) + itemXP;
      xpByMonth[monthKey] = (xpByMonth[monthKey] || 0) + itemXP;
      xpByYear[yearKey] = (xpByYear[yearKey] || 0) + itemXP;
      // Optionally, college and branch can be set elsewhere (e.g., during signup)
      await setDoc(userRef, {
        totalXpEarned: totalXpEarned + itemXP,
        xpByWeek,
        xpByMonth,
        xpByYear,
        college,
        branch
      }, { merge: true });
    } catch (e) {
      // ignore errors for now
    }
  };

  return { feed, loading, error, completeItem, dateStr };
}
