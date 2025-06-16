import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

const techs = [
	{
		name: "Python",
		desc: "Versatile language for web, data science, and more.",
		img: "https://imgs.search.brave.com/HF3ia9EieFYdnIZ2J9EkNg-Tvlr0AOVFUBqQb1efwJ8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWRzLnR1cmJvbG9n/by5jb20vdXBsb2Fk/cy9kZXNpZ24vcHJl/dmlld19pbWFnZS82/ODQ2MjQ3OS9wcmV2/aWV3X2ltYWdlMjAy/NDExMzAtMS0xbnZt/Y3k4LnBuZw",
	},
	{
		name: "JavaScript",
		desc: "The language of the web, powering interactive experiences.",
		img: "https://imgs.search.brave.com/4ODLwWYy7h8EEQzjOzTrpzFiWpNynz27SB73upo1Fag/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDI3LzEy/Ny80NjMvbm9uXzJ4/L2phdmFzY3JpcHQt/bG9nby1qYXZhc2Ny/aXB0LWljb24tdHJh/bnNwYXJlbnQtZnJl/ZS1wbmcucG5n",
	},
	{
		name: "React",
		desc: "A popular library for building user interfaces.",
		img: "https://imgs.search.brave.com/mKMVQ2LvuFZg5i6d3SVBSUKmKQU3MEF7g_PGMbnPCOY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dC5icmFuZGZldGNo/LmlvL2lkYl8tcWdx/NTUvaWQyWV9rd1l4/Si5qcGVnP3VwZGF0/ZWQ9MTcxODgzMDI1/NTM2MA",
	},
	{
		name: "Angular",
		desc: "A comprehensive framework for scalable web apps.",
		img: "https://imgs.search.brave.com/PF4DYxWxgZMz8G6hfcNbS0xJt8MJhKcrMygAQY1wZaI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzUwLzIvYW5ndWxh/ci1pY29uLWxvZ28t/cG5nX3NlZWtsb2dv/LTUwNzMyNC5wbmc",
	},
	{
		name: "Flutter",
		desc: "Google's UI toolkit for building natively compiled apps.",
		img: "https://imgs.search.brave.com/WANd4YBXW-8aYfzOUjz7H96SnV-VuyrFXCXbVa4GZmA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/dmVjdG9ycy5jb20v/c3RvcmFnZS9pbWFn/ZXMvRmx1dHRlci5z/dmc",
	},
	{
		name: "Django",
		desc: "A high-level Python web framework for rapid development.",
		img: "https://imgs.search.brave.com/4XrRAVW6AzaIlnnM96sEt7WA5CRsMSWWStIOpb1VvBI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZGl4LmNvbS9sb2dv/LzE3NTg4NDEucG5n",
	},
];

export default function HomeScreen() {
	return (
		<View className="flex-1 bg-[#121516]">
			<ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
				<Text className="text-white text-2xl font-bold px-4 pt-5 pb-2">Explore Technologies</Text>
				<View className="flex-row flex-wrap justify-between px-4">
					{techs.map((tech, idx) => (
						<View
							key={tech.name}
							className="w-[47%] bg-transparent mb-4"
							style={{ maxWidth: "48%" }}
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
						</View>
					))}
				</View>
			</ScrollView>
		</View>
	);
}