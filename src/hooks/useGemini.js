// useGemini.js
// React hook for GeminiService integration
import { useState } from 'react';
import GeminiService from '../services/GeminiService';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async (prompt) => {
    setLoading(true);
    const res = await GeminiService.generateQuizOrTip(prompt);
    setResult(res);
    setLoading(false);
  };

  return { loading, result, generate };
}
