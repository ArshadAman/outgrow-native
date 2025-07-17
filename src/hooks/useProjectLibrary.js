// useProjectLibrary.js
// React hook for ProjectLibraryService integration
import { useState, useEffect } from 'react';
import ProjectLibraryService from '../services/ProjectLibraryService';

export function useProjectLibrary(userId) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const data = await ProjectLibraryService.getUserProjects(userId);
      setProjects(data);
      setLoading(false);
    }
    if (userId) fetchProjects();
  }, [userId]);

  const addProject = async (project) => {
    await ProjectLibraryService.addProject(userId, project);
    setProjects([...projects, project]);
  };

  const updateProject = async (projectId, updates) => {
    await ProjectLibraryService.updateProject(userId, projectId, updates);
    setProjects(
      projects.map(p => p.id === projectId ? { ...p, ...updates } : p)
    );
  };

  const deleteProject = async (projectId) => {
    await ProjectLibraryService.deleteProject(userId, projectId);
    setProjects(projects.filter(p => p.id !== projectId));
  };

  return { projects, loading, addProject, updateProject, deleteProject };
}
