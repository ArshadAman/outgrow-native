import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

// Example quizzes and tips (replace with your real data)
const quizzes = [
  { tech: "Python", title: "Python Basics", desc: "15 questions", img: "..." },
  { tech: "Python", title: "Python Advanced", desc: "10 questions", img: "..." },
  { tech: "React", title: "React Fundamentals", desc: "10 questions", img: "..." },
  { tech: "React", title: "React Hooks", desc: "8 questions", img: "..." },
  // ...add more
];

const tips = [
  { tech: "Python", title: "Python Efficiency Tips", desc: "Write cleaner and faster Python code.", img: "..." },
  { tech: "React", title: "React Best Practices", desc: "Optimize your React components.", img: "..." },
  // ...add more
];

const tabList = ["Quizzes", "Tips"];

export default function TechDetailScreen() {
  const route = useRoute();
  const { tech } = route.params;
  const [tab, setTab] = useState("Quizzes");

  // Filter by selected tech
  const filteredQuizzes = quizzes.filter(q => q.tech === tech.name);
  const filteredTips = tips.filter(t => t.tech === tech.name);

  return (
    <View className="flex-1 bg-[#111618]">
      <View className="flex-row items-center bg-[#111618] p-4 pb-2 justify-between">
        <Text className="text-white text-lg font-bold flex-1 text-center">{tech.name}</Text>
      </View>
      {/* Tab Bar */}
      <View className="flex-row border-b border-[#3b4e54] px-4 gap-8 pb-3">
        {tabList.map(t => (
          <TouchableOpacity
            key={t}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${tab === t ? "border-b-white" : "border-b-transparent"}`}
            onPress={() => setTab(t)}
          >
            <Text className={`text-sm font-bold tracking-[0.015em] ${tab === t ? "text-white" : "text-[#9cb2ba]"}`}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Content */}
      <ScrollView className="flex-1">
        {tab === "Quizzes" && filteredQuizzes.map((quiz, idx) => (
          <View key={idx} className="flex-row items-stretch justify-between gap-4 rounded-xl p-4">
            <View className="flex flex-col gap-1 flex-[2_2_0px]">
              <Text className="text-[#9cb2ba] text-sm">{quiz.tech}</Text>
              <Text className="text-white text-base font-bold">{quiz.title}</Text>
              <Text className="text-[#9cb2ba] text-sm">{quiz.desc}</Text>
            </View>
            <Image source={{ uri: quiz.img }} className="aspect-video rounded-xl flex-1" style={{ height: 80, minWidth: 100 }} />
          </View>
        ))}
        {tab === "Tips" && filteredTips.map((tip, idx) => (
          <View key={idx} className="flex-row items-stretch justify-between gap-4 rounded-xl p-4">
            <View className="flex flex-col gap-1 flex-[2_2_0px]">
              <Text className="text-[#9cb2ba] text-sm">{tip.tech}</Text>
              <Text className="text-white text-base font-bold">{tip.title}</Text>
              <Text className="text-[#9cb2ba] text-sm">{tip.desc}</Text>
            </View>
            <Image source={{ uri: tip.img }} className="aspect-video rounded-xl flex-1" style={{ height: 80, minWidth: 100 }} />
          </View>
        ))}
        {(tab === "Quizzes" && filteredQuizzes.length === 0) && (
          <Text className="text-[#9cb2ba] text-center mt-8">No quizzes found for {tech.name}.</Text>
        )}
        {(tab === "Tips" && filteredTips.length === 0) && (
          <Text className="text-[#9cb2ba] text-center mt-8">No tips found for {tech.name}.</Text>
        )}
      </ScrollView>
    </View>
  );
}