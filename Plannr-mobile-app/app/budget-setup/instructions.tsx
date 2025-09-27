import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Instructions() {
    const router = useRouter();

    const steps = [
        {
            title: "Set your Budget",
            description:
                "Enter your total budget and an adjustment value (small extra margin).\nExample: ₹5000 + ₹500.",
            icon: "💰",
        },
        {
            title: "Choose Products",
            description:
                "Browse the list of products and add items you want.\nYou can only add until your budget limit is reached.",
            icon: "🛍️",
        },
        {
            title: "Generate Bill",
            description:
                "Once you’ve picked a few products, tap on 'Generate'.\nWe’ll fill the remaining items so the total matches your budget (within adjustment).",
            icon: "🧾",
        },
        {
            title: "Review & Save",
            description:
                "Check your final bill, make changes if needed, and save your plan for later.",
            icon: "✅",
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text className="text-2xl font-bricolage-bold text-mi-purple text-center my-10">
                    How to use Mi Plannr
                </Text>

                {steps.map((step, index) => (
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
                        className="bg-mi-purple py-3 rounded-full items-center shadow-md mb-4"
                    >
                        <Text className="text-white font-bricolage-semibold text-lg">
                            Set 75BV Budget
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push(`/budget-setup/35BV`)}
                        className="bg-mi-purple py-3 rounded-full items-center shadow-md"
                    >
                        <Text className="text-white font-bricolage-semibold text-lg">
                            Set 35BV Budget
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
