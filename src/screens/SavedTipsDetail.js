import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedTipsDetail({ route, navigation }) {
  const { category, tips } = route.params;

  const handleTipPress = (tip) => {
    // Navigate to TipDetailScreen with the saved tip data
    navigation.navigate('TipDetailScreen', {
      fromTechDetail: true,
      customTip: {
        title: tip.title,
        desc: tip.content
      },
      customTech: {
        name: tip.techName || category
      }
    });
  };

  const handleDeleteTip = async (tipKey) => {
    Alert.alert(
      'Delete Tip',
      'Are you sure you want to remove this tip from your saved collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const saved = await AsyncStorage.getItem('saved_tips');
              if (saved) {
                const savedTips = JSON.parse(saved);
                delete savedTips[tipKey];
                await AsyncStorage.setItem('saved_tips', JSON.stringify(savedTips));
                navigation.goBack(); // Go back to refresh the list
              }
            } catch (error) {
              console.error('Error deleting tip:', error);
              Alert.alert('Error', 'Failed to delete tip');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      {/* Header */}
      <View className="flex-row items-center bg-[#111618] p-4 pb-2">
        <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
          <Text className="text-[#0cb9f2] text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold flex-1 text-center">
          Saved {category} Tips
        </Text>
      </View>

      {/* Tips List */}
      <ScrollView className="flex-1 p-4">
        {tips.map((tip, index) => {
          const tipKey = `${tip.techName || category}_${tip.title}`;
          return (
            <View key={index} className="bg-[#1e2324] rounded-lg p-4 mb-4 border border-[#2c3335]">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-2">
                  <Text className="text-white text-lg font-bold mb-1">
                    {tip.title}
                  </Text>
                  <Text className="text-[#9cb2ba] text-sm mb-2">
                    {tip.techName || category} • Saved {new Date(tip.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleDeleteTip(tipKey)}
                  className="p-2"
                >
                  <Text className="text-red-400 text-lg">🗑️</Text>
                </TouchableOpacity>
              </View>
              
              {/* Tip Preview */}
              <Text className="text-[#a2afb3] text-sm leading-relaxed mb-3" numberOfLines={3}>
                {tip.content.replace(/[#*`\\-]/g, '').substring(0, 150)}
                {tip.content.length > 150 ? '...' : ''}
              </Text>

              {/* Actions */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleTipPress(tip)}
                  className="bg-[#0cb9f2] px-4 py-2 rounded-full flex-1"
                >
                  <Text className="text-white text-center font-semibold">Read Full Tip</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {tips.length === 0 && (
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-[#9cb2ba] text-center">
              No tips saved in this category yet.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
