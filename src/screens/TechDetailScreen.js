import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { fetchTips } from "../api/tips";

export default function TechDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const tech = route.params?.tech || { name: "Technology" };
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch tips if tech exists
    if (tech && tech.name) {
      const fetchTipsData = async () => {
        setLoading(true);
        try {
          let res = await fetchTips(tech);
          setTips(res);
        } catch (err) {
          console.error("Error fetching tips:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTipsData();
    } else {
      setLoading(false);
    }
  }, [tech?.name]);

  // If no tech data was passed, show a fallback UI
  if (!tech || !tech.name) {
    return (
      <View className="flex-1 bg-[#111618]">
        <View className="flex-row items-center bg-[#111618] p-4 pb-2">
          <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
            <Text className="text-[#0cb9f2] text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold flex-1 text-center">Technology</Text>
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-[#a2afb3] text-xl text-center">
            Sorry, no technology data was provided.
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mt-6 bg-[#0cb9f2] py-3 px-6 rounded-full"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#111618]">
      <View className="flex-row items-center bg-[#111618] p-4 pb-2 justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
          <Text className="text-[#0cb9f2] text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center">{tech.name} Tips & Tricks</Text>
      </View>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0cb9f2" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4">
          {tips && tips.length > 0 ? tips.map((tip, idx) => (
            <TouchableOpacity
              key={idx}
              className="rounded-xl p-4 bg-[#181F2A] mb-3 flex-row items-center"
              onPress={() => {
                // Create a full tip object in the format expected by TipDetailScreen
                const customTip = {
                  title: tip?.title || "Untitled Tip",
                  desc: tip?.desc || "No description available"
                };
                
                // Create a tech object in the format expected by TipDetailScreen
                const customTech = {
                  name: tech?.name || "Technology",
                  img: tech?.img || 'https://dummyjson.com/image/400x400/tech',
                  category: tech?.category || "Uncategorized"
                };
                
                // Instead of just passing tipTitle, pass the whole tip and tech objects
                navigation.navigate('TipDetailScreen', { 
                  customTip,  // Pass the full tip object
                  customTech, // Pass the full tech object
                  fromTechDetail: true // Flag to indicate source screen
                });
              }}
              activeOpacity={0.9}
            >
              <Text className="text-white text-base font-bold flex-1">{tip?.title || "Untitled Tip"}</Text>
              <Text className="text-[#0cb9f2] text-xl ml-2">→</Text>
            </TouchableOpacity>
          )) : (
            <View className="mt-8 items-center">
              <Text className="text-[#9cb2ba] text-center">No tips found for {tech.name}.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}