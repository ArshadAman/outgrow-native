// useDailyFeed.js
// React hook for daily personalized content
import { useState, useEffect } from 'react';

export function useDailyFeed() {
  const [feed, setFeed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch daily feed from GeminiService/Firebase
    setLoading(false);
  }, []);

  return { feed, loading };
}
