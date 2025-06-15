import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { TIPS, TAB_CATEGORIES, RELATED_TECH, FULL_TIP_CONTENT } from "../config/tipData";

export default function TipScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");

  const filteredTips = tab === "All" ? TIPS : TIPS.filter(t => t.category === tab);

  return (
    <View className="flex-1 bg-[#111618]">
      {/* Title & Settings */}
      <View className="flex-row items-center bg-[#111618] p-4 pb-2 justify-between">
        <Text className="text-white text-lg font-bold flex-1 text-center pl-12">Tips</Text>
        <TouchableOpacity className="w-12 items-end">
          <Text className="text-white text-2xl">⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3">
        <View className="flex-row items-center w-full h-12 rounded-xl bg-[#283539]">
          <Text className="text-[#9cb2ba] pl-4 text-xl">🔍</Text>
          <TextInput
            placeholder="Search tips"
            placeholderTextColor="#9cb2ba"
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-white px-2 text-base"
            style={{ backgroundColor: 'transparent' }}
          />
        </View>
      </View>

      {/* Tabs */}
      <View className="pb-3">
        <View className="flex-row border-b border-[#3b4e54] px-4 gap-8">
          {TAB_CATEGORIES.map((t) => (
            <TouchableOpacity
              key={t}
              className={`flex flex-col items-center justify-center pb-[13px] pt-4 ${tab === t ? "border-b-[3px] border-b-white" : "border-b-[3px] border-b-transparent"}`}
              onPress={() => setTab(t)}
            >
              <Text className={`text-sm font-bold tracking-[0.015em] ${tab === t ? "text-white" : "text-[#9cb2ba]"}`}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tips List */}
      <ScrollView>
        {filteredTips
          .filter(tip => 
            (tip.title?.toLowerCase().includes(search.toLowerCase()) || 
             tip.desc?.toLowerCase().includes(search.toLowerCase())
            ) || search === ""
          )
          .map((tip, idx) => (
              <TouchableOpacity 
                key={idx} 
                className="p-4" 
                onPress={() => navigation.navigate('TipDetailScreen', { tipTitle: tip.title })}
              >
                <View className="flex-row items-stretch justify-between gap-4 rounded-xl">
                  <View className="flex-1 flex-col gap-1 pr-2 justify-center">
                    <Text className="text-[#9cb2ba] text-sm">{tip.category || "Uncategorized"}</Text>
                    <Text className="text-white text-base font-bold leading-tight">{tip.title || "Untitled Tip"}</Text>
                    <Text className="text-[#9cb2ba] text-sm" numberOfLines={2}>{tip.desc || "No description available"}</Text>
                  </View>
                  <Image
                    source={{ uri: tip.img || 'https://dummyjson.com/image/400x400/tech' }}
                    className="rounded-xl aspect-video w-28"
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
}
