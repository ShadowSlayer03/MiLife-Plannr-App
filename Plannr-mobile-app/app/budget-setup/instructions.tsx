import { InstructionsPageContent } from "@/constants/Content";
import { useTranslatePage } from "@/hooks/useTranslatePage";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Instructions() {
    const router = useRouter();
    const { translated, translating } = useTranslatePage(InstructionsPageContent);

    if (translating) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#602c66" />
                <Text className="text-lg font-kanit mt-3">Translating...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text className="text-2xl font-bricolage-bold text-mi-purple text-center my-10">
                    Mi Plannr {translated.pageTitlePrefix} 
                </Text>

                {translated.steps.map((step, index) => (
                    <View
                        key={index}
                        className="bg-white rounded-2xl p-5 mb-6 shadow-md"
                    >
                        <Text className="text-xl font-bricolage-semibold mb-2">
                            {step.icon} {index + 1}. {step.title}
                        </Text>
                        <Text className="text-gray-600 font-kanit leading-relaxed">
                            {step.description}
                        </Text>
                    </View>
                ))}

                <View className="my-8">
                    <TouchableOpacity
                        onPress={() => router.push(`/budget-setup/75BV`)}
                        className="flex bg-mi-purple p-3 rounded-full items-center shadow-md mb-4"
                    >
                        <Text className="text-white font-bricolage-semibold text-lg text-center">
                            75BV {translated.setBVText}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push(`/budget-setup/35BV`)}
                        className="flex bg-mi-purple p-3 rounded-full items-center shadow-md"
                    >
                        <Text className="text-white font-bricolage-semibold text-lg text-center">
                            35BV {translated.setBVText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
