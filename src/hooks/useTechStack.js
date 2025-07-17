// useTechStack.js
// React hook for TechStackService integration
import { useState, useEffect } from 'react';
import TechStackService from '../services/TechStackService';

export function useTechStack(userId) {
  const [stack, setStack] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStack() {
      setLoading(true);
      const data = await TechStackService.getUserTechStack(userId);
      setStack(data);
      setLoading(false);
    }
    if (userId) fetchStack();
  }, [userId]);

  const addTech = async (tech) => {
    await TechStackService.addTechToStack(userId, tech);
    setStack([...stack, tech]);
  };

  const updateProgress = async (tech, progress) => {
    await TechStackService.updateTechProgress(userId, tech, progress);
    setStack(
      stack.map(t => t.name === tech.name ? { ...t, progress } : t)
    );
  };

  return { stack, loading, addTech, updateProgress };
}
