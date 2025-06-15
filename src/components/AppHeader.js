import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";

export default function AppHeader() {
  return (
    <View className="flex-row items-center justify-between px-4 pt-6 pb-2 bg-[#121516]">
      <View className="size-12 items-center justify-center">
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZSefA3wU9gt3EaTBz0RjPEf06zLR45NAl2l1rMkhM90PCIwvSrJmh6v0a788urRT3kDUDoGJgVf0etvigg8GG9I-QLD2uw27-HDCrWb2MhGz11Z57NjynKgb1HOGwas1yZQY3NGrHmA43xb8n2gBtTIFIIhbeiFordwVvuCS-XbPfLtZk0mr92hjYMnioWSlVgIr7KQDW2OuqeR3wupseZ4nsrCBLXJban90LECk_gL5M7EvHcD2qv0qIqVMvBIx7o12V2l_tEIAE",
          }}
          className="size-12 rounded-xl"
        />
      </View>
      <Text className="text-white text-xl font-bold">OutGrow</Text>
      <TouchableOpacity className="size-12 items-center justify-center">
        <Text className="text-2xl">🔍</Text>
      </TouchableOpacity>
    </View>
  );
}
