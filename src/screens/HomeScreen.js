import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const techs = [
	{
		name: "Python",
		desc: "Versatile language for web, data science, and more.",
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/150px-Python-logo-notext.svg.png",
	},
	{
		name: "JavaScript",
		desc: "The language of the web, powering interactive experiences.",
		img: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
	},
	{
		name: "React",
		desc: "A popular library for building user interfaces.",
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
	},
	{
		name: "Angular",
		desc: "A comprehensive framework for scalable web apps.",
		img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/512px-Angular_full_color_logo.svg.png",
	},
	{
		name: "Flutter",
		desc: "Google's UI toolkit for building natively compiled apps.",
		img: "https://storage.googleapis.com/cms-storage-bucket/0dbfcc7a59cd1cf16282.png",
	},
	{
		name: "Django",
		desc: "A high-level Python web framework for rapid development.",
		img: "https://upload.wikimedia.org/wikipedia/commons/4/45/Django_logo.png",
	},
];

export default function HomeScreen() {
	const navigation = useNavigation();

	return (
		<SafeAreaView className="flex-1 bg-[#121516]">
			<ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
				<Text className="text-white text-2xl font-bold px-4 pt-5 pb-2">Explore Technologies</Text>
				<View className="flex-row flex-wrap justify-between px-4 my-6">
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
									resizeMode="contain"
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
		</SafeAreaView>
	);
}