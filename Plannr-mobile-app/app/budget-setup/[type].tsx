import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import Toast from "react-native-toast-message";

export default function BudgetSetup() {
  const [budget, setBudget] = useState<string>("");
  const [adjustment, setAdjustment] = useState<string>("");
  const { type } = useLocalSearchParams();

  const router = useRouter();

  // Allow only digits 0–9
  const handleBudgetChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, ""); // removes non-numeric chars
    setBudget(sanitized);
  };

  const handleAdjustmentChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, "");
    setAdjustment(sanitized);
  };

  const handleContinue = () => {
    if (!budget) {
      Toast.show({
        type: "error",
        text1: "Budget not set",
        text1Style: { color: "red" },
        position: "top",
        visibilityTime: 1500,
      });
      return;
    }
    router.push({
      pathname: "/home",
      params: {
        type: type || "75BV",
        budget: budget || "0",
        adjustment: adjustment || "0",
      },
    });
  };

  return (
    <>
      <BackButton />
      <SafeAreaView className="flex-1 bg-gray-100 px-8 justify-center">
        <Text className="text-3xl font-bricolage-bold text-center mb-8 text-mi-purple">
          Set Budget for {type} products
        </Text>

        {/* Budget Input */}
        <TextInput
          placeholder="Enter your budget"
          keyboardType="numeric"
          value={budget}
          onChangeText={handleBudgetChange}
          className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-full px-5 py-3 mb-4 shadow-md text-gray-800 font-kanit"
          placeholderTextColor="#aaa"
        />

        {/* Adjustment Input */}
        <TextInput
          placeholder="Enter adjustment"
          keyboardType="numeric"
          value={adjustment}
          onChangeText={handleAdjustmentChange}
          className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-full px-5 py-3 mb-6 shadow-md text-gray-800 font-kanit"
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity
          onPress={handleContinue}
          className="bg-mi-purple py-3 rounded-full items-center shadow-md"
        >
          <Text className="text-white font-bricolage-semibold text-lg">
            Continue
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
