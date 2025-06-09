import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";

const quizzes = [
  {
    category: "React",
    title: "React Fundamentals",
    desc: "10 questions",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAptaTXilCF3NSEm9nXU-WuVZg1eOe05cU7ACRJmOXcXhQdzixedUENI3a62Q-tT49I34LldFfbimZyjSbNytt0F8m1MEK0tkxdGZEjdvzKlje-6icFTJu1NZ2Kc2PQGQKle2V15fnLi_J9wnMXb7LwB_n2cGajkHeEoGIZNohv9WCAwJhlWMHqf1BdCNXE-fRYNYcEBKdkCVV8W7_0Enmdqfs4Q0Hrk_l9M1D6vnx_w6iNo7HJQ6-vg5QmNcAAgVs1uwJVIydFK2xr",
  },
  {
    category: "Python",
    title: "Python Basics",
    desc: "15 questions",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT4rsxt9IFHF2BR71vFSQfDdiNlrkdaGctnj5Otk0E-RdyDdcgFykqhdzDPn0rMqYTrHXE3nUqupal-fS98dg69By-dedVuSbSm5q4Tlwp18cEhwO_GR1IjNFUP5A8wqRgqfwxrR8ih-V27zLTYYkCfCpudiU6Tty2SS3A5p0obTw1lwyoKRKpUA-GTzv6hhj2vwWOJFhwQZwtjw-IsSuEYxJJx2GUqwD84n-GPx2PTVLcEBpX1x6lIzUF1F_q5fVM63Z_M0ipfsED",
  },
  {
    category: "JavaScript",
    title: "JavaScript Advanced",
    desc: "20 questions",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCi7Juiu7dgbSItu-JuNnBHFs91Jc9haKn0IHHbXctTK-zxmA6K_JGDAjgMMB5j5q3Jsgxd6bc3lJEDod9afBDanCQM-uX_pPYZWarPi591xKdXdjd8EWlgz9JgdmMemWN4u6rsbq6nU577gwOr8D8FOD3DmDtgvrYOclRJPKFnowKBmO4QjL3ZYF-Ffnv6iPoUs4w3ZvrFpOoU04MN8bhsT8xiSxJ1NVpIsy0P2N0i3MwyCwfWVfQdreSrxNoLBd8zrgsT9qDcaPN",
  },
];

const tabList = ["Quizzes", "Tips"];

export default function SavedScreen() {
  const [tab, setTab] = useState("Quizzes");

  // For demo, only quizzes are shown. You can add tips data and logic if needed.
  const filtered = tab === "Quizzes" ? quizzes : [];

  return (
    <View className="flex-1 bg-[#111618]">
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

      {/* Saved List */}
      <ScrollView>
        {filtered.map((item, idx) => (
          <View key={idx} className="p-4">
            <View className="flex-row items-stretch justify-between gap-4 rounded-xl">
              <View className="flex-1 flex-col gap-1 pr-2 justify-center">
                <Text className="text-[#9cb2ba] text-sm">{item.category}</Text>
                <Text className="text-white text-base font-bold leading-tight">{item.title}</Text>
                <Text className="text-[#9cb2ba] text-sm">{item.desc}</Text>
              </View>
              <Image
                source={{ uri: item.img }}
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
