import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export default function BottomNav() {
  return (
    <>
      <View className="flex-row border-t border-[#2c3335] bg-[#1e2324] px-4 pb-3 pt-2">
        <TouchableOpacity className="flex-1 items-center justify-end gap-1">
          <Text className="text-white text-xl">🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center justify-end gap-1">
          <Text className="text-[#a2afb3] text-xl">❓</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center justify-end gap-1">
          <Text className="text-[#a2afb3] text-xl">💡</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center justify-end gap-1">
          <Text className="text-[#a2afb3] text-xl">🔖</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center justify-end gap-1">
          <Text className="text-[#a2afb3] text-xl">👤</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
