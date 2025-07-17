// TechStackScreen.js
// Screen for viewing and managing user's tech stack
import React from 'react';
import { View, Text, ActivityIndicator, FlatList, Button } from 'react-native';
import { useTechStack } from '../hooks/useTechStack';
import { useAuth } from '../auth/AuthContext';


const TechStackScreen = () => {
  const { user } = useAuth();
  const { stack, loading, addTech, updateProgress } = useTechStack(user?.username || user?.email || '');

  // Example handler for adding a tech (replace with modal/input in real app)
  const handleAddTech = () => {
    const newTech = { name: 'React Native', progress: 0 };
    addTech(newTech);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Your Tech Stack</Text>
      <Button title="Add Tech (Demo)" onPress={handleAddTech} />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={stack}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View className="border-b border-gray-200 py-2">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text>Progress: {item.progress}%</Text>
              {/* Example progress update button */}
              <Button
                title="+10% Progress"
                onPress={() => updateProgress(item, (item.progress || 0) + 10)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default TechStackScreen;
