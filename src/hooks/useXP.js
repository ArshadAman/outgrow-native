// useXP.js
// React hook for XPService integration
import { useState } from 'react';
import XPService from '../services/XPService';

export function useXP() {
  const [xp, setXP] = useState(0);

  const addXP = (action) => {
    const gained = XPService.getXPForAction(action);
    setXP(xp + gained);
  };

  return { xp, addXP };
}
