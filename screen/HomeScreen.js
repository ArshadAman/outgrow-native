import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-[#101828] rounded-2xl p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-lg font-bold">Daily Learn</Text>
        <TouchableOpacity>
          <Text className="text-white text-2xl">⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Daily Quiz Section */}
        <Text className="text-white text-base font-semibold mb-2">Daily Quiz</Text>
        <View className="flex-row space-x-3 mb-6">
          {/* Quiz Card 1 */}
          <View className="bg-[#181F2A] rounded-xl w-40 h-44 p-2">
            <Image
              className="w-full h-24 rounded-lg mb-2"
              source={{ uri: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" }}
            />
            <Text className="text-xs text-white bg-[#232D3F] px-2 py-0.5 rounded mb-1 self-start">Programming</Text>
            <Text className="text-white font-semibold text-sm">Quiz 1</Text>
            <Text className="text-gray-400 text-xs">Test your knowledge on data structures and algorithms.</Text>
          </View>
          {/* Quiz Card 2 */}
          <View className="bg-[#181F2A] rounded-xl w-40 h-44 p-2">
            <Image
              className="w-full h-24 rounded-lg mb-2"
              source={{ uri: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80" }}
            />
            <Text className="text-xs text-white bg-[#232D3F] px-2 py-0.5 rounded mb-1 self-start">Programming</Text>
            <Text className="text-white font-semibold text-sm">Quiz 2</Text>
            <Text className="text-gray-400 text-xs">Challenge yourself with coding problems.</Text>
          </View>
        </View>

        {/* Framework Tips Section */}
        <Text className="text-white text-base font-semibold mb-2">Framework Tips</Text>
        <View className="flex-row space-x-3 mb-6">
          {/* Tip Card 1 */}
          <View className="bg-[#181F2A] rounded-xl w-40 h-44 p-2">
            <Image
              className="w-full h-24 rounded-lg mb-2"
              source={{ uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" }}
            />
            <Text className="text-white font-semibold text-sm">Tip 1</Text>
            <Text className="text-gray-400 text-xs">Learn best practices for using React in your projects.</Text>
          </View>
          {/* Tip Card 2 */}
          <View className="bg-[#181F2A] rounded-xl w-40 h-44 p-2">
            <Image
              className="w-full h-24 rounded-lg mb-2"
              source={{ uri: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" }}
            />
            <Text className="text-white font-semibold text-sm">Tip 2</Text>
            <Text className="text-gray-400 text-xs">Discover efficient working with Angular.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-between items-center bg-[#181F2A] rounded-xl px-6 py-3 mt-2">
        <TouchableOpacity className="items-center">
          <Text className="text-white text-xl">🏠</Text>
          <Text className="text-white text-xs">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-400 text-xl">📚</Text>
          <Text className="text-gray-400 text-xs">Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Text className="text-gray-400 text-xl">👤</Text>
          <Text className="text-gray-400 text-xs">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}