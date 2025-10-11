import BackButton from "@/components/BackButton";
import { BudgetSetupPageContent } from "@/constants/Content";
import { useTranslatePage } from "@/hooks/useTranslatePage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function BudgetSetup() {
  const [budget, setBudget] = useState<string>("");
  const [adjustment, setAdjustment] = useState<string>("");
  const { type } = useLocalSearchParams<{ type: "75BV" | "35BV" }>();
  const router = useRouter();

  const { translated, translating } = useTranslatePage(BudgetSetupPageContent);

  const handleBudgetChange = (text: string) => setBudget(text.replace(/[^0-9]/g, ""));
  const handleAdjustmentChange = (text: string) => setAdjustment(text.replace(/[^0-9]/g, ""));

  const handleContinue = () => {
    if (!budget) {
      Toast.show({
        type: "error",
        text1: translated.budgetNotSetError,
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

  if (translating) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#602c66" />
        <Text className="text-lg font-kanit mt-2">{translated.pageTitle}</Text>
      </View>
    );
  }

  const formattedTitle = (translated.setBudgetForType || "").replace(/\{.*?\}/, type || "");

  return (
    <>
      <BackButton />
      <SafeAreaView className="flex-1 bg-gray-100 px-8 justify-center">
        <Text className="text-3xl font-bricolage-bold text-center mb-8 text-mi-purple">
          {formattedTitle}
        </Text>

        {/* Budget Input */}
        <TextInput
          placeholder={translated.budgetPlaceholder}
          keyboardType="numeric"
          value={budget}
          onChangeText={handleBudgetChange}
          className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-full px-5 py-3 mb-4 shadow-md text-gray-800 font-kanit"
          placeholderTextColor="#aaa"
        />

        {/* Adjustment Input */}
        <TextInput
          placeholder={translated.adjustmentPlaceholder}
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
            {translated.continueButton}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}
