// useLeaderboard.js
// React hook for LeaderboardService integration
import { useState, useEffect } from 'react';
import LeaderboardService from '../services/LeaderboardService';

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const data = await LeaderboardService.getLeaderboard();
      setLeaderboard(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const updateUserXP = async (userId, xp) => {
    await LeaderboardService.updateUserXP(userId, xp);
    // Optionally refresh leaderboard
  };

  return { leaderboard, loading, updateUserXP };
}
