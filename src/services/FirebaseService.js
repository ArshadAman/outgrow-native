// FirebaseService.js
// Modular Firebase Auth and Firestore logic


// Firebase v9+ modular SDK
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAiA9Oap90G17NNuibxJfTmH32KD-Ca8uQ",
  authDomain: "outgrow-24.firebaseapp.com",
  projectId: "outgrow-24",
  storageBucket: "outgrow-24.firebasestorage.app",
  messagingSenderId: "711852967929",
  appId: "1:711852967929:web:92bdc9d072f4499da45f28",
  measurementId: "G-Y0YCP8E9VJ"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

class FirebaseService {
  static auth = auth;
  static db = db;

  // Example: signIn method (not used in this app, handled by authService)
  static async signIn(email, password) {
    // Implement if needed
    return null;
  }

  static async getUserData(userId) {
    // Example: Fetch user data from Firestore
    // Implement as needed
    return null;
  }
}

export default FirebaseService;
export { db, auth };
