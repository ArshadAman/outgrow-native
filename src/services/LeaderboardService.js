// LeaderboardService.js
import { db } from './FirebaseService';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

class LeaderboardService {
  // Get all users and their XP, sorted descending
  static async getLeaderboard() {
    const usersCol = collection(db, 'users');
    const snapshot = await getDocs(usersCol);
    const leaderboard = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.xp !== undefined) {
        leaderboard.push({
          userId: docSnap.id,
          username: data.username || docSnap.id,
          xp: data.xp || 0,
        });
      }
    });
    leaderboard.sort((a, b) => b.xp - a.xp);
    return leaderboard;
  }

  // Update user XP in Firestore
  static async updateUserXP(userId, xp) {
    if (!userId) return;
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    let data = {};
    if (docSnap.exists()) {
      data = docSnap.data();
    }
    await setDoc(userDoc, { ...data, xp }, { merge: true });
  }
}

export default LeaderboardService;
