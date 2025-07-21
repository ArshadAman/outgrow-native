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
    const updatedFeed = [...feed];
    updatedFeed[idx].completed = true;
    setFeed(updatedFeed);
    await setDoc(feedRef, { items: updatedFeed });
    await updateUserXP(user.uid, updatedFeed[idx].xp);
    await updateUserStreak(user.uid);
  };

  return { feed, loading, error, completeItem, dateStr };
}
