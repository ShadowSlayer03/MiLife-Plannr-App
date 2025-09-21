import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Instructions() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-gray-100 px-6">
            <ScrollView className="py-[20%]">
                <Text className="text-3xl font-bricolage-bold text-mi-purple text-center mb-10">
                    How to use Mi Plannr
                </Text>

                {/* Step 1 */}
                <View className="mb-6">
                    <Text className="text-xl font-bricolage-semibold mb-2">1. Set your Budget</Text>
                    <Text className="text-gray-600 font-kanit">
                        Enter your total budget and an adjustment value (small extra margin). {"\n"}
                        The adjustment value is kept to determine the maximum amount for which purchase can be made.
                        Example: ₹5000 + ₹500.
                    </Text>
                </View>

                {/* Step 2 */}
                <View className="mb-6">
                    <Text className="text-xl font-bricolage-semibold mb-2">2. Choose Products</Text>
                    <Text className="text-gray-600 font-kanit">
                        Browse the list of products and add items you want.
                        You can only add until your budget limit is reached.
                    </Text>
                </View>

                {/* Step 3 */}
                <View className="mb-6">
                    <Text className="text-xl font-bricolage-semibold mb-2">3. Generate Bill</Text>
                    <Text className="text-gray-600 font-kanit">
                        Once you’ve picked a few products, tap on 'Generate'.
                        We’ll automatically fill the remaining items so the total matches your budget (within adjustment).
                    </Text>
                </View>

                {/* Step 4 */}
                <View className="mb-10">
                    <Text className="text-xl font-bricolage-semibold mb-2">4. Review & Save</Text>
                    <Text className="text-gray-600 font-kanit">
                        Check your final bill, make changes if needed, and save your plan for later.
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => router.push(`/budget-setup/75BV`)}
                    className="bg-mi-purple py-2 rounded-full items-center shadow-lg"
                >
                    <Text className="text-white font-bricolage-semibold text-lg">Set My Budget</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
