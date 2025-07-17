// TechStackService.js
// Service for managing user tech stack, progress, and XP
import { db } from './FirebaseService';
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs } from 'firebase/firestore';

class TechStackService {
  // Get user's tech stack from Firestore
  static async getUserTechStack(userId) {
    if (!userId) return [];
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data().techStack || [];
    } else {
      // If user doc doesn't exist, create it
      await setDoc(userDoc, { techStack: [] });
      return [];
    }
  }

  // Add a technology to user's stack
  static async addTechToStack(userId, tech) {
    if (!userId) return;
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    let currentStack = [];
    if (docSnap.exists()) {
      currentStack = docSnap.data().techStack || [];
    }
    // Avoid duplicates by name
    if (currentStack.some(t => t.name === tech.name)) return;
    const newStack = [...currentStack, tech];
    await setDoc(userDoc, { techStack: newStack }, { merge: true });
  }

  // Update progress for a technology
  static async updateTechProgress(userId, tech, progress) {
    if (!userId) return;
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    let currentStack = [];
    if (docSnap.exists()) {
      currentStack = docSnap.data().techStack || [];
    }
    const newStack = currentStack.map(t => t.name === tech.name ? { ...t, progress } : t);
    await setDoc(userDoc, { techStack: newStack }, { merge: true });
  }
}

export default TechStackService;
