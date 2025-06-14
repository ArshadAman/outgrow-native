import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const GEMINI_API_KEY = "AIzaSyB1dfw9FMlxVUe44ekb_KbQ5ImKpqO70BI"; // <-- Replace with your Gemini API key

export default function TechDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { tech } = route.params;
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const prompt = `Give me 10 modern, practical, and concise tips and tricks for ${tech.name} (with a short title and a detailed explanation for each, in markdown). Give me the tips in a format like this:
## Tip Title 1
### Tip 1 description here
## Tip Title 2
### Tip 2 description here
## Tip Title 3
### Tip 3 description here
## Tip Title 4
### Tip 4 description here
## Tip Title 5
### Tip 5 description here`;
        const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        const data = await res.json();
        let tipsArr = [];
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          // Remove everything before the first '## '
          const raw = data.candidates[0].content.parts[0].text;
          const firstTipIdx = raw.indexOf('## ');
          const tipsOnly = firstTipIdx !== -1 ? raw.slice(firstTipIdx) : raw;
          // Split on every '## ' heading
          const tipBlocks = tipsOnly.split(/\n## /g).map((block, idx) => idx === 0 && block.startsWith('## ') ? block.slice(3) : block);
          tipsArr = tipBlocks
            .map((block) => {
              // The first line is the title, the rest is the body
              const [titleLine, ...rest] = block.split("\n");
              const title = titleLine.replace(/^## /, '').trim();
              const body = rest.join("\n").trim();
              // Only include if both title and body exist
              if (title && body) {
                return { title, desc: body };
              }
              return null;
            })
            .filter(Boolean);
        }
        setTips(tipsArr);
      } catch (e) {
        setTips([]);
      }
      setLoading(false);
    };
    fetchTips();
  }, [tech.name]);

  return (
    <View className="flex-1 bg-[#111618]">
      <View className="flex-row items-center bg-[#111618] p-4 pb-2 justify-between">
        <Text className="text-white text-lg font-bold flex-1 text-center">{tech.name} Tips & Tricks</Text>
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0cb9f2" />
        </View>
      ) : (
        <ScrollView className="flex-1">
          {tips.map((tip, idx) => (
            <TouchableOpacity
              key={idx}
              className="rounded-xl p-4 bg-[#181F2A] mb-3 flex-row items-center"
              onPress={() => navigation.navigate('TipDetailScreen', { tip, tech })}
              activeOpacity={0.9}
            >
              <Text className="text-white text-base font-bold flex-1">{tip.title}</Text>
              <Text className="text-[#0cb9f2] text-xl ml-2">→</Text>
            </TouchableOpacity>
          ))}
          {tips.length === 0 && (
            <Text className="text-[#9cb2ba] text-center mt-8">No tips found for {tech.name}.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}