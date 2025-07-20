import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { removeSavedTip } from '../services/SavedContentService';

export default function SavedTipsDetail() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { category, tips: initialTips = [] } = route.params || {};
  const [tips, setTips] = useState(initialTips);
  const [deleting, setDeleting] = useState(false);
  const [deleteAnim, setDeleteAnim] = useState(0);

  const handleTipPress = (tip) => {
    navigation.navigate('TipDetailScreen', {
      fromTechDetail: true,
      customTip: {
        title: tip.title || 'Sample Tip',
        desc: tip.content || 'This is a sample tip content for testing purposes.'
      },
      customTech: {
        name: tip.techName || category || 'Technology'
      }
    });
  };

  const removeTip = async (tipToRemove) => {
    try {
      Alert.alert(
        'Remove Tip',
        'Are you sure you want to remove this tip from your saved list?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              setDeleting(true);
              let anim = 0;
              setDeleteAnim(anim);
              // Animate spinner
              const interval = setInterval(() => {
                anim += 30;
                setDeleteAnim(anim);
              }, 16);
              const tipKey = tipToRemove.key || `${tipToRemove.techName || category}_${initialTips.indexOf(tipToRemove)}`;
              await removeSavedTip(user.uid, tipKey);
              const newTips = tips.filter(t => (t.key || `${t.techName || category}_${initialTips.indexOf(t)}`) !== tipKey);
              setTips(newTips);
              clearInterval(interval);
              setDeleting(false);
              // If no tips left, go back
              setTimeout(() => {
                if (newTips.length === 0) navigation.goBack();
              }, 200);
            },
          },
        ]
      );
    } catch (error) {
      setDeleting(false);
      console.error('Error removing tip:', error);
      Alert.alert('Error', 'Failed to remove tip.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#111618]">
      {/* Overlay for deleting animation */}
      {deleting && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(17,22,24,0.55)',
          zIndex: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Ionicons name="refresh" size={60} color="#0cb9f2" style={{ marginBottom: 20, transform: [{ rotate: `${deleteAnim}deg` }] }} />
          <Text className="text-white text-xl font-bold mb-2">Deleting...</Text>
          <Text className="text-[#9cb2ba] text-base text-center">Please wait while we remove your tip.</Text>
        </View>
      )}
      {/* Header */}
      <View className="flex-row items-center px-6 py-5 border-b border-[#232D3F] bg-[#181F2A]">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={26} color="#0cb9f2" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold flex-1">{category} Tips</Text>
      </View>

      {/* Tips List */}
      <ScrollView className="flex-1 px-6 py-4">
        {tips.length === 0 ? (
          <View className="flex-1 justify-center items-center p-8 mt-20">
            <Text className="text-[#9cb2ba] text-center text-lg">
              No tips found in this category.
            </Text>
          </View>
        ) : (
          tips.map((tip, index) => {
            const tipKey = tip.key || `${tip.techName || category}_${initialTips.indexOf(tip)}`;
            return (
              <View key={tipKey} className="mb-5 p-5 bg-[#181F2A] rounded-2xl border border-[#232D3F] shadow-md">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-white text-lg font-bold flex-1 mr-2">{tip.title || 'Untitled Tip'}</Text>
                  <TouchableOpacity onPress={() => removeTip({ ...tip, key: tipKey })} className="ml-2">
                    <Ionicons name="trash-outline" size={22} color="#ff4444" />
                  </TouchableOpacity>
                </View>
                <Text className="text-[#9cb2ba] text-sm mb-2">
                  {tip.techName || category} • Saved {tip.timestamp ? new Date(tip.timestamp).toLocaleDateString() : 'Unknown'}
                </Text>
                <Text className="text-[#a2afb3] text-base leading-relaxed mb-4" numberOfLines={4}>
                  {(tip.content || '').replace(/[#*`\\-]/g, '').substring(0, 200)}
                  {(tip.content || '').length > 200 ? '...' : ''}
                </Text>
                <TouchableOpacity
                  onPress={() => handleTipPress(tip)}
                  className="bg-[#0cb9f2] px-4 py-2 rounded-full mt-2"
                >
                  <Text className="text-white text-center font-semibold text-base">Read Full Tip</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
