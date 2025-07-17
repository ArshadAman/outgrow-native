// ProjectLibraryScreen.js
// Screen for viewing and managing user's coding projects
import React from 'react';
import { View, Text, ActivityIndicator, FlatList, Button } from 'react-native';
import { useProjectLibrary } from '../hooks/useProjectLibrary';
import { useAuth } from '../auth/AuthContext';


const ProjectLibraryScreen = () => {
  const { user } = useAuth();
  const { projects, loading, addProject, updateProject, deleteProject } = useProjectLibrary(user?.username || user?.email || '');

  // Example handler for adding a project (replace with modal/input in real app)
  const handleAddProject = () => {
    const newProject = { id: Date.now().toString(), name: 'New Project', description: 'Demo project' };
    addProject(newProject);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Your Project Library</Text>
      <Button title="Add Project (Demo)" onPress={handleAddProject} />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="border-b border-gray-200 py-2">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text>{item.description}</Text>
              <Button
                title="Delete"
                color="red"
                onPress={() => deleteProject(item.id)}
              />
              {/* Example update button */}
              <Button
                title="Rename (Demo)"
                onPress={() => updateProject(item.id, { name: item.name + ' (Updated)' })}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ProjectLibraryScreen;
