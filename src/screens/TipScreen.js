import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TIPS, TAB_CATEGORIES } from "../config/tipData";

export default function TipScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigation = useNavigation();

  // Filter tips based on selected category
  const filteredTips = selectedCategory === "All" 
    ? TIPS 
    : TIPS.filter(tip => tip.category === selectedCategory);

  const handleTipPress = (tip) => {
    // Navigate to TipDetailScreen with the predefined tip
    navigation.navigate('TipDetailScreen', {
      tipTitle: tip.title
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      {/* Header */}
      <View className="flex-row items-center bg-[#111618] p-4 pb-2 justify-between">
        <Text className="text-white text-2xl font-bold flex-1 text-center">Tips & Tricks</Text>
      </View>

      {/* Category Tabs */}
      <View className="pb-3">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="px-4"
          contentContainerStyle={{ gap: 10 }}
        >
          {TAB_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === category 
                  ? 'bg-[#0cb9f2] border-[#0cb9f2]' 
                  : 'bg-transparent border-[#3b4e54]'
              }`}
              onPress={() => setSelectedCategory(category)}
            >
              <Text className={`text-sm font-semibold ${
                selectedCategory === category ? 'text-white' : 'text-[#9cb2ba]'
              }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tips List */}
      <ScrollView className="flex-1 px-4">
        {filteredTips.map((tip, index) => (
          <TouchableOpacity
            key={index}
            className="bg-[#1e2324] rounded-lg p-4 mb-4 border border-[#2c3335]"
            onPress={() => handleTipPress(tip)}
          >
            <View className="flex-row">
              <Image
                source={{ uri: tip.img }}
                className="w-16 h-16 rounded-lg mr-4"
                style={{ backgroundColor: '#232D3F' }}
              />
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Text className="text-[#0cb9f2] text-xs font-semibold bg-[#0cb9f2]/20 px-2 py-1 rounded">
                    {tip.category}
                  </Text>
                </View>
                <Text className="text-white text-lg font-bold mb-2">
                  {tip.title}
                </Text>
                <Text className="text-[#9cb2ba] text-sm leading-relaxed" numberOfLines={2}>
                  {tip.desc}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredTips.length === 0 && (
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-[#9cb2ba] text-center">
              No tips found in the {selectedCategory} category.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
