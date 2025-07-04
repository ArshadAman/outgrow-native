import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FULL_TIP_CONTENT, RELATED_TECH } from "../config/tipData";
import { SafeAreaView } from "react-native-safe-area-context";

function renderMarkdownWithCodeBlocks(text) {
  // Handle null or undefined text
  if (!text) {
    return <Text className="text-[#a2afb3] text-lg">No content available</Text>;
  }
  
  // Split by code blocks (```...```) and render code blocks as styled <Text>
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, idx) => {
    // Skip null or empty parts
    if (!part) return null;
    
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
  // Get tip info from route params
  const { tipTitle, customTip, customTech, fromTechDetail } = route.params || {};
  
  // State for managing saved tips
  const [savedTips, setSavedTips] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  let tip, tech;
  
  // If we received tip and tech directly (from TechDetailScreen)
  if (fromTechDetail && customTip && customTech) {
    tip = customTip;
    tech = customTech;
  } else {
    // Look up full tip content and related tech from our predefined data
    tip = tipTitle && FULL_TIP_CONTENT[tipTitle] ? FULL_TIP_CONTENT[tipTitle] : null;
    tech = tipTitle && RELATED_TECH[tipTitle] ? RELATED_TECH[tipTitle] : null;
  }
  
  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Generate a unique key for this tip
  const tipKey = `${tech?.name || 'General'}_${tip?.title || 'Untitled'}`;
  const isSaved = savedTips[tipKey] !== undefined;

  // Load saved tips on component mount
  useEffect(() => {
    loadSavedTips();
  }, []);

  const loadSavedTips = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_tips');
      if (saved) {
        setSavedTips(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved tips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSaveTip = async () => {
    try {
      const newSavedTips = { ...savedTips };

      if (newSavedTips[tipKey]) {
        // Remove from saved
        delete newSavedTips[tipKey];
        Alert.alert('Tip Removed', 'This tip has been removed from your saved collection.');
      } else {
        // Add to saved
        newSavedTips[tipKey] = {
          title: tip.title,
          content: tip.desc,
          techName: tech.name,
          category: tech.name, // Use tech name as the category
          timestamp: new Date().toISOString(),
        };
        Alert.alert('Tip Saved!', 'This tip has been added to your saved collection.');
      }

      await AsyncStorage.setItem('saved_tips', JSON.stringify(newSavedTips));
      setSavedTips(newSavedTips);
    } catch (error) {
      console.error('Error saving tip:', error);
      Alert.alert('Error', 'Failed to save tip. Please try again.');
    }
  };
  
  // If we don't have tip data, show a fallback UI
  if (!tip || !tech) {
    return (
      <View className="flex-1 bg-[#111618]">
        <View className="flex-row items-center bg-[#111618] p-4 pb-2">
          <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
            <Text className="text-[#0cb9f2] text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold flex-1 text-center">Tip Blog</Text>
        </View>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-[#a2afb3] text-xl text-center">
            Sorry, the tip you requested could not be found.
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
    <SafeAreaView className="flex-1 bg-[#111618]">
      <View className="flex-row items-center bg-[#111618] p-4 pb-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
          <Text className="text-[#0cb9f2] text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center">Tip Blog</Text>
        {tip && tech && (
          <TouchableOpacity onPress={toggleSaveTip} className="pl-4">
            <Text className="text-2xl">{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView className="flex-1 px-4 pt-2 pb-8">
        <View className="bg-[#181F2A] rounded-2xl p-6 shadow-lg mb-6">
          <Text className="text-3xl font-extrabold text-white mb-3 leading-tight tracking-tight">
            {tip?.title || "Untitled Tip"}
          </Text>
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: tech?.img || 'https://dummyjson.com/image/400x400/tech' }}
              className="w-10 h-10 rounded-full mr-3"
              style={{ backgroundColor: '#232D3F' }}
            />
            <View>
              <Text className="text-[#0cb9f2] font-semibold text-base">{tech?.name || "Technology"}</Text>
              <Text className="text-[#a2afb3] text-xs">{dateStr}</Text>
            </View>
          </View>
          {renderMarkdownWithCodeBlocks(tip?.desc)}
          
          {/* Save Action Button */}
          {tip && tech && (
            <TouchableOpacity
              onPress={toggleSaveTip}
              className={`mt-6 py-3 px-6 rounded-full flex-row items-center justify-center ${
                isSaved ? 'bg-red-500' : 'bg-[#0cb9f2]'
              }`}
            >
              <Text className="text-white font-semibold text-base mr-2">
                {isSaved ? 'Remove from Saved' : 'Save This Tip'}
              </Text>
              <Text className="text-white text-lg">{isSaved ? '💔' : '💾'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
