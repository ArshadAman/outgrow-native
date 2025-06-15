import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const techs = [
	{
		name: "Python",
		desc: "Versatile language for web, data science, and more.",
		img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZSefA3wU9gt3EaTBz0RjPEf06zLR45NAl2l1rMkhM90PCIwvSrJmh6v0a788urRT3kDUDoGJgVf0etvigg8GG9I-QLD2uw27-HDCrWb2MhGz11Z57NjynKgb1HOGwas1yZQY3NGrHmA43xb8n2gBtTIFIIhbeiFordwVvuCS-XbPfLtZk0mr92hjYMnioWSlVgIr7KQDW2OuqeR3wupseZ4nsrCBLXJban90LECk_gL5M7EvHcD2qv0qIqVMvBIx7o12V2l_tEIAE",
	},
	{
		name: "JavaScript",
		desc: "The language of the web, powering interactive experiences.",
		img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB47OhRqgFnZGqCipi5H-bzHx0QvJ6KUnGXEDBGn_7M276bKQuPD4ZNsxdo7MtxPZrI27UCg-hYZN0dx4jsm7woibj2i9HqRlphwEbO8FfYCcVLvJOzP3uSkFccl-_7blnRA1DMuOQJA-5esbWeWV4JznZQVbW0Nbs_khJQjY6Q2-fH1V5y1bXiEtPIg1oCaDQS-87cInM3oxloCgTPaGsMSKVITITDmT6yYMCPH3GnjUXXBiP8s6hYqeMCotbEev1OgxnTm6ViNWDw",
	},
	{
		name: "React",
		desc: "A popular library for building user interfaces.",
		img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYgKH5WSza9UEHEwwcgbvFMpJIywxtblm8yyJ2bCWbwHUv7OjvHQHSuRZrDslJ-6odIC7ynxva00SrZRhAAoxdYvUu9gwco4xoV5NhLERJTKVCCfrF2JsnL77FLEW6_JYlouV7d6eiu6VBPzeIaRQm2X2_-LPIlW62VcUaSm1K6ChmY-5qhJqqMiBJo9EuOE-nkYxwiXfOpOxRJmJU9FLTXwZ2ENcKcR7jOtOQi7ySsqFQpftJTA7tUGH13OiQVMp4E6Dw4FCp9OXF",
	},
	{
		name: "Angular",
		desc: "A comprehensive framework for scalable web apps.",
		img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNeOmWBctW7Rovh9mfkKpxZkeIKmHuvM-txF78o9ImND3u15BrZd6PWBSIf0RNFGAIog_QTAnK8ZQM7zBawS0TeHXi2P1Urcej25ebEtw6F_Lou80H1f0unA83S9L8CzP_tBJ7K7y2j-jrhZAdXQcxrQtdPtsrFtofLW33ZeJ7p2B5TcXg2TDQ-U90BIvQ-JYmWyLGq32ohWSdUTyvjsqb4jRwli0BAR9aEYNfuCXp6XxFnuaQ-Y2JTQRc-xrxrNX7oHy-n57dthpK",
	},
	{
		name: "Flutter",
		desc: "Google's UI toolkit for building natively compiled apps.",
		img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMZK_UbBlVxkGQKFnJrbgDxm9i6NBrYwpJJTQZQVOCrQ6llkjfixOZKlcc5DmmYLvW_p_fVONUKhgIpqHAi0a268I6cPBgttjdP0s1QcBAsfQjkond_CmQo0JYneobNAlK8l1IDpP8h41yxNL9glZ9XKWmM5EZxpEOhHKZAyl38icUqpfmcvh2snngfyMxdxw8vSoWaUSbgjqzoqtzNuQAFWdf9fwAMvSKLUN6WtLUOzhXQoVFVtdx2KqcEShpaRqAMzZFNWp-ou2S",
	},
	{
		name: "Django",
		desc: "A high-level Python web framework for rapid development.",
		img: "https://lh3.googleusercontent.com/aida-public/AB6AXuChQDbGjaIax5uxiVRb4LZCoDiTGpVgdWS6XWHOWfzcfzsgVGgEKPhBb7mUusH2Il0n8IR2L3A5Z0O6Wa5SeOyiLUs8Xm9aYtfcewvujGuAKq23ComEDJxrJfbLOqrx2JN4E6EBk_Vk_PWqu9YJLq3sac2sVjsMtCmhj2JtNF6Uj3xsc54rhIo0T-FTO13Q2z9dZIqn1OvEXlDOVLUi23WNfD_ImVAB100LMG9A0DIIThPYQrrPm5mDKGWC4zpVm2hOknzZDUJ3Qp9c",
	},
];

export default function HomeScreen() {
	const navigation = useNavigation();

	return (
		<View className="flex-1 bg-[#121516]">
			<ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
				<Text className="text-white text-2xl font-bold px-4 pt-5 pb-2">Explore Technologies</Text>
				<View className="flex-row flex-wrap justify-between px-4">
					{techs.map((tech, idx) => (
						<TouchableOpacity
							key={tech.name}
							className="w-[47%] bg-transparent mb-4"
							style={{ maxWidth: "48%" }}
							onPress={() => navigation.navigate("TechDetailScreen", { tech })}
						>
							<View className="flex flex-col gap-3 pb-3">
								<Image
									source={{ uri: tech.img }}
									className="w-full aspect-square rounded-xl"
									resizeMode="cover"
								/>
								<View>
									<Text className="text-white text-base font-medium">{tech.name}</Text>
									<Text className="text-[#a2afb3] text-sm">{tech.desc}</Text>
								</View>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);
}