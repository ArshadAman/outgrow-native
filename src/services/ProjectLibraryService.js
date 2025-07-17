// ProjectLibraryService.js
import { db } from './FirebaseService';
import { doc, getDoc, setDoc } from 'firebase/firestore';

class ProjectLibraryService {
  // Get user's projects from Firestore
  static async getUserProjects(userId) {
    if (!userId) return [];
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      return docSnap.data().projects || [];
    } else {
      await setDoc(userDoc, { projects: [] }, { merge: true });
      return [];
    }
  }

  // Add a new project
  static async addProject(userId, project) {
    if (!userId) return;
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    let currentProjects = [];
    if (docSnap.exists()) {
      currentProjects = docSnap.data().projects || [];
    }
    // Avoid duplicates by id
    if (currentProjects.some(p => p.id === project.id)) return;
    const newProjects = [...currentProjects, project];
    await setDoc(userDoc, { projects: newProjects }, { merge: true });
  }

  // Update a project
  static async updateProject(userId, projectId, updates) {
    if (!userId) return;
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    let currentProjects = [];
    if (docSnap.exists()) {
      currentProjects = docSnap.data().projects || [];
    }
    const newProjects = currentProjects.map(p => p.id === projectId ? { ...p, ...updates } : p);
    await setDoc(userDoc, { projects: newProjects }, { merge: true });
  }

  // Delete a project
  static async deleteProject(userId, projectId) {
    if (!userId) return;
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    let currentProjects = [];
    if (docSnap.exists()) {
      currentProjects = docSnap.data().projects || [];
    }
    const newProjects = currentProjects.filter(p => p.id !== projectId);
    await setDoc(userDoc, { projects: newProjects }, { merge: true });
  }
}

export default ProjectLibraryService;
