import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import TechIcon from '../components/TechIcon';

const TECH_SECTIONS = [
  {
    title: "Languages",
    data: [
      { name: "Python", desc: "Versatile, high-level programming language." },
      { name: "JavaScript", desc: "Language of the web for interactive experiences." },
      { name: "Java", desc: "Popular for enterprise and Android development." },
      { name: "C++", desc: "High-performance systems and application language." },
      { name: "Go", desc: "Efficient, compiled language for scalable systems." },
      { name: "Kotlin", desc: "Modern language for Android and more." },
      { name: "Swift", desc: "Apple's language for iOS and macOS apps." },
      { name: "TypeScript", desc: "Typed superset of JavaScript." },
      { name: "Rust", desc: "Memory-safe, high-performance systems language." },
      { name: "Ruby", desc: "Dynamic, open source language with a focus on simplicity." },
      { name: "PHP", desc: "Popular general-purpose scripting language." },
      { name: "C#", desc: "Modern, object-oriented language for .NET platform." },
    ]
  },
  {
    title: "Frontend Frameworks",
    data: [
      { name: "React", desc: "UI library for building interactive interfaces." },
      { name: "Vue.js", desc: "Progressive JavaScript framework." },
      { name: "Angular", desc: "Robust framework for building web apps." },
      { name: "Svelte", desc: "Cybernetically enhanced web apps." },
      { name: "Next.js", desc: "React framework for production." },
      { name: "Nuxt.js", desc: "Vue.js framework for universal apps." },
      { name: "Gatsby", desc: "React-based static site generator." },
      { name: "SolidJS", desc: "Simple and performant reactive UI library." },
    ]
  },
  {
    title: "Backend Frameworks",
    data: [
      { name: "Node.js", desc: "JavaScript runtime for server-side development." },
      { name: "Django", desc: "Python web framework for perfectionists." },
      { name: "Spring", desc: "Java framework for enterprise apps." },
      { name: "Express", desc: "Fast, unopinionated Node.js web framework." },
      { name: "Flask", desc: "Lightweight Python web framework." },
      { name: "Ruby on Rails", desc: "Convention over configuration web framework." },
      { name: "Laravel", desc: "PHP web application framework." },
      { name: "ASP.NET Core", desc: "Cross-platform .NET framework for web apps." },
      { name: "FastAPI", desc: "Modern, fast Python web framework." },
      { name: "NestJS", desc: "Progressive Node.js framework for building efficient server-side apps." },
    ]
  },
  {
    title: "App Development",
    data: [
      { name: "React Native", desc: "Build native apps using React." },
      { name: "Flutter", desc: "Build beautiful native apps in record time." },
      { name: "SwiftUI", desc: "Modern UI framework for Apple platforms." },
      { name: "Kotlin Multiplatform", desc: "Share code between platforms." },
      { name: "Xamarin", desc: ".NET-based framework for building cross-platform apps." },
      { name: "Ionic", desc: "Hybrid mobile app development framework." },
      { name: "Cordova", desc: "Mobile apps with HTML, CSS & JS." },
      { name: "Jetpack Compose", desc: "Modern toolkit for building native Android UI." },
    ]
  },
  {
    title: "DevOps",
    data: [
      { name: "Docker", desc: "Containerize your applications." },
      { name: "Kubernetes", desc: "Automate deployment, scaling, and management." },
      { name: "Jenkins", desc: "Automate your CI/CD pipelines." },
      { name: "GitHub Actions", desc: "Automate, customize, and execute software workflows." },
      { name: "Travis CI", desc: "Continuous integration service." },
      { name: "CircleCI", desc: "Automate your development process quickly, safely, and at scale." },
      { name: "Terraform", desc: "Infrastructure as code software tool." },
      { name: "Ansible", desc: "Simple IT automation platform." },
    ]
  },
  {
    title: "AI / ML",
    data: [
      { name: "TensorFlow", desc: "End-to-end open source platform for machine learning." },
      { name: "PyTorch", desc: "Deep learning platform that provides flexibility." },
      { name: "scikit-learn", desc: "Machine learning in Python." },
      { name: "Keras", desc: "Deep learning API written in Python." },
      { name: "OpenCV", desc: "Open source computer vision library." },
      { name: "spaCy", desc: "Industrial-strength NLP in Python." },
      { name: "NLTK", desc: "Natural Language Toolkit for Python." },
      { name: "Pandas", desc: "Data analysis and manipulation tool." },
    ]
  },
  {
    title: "Cloud",
    data: [
      { name: "AWS", desc: "Amazon Web Services cloud platform." },
      { name: "Azure", desc: "Microsoft's cloud computing service." },
      { name: "Google Cloud", desc: "Google's suite of cloud computing services." },
      { name: "Firebase", desc: "Build and run successful apps." },
      { name: "Heroku", desc: "Cloud platform as a service." },
      { name: "DigitalOcean", desc: "Cloud computing for developers." },
      { name: "Netlify", desc: "Cloud platform for web apps and static sites." },
      { name: "Vercel", desc: "Develop, preview, and ship web apps." },
    ]
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#121516]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}>
        <Text className="text-white text-3xl font-extrabold pt-5 pb-2 px-4 tracking-tight mb-2">Explore Technologies</Text>
        {TECH_SECTIONS.map((section, i) => (
          <View key={section.title} style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 16 }}>
              <View style={{ height: 28, width: 6, borderRadius: 3, backgroundColor: '#0cb9f2', marginRight: 12, opacity: 0.85 }} />
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0cb9f2', letterSpacing: -0.5, textShadowColor: '#0cb9f2AA', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 }}>
                {section.title}
              </Text>
            </View>
            <View className="flex-row flex-wrap justify-between px-4">
              {section.data.map((tech, idx) => (
                <TouchableOpacity
                  key={tech.name}
                  className="w-[47%] bg-[#181c1f] mb-4 rounded-2xl border border-[#232D3F] shadow-md"
                  style={{ maxWidth: "48%", minHeight: 140, elevation: 2, shadowColor: '#0cb9f2', shadowOpacity: 0.06, shadowRadius: 8 }}
                  onPress={() => navigation.navigate("TechDetailScreen", { tech })}
                  activeOpacity={0.88}
                >
                  <View className="flex flex-col gap-3 pb-3 pt-4 items-center">
                    <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#232D3F', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                      <TechIcon name={tech.name} size={40} color="#0cb9f2" />
                    </View>
                    <Text className="text-white text-base font-semibold text-center mb-1" numberOfLines={1}>{tech.name || 'Unknown'}</Text>
                    <Text className="text-[#a2afb3] text-xs text-center px-1" numberOfLines={2}>{tech.desc || ''}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {i < TECH_SECTIONS.length - 1 && (
              <View style={{ height: 1.5, backgroundColor: '#232D3F', marginHorizontal: 24, marginTop: 18, borderRadius: 1 }} />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}