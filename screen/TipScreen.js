import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";

const tips = [
  {
    category: "Frameworks",
    title: "React Best Practices",
    desc: "Learn how to optimize your React components for performance and maintainability.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB752F83TIMX8MYOc4bh2eW0P0HyhZl17Tf87iL3a24MpknuNqbbeWWEWhb3RlHxfXqGLT1tYkpj2_Fv9VWfjaFKidENDmZEHsCrqoQKv7P6oEVZqAm0xvZDL2_JkANCjEzJylEQXLIucVDTl0-iRlRHk59l5JQm42NYrT_saq--14GDZIiF3lbwGXfb2svF4MIa29Yxwe69wKojtqQWOF2hZpJkqYjohFtfLHI4hN5uRILAbt6_uV1UpUCOR1ArS_cBS4ca0fqMcZY",
  },
  {
    category: "Languages",
    title: "Python Efficiency Tips",
    desc: "Discover techniques to write cleaner and faster Python code.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9aljv3M9e2kZDkPpnfSOFdFCBlNoFjs8ZVE9ZIK0n6fR-W7_ZNEEgOJZQ1M1theTpcAPuuQeInlsNB-5TT3ofvW4IvvmRy0iBfyBpMmWWIoaZcSg0g5wBHjujR5Du_XjDdsyZ50fKHUhFjwJEFVrnhJw_kIlEx9OgTDPri4wQnDX76dbcFXPp-GfHLq7KQUZquS-QkDUPQ1gKZ7XqSICV_4nKFXDeHyO6iA9hQlKQV6BfeCmVmQuh30Q0YWeb8USBqEm-sFTjPKo5",
  },
  {
    category: "Tools",
    title: "Git Advanced Commands",
    desc: "Master Git with advanced commands for branching, merging, and conflict resolution.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCJagPgXGQPSYez1Q_8qm-hxRMwpKH6v_thnVVp5g4BjOtXzugvsoVNHlJnD-m0ry2i8BvK_SMXHoXjMytcalFsBbwWXfkkdD-c3Ywkk-SaHYIe-ZOZ6YElyo9muzU3_Is7qK9fGIEjJXOMgn5Xb13YWMm8IzRYURpyiWro9DTAK9MWzQt65yRk79xM1o1hilW8hrPRYoVAF4FwpnGS2DzvtOl_Sc8BSE5aRkdBkwcgvBrHsXpnwPU8IrrnQI4FLbAte1OmFuIK6H7",
  },
];

const tabList = ["All", "Frameworks", "Languages", "Tools"];

export default function TipScreen() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");

  const filteredTips = tab === "All" ? tips : tips.filter(t => t.category === tab);

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
          {tabList.map((t) => (
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
          .filter(tip => tip.title.toLowerCase().includes(search.toLowerCase()) || tip.desc.toLowerCase().includes(search.toLowerCase()))
          .map((tip, idx) => (
            <View key={idx} className="p-4">
              <View className="flex-row items-stretch justify-between gap-4 rounded-xl">
                <View className="flex-1 flex-col gap-1 pr-2 justify-center">
                  <Text className="text-[#9cb2ba] text-sm">{tip.category}</Text>
                  <Text className="text-white text-base font-bold leading-tight">{tip.title}</Text>
                  <Text className="text-[#9cb2ba] text-sm">{tip.desc}</Text>
                </View>
                <Image
                  source={{ uri: tip.img }}
                  className="rounded-xl aspect-video w-28"
                  resizeMode="cover"
                />
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
