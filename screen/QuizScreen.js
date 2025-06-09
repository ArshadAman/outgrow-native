import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const question = {
  text: "What is the purpose of the 'useMemo' hook in React?",
  options: [
    "To memoize a value and prevent unnecessary re-renders",
    "To manage state within a functional component",
    "To perform side effects in a functional component",
    "To create a reference to a DOM element",
  ],
  correct: 0,
};

export default function QuizScreen() {
  const [selected, setSelected] = useState(0);

  return (
    <View className="flex-1 bg-[#111618] justify-between">
      {/* Progress */}
      <View className="flex flex-col gap-3 p-4">
        <View className="flex-row justify-between">
          <Text className="text-white text-base font-medium">Question 1/5</Text>
        </View>
        <View className="rounded bg-[#3b4e54] h-2 w-full overflow-hidden">
          <View className="h-2 rounded bg-white" style={{ width: "20%" }} />
        </View>
      </View>

      {/* Question */}
      <Text className="text-white text-[22px] font-bold px-4 pb-3 pt-5">
        {question.text}
      </Text>

      {/* Options */}
      <View className="flex flex-col gap-3 p-4">
        {question.options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            className={`flex-row items-center gap-4 rounded-xl border border-solid border-[#3b4e54] p-[15px] ${selected === idx ? "border-white" : ""}`}
            onPress={() => setSelected(idx)}
            activeOpacity={0.8}
          >
            <View
              className={`h-5 w-5 rounded-full border-2 border-[#3b4e54] items-center justify-center ${selected === idx ? "border-white" : ""}`}
              style={{
                backgroundColor: selected === idx ? "#fff" : "transparent",
              }}
            >
              {selected === idx && (
                <View className="h-3 w-3 rounded-full bg-[#111618]" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-medium">{opt}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between px-4 py-3">
        <TouchableOpacity className="min-w-[84px] rounded-xl h-10 px-4 bg-[#283539] items-center justify-center">
          <Text className="text-white text-sm font-bold">Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity className="min-w-[84px] rounded-xl h-10 px-4 bg-[#0cb9f2] items-center justify-center">
          <Text className="text-[#111618] text-sm font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
