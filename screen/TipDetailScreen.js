import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";

function renderMarkdownWithCodeBlocks(text) {
  // Split by code blocks (```...```) and render code blocks as styled <Text>
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract code (ignore language for now)
      const code = part.replace(/```[\w]*\n?/,'').replace(/```$/,'');
      return (
        <View
          key={idx}
          style={{ marginVertical: 12, borderRadius: 10, overflow: 'hidden', backgroundColor: '#232D3F' }}
        >
          <Text
            selectable
            style={{
              color: '#0cb9f2',
              fontFamily: 'Menlo',
              fontSize: 15,
              padding: 16,
              backgroundColor: '#232D3F',
              borderRadius: 10,
              fontWeight: '500',
            }}
          >
            {code.trim()}
          </Text>
        </View>
      );
    } else {
      return (
        <Text key={idx} className="text-[#a2afb3] text-lg leading-relaxed whitespace-pre-line" style={{ lineHeight: 28 }}>
          {part.replace(/[#*`\\-]/g, '')}
        </Text>
      );
    }
  });
}

export default function TipDetailScreen({ route, navigation }) {
  const { tip, tech } = route.params;
  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <View className="flex-1 bg-[#111618]">
      <View className="flex-row items-center bg-[#111618] p-4 pb-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
          <Text className="text-[#0cb9f2] text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center">Tip Blog</Text>
      </View>
      <ScrollView className="flex-1 px-4 pt-2 pb-8">
        <View className="bg-[#181F2A] rounded-2xl p-6 shadow-lg mb-6">
          <Text className="text-3xl font-extrabold text-white mb-3 leading-tight tracking-tight">
            {tip.title}
          </Text>
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: tech.img || 'https://dummyjson.com/image/400x400/tech' }}
              className="w-10 h-10 rounded-full mr-3"
              style={{ backgroundColor: '#232D3F' }}
            />
            <View>
              <Text className="text-[#0cb9f2] font-semibold text-base">{tech.name}</Text>
              <Text className="text-[#a2afb3] text-xs">{dateStr}</Text>
            </View>
          </View>
          {renderMarkdownWithCodeBlocks(tip.desc)}
        </View>
      </ScrollView>
    </View>
  );
}
