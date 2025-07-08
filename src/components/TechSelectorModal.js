import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Animated } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ALL_TECHS from './techDataFull';
import TechIcon from './TechIcon';

// No navigation hooks or useNavigation here!

export default function TechSelectorModal({ visible, onClose, onSave, selectedTechs }) {
  const [selected, setSelected] = useState(selectedTechs || []);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSelected(selectedTechs || []);
    setSearch("");
  }, [selectedTechs, visible]);

  // Toggle by tech object
  const toggleTech = (tech) => {
    setSelected((prev) => {
      const exists = prev.find(t => t.name === tech.name);
      if (exists) return prev.filter(t => t.name !== tech.name);
      return [...prev, tech];
    });
  };

  const handleSave = async () => {
    await AsyncStorage.setItem('userTechs', JSON.stringify(selected));
    onSave(selected);
    onClose();
  };

  const filteredTechs = ALL_TECHS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/70 justify-center items-center">
        <View className="bg-[#181c1f] rounded-2xl p-6 w-[90%] max-h-[85%]">
          <Text className="text-white text-xl font-bold mb-4">Select Your Technologies</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search tech..."
            placeholderTextColor="#7e8a9a"
            className="bg-[#232D3F] text-white rounded-lg px-4 py-2 mb-4 text-base border border-[#232D3F]"
          />
          <ScrollView className="max-h-[340px]">
            {filteredTechs.map((tech, idx) => {
              const isSelected = selected.find(t => t.name === tech.name);
              const scale = new Animated.Value(isSelected ? 1.04 : 1);
              const handlePressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
              const handlePressOut = () => Animated.spring(scale, { toValue: isSelected ? 1.04 : 1, useNativeDriver: true }).start();
              return (
                <Animated.View
                  key={tech.name}
                  style={{ transform: [{ scale }] }}
                  className="mb-2"
                >
                  <TouchableOpacity
                    onPress={() => toggleTech(tech)}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.88}
                    className={`flex-row items-center py-2 px-3 rounded-xl w-full min-h-[48px] relative ${isSelected ? 'bg-cyan-900/30 border-2 border-cyan-400 shadow-lg shadow-cyan-400/30' : 'bg-[#24282c]/85'} `}
                  >
                    <View className={`items-center justify-center w-[36px] h-[36px] rounded-full mr-3 ${isSelected ? 'bg-cyan-900/20 border-cyan-400' : 'bg-white/10 border-slate-500/20'} border`}>
                      <TechIcon name={tech.name} size={22} color={isSelected ? '#0cb9f2' : '#7e8a9a'} />
                    </View>
                    <View className="flex-1 flex-col justify-center">
                      <Text className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-cyan-400' : 'text-white'}`}>{tech.name}</Text>
                      {tech.desc && (
                        <Text className="text-xs text-[#a2afb3]" numberOfLines={1}>{tech.desc}</Text>
                      )}
                    </View>
                    {isSelected && (
                      <View className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-cyan-400 items-center justify-center border-2 border-white shadow shadow-cyan-400/30">
                        <Text className="text-white text-xs font-bold -mt-0.5">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
            {filteredTechs.length === 0 && (
              <Text className="text-[#7e8a9a] text-base text-center mt-6">No tech found.</Text>
            )}
          </ScrollView>
          <View className="flex-row justify-end mt-5">
            <TouchableOpacity onPress={onClose} className="mr-4 py-2 px-4 rounded-lg bg-[#232D3F]">
              <Text className="text-[#7e8a9a] text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} className="py-2 px-6 rounded-lg bg-cyan-400 ml-1">
              <Text className="text-white text-base font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
