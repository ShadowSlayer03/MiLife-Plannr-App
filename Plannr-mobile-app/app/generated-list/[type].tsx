import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGeneratedList } from "@/hooks/useGeneratedList";
import { Product } from "@/types/Product";
import { useSavePlan } from "@/hooks/useSavePlan";
import NamePrompt from "@/components/NamePrompt";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import queryClient from "@/config/QueryClient";

const GeneratedList = () => {
  const router = useRouter();
  const { list75BV, list35BV, budget, adjustment, setBudget, setAdjustment } = useGeneratedList();
  const { mutate: savePlan, isPending } = useSavePlan();
  const [showPrompt, setShowPrompt] = useState(false);

  const { type } = useLocalSearchParams<{ type: string; }>();

  const reqList =
    (type === "75BV" ? list75BV : list35BV);

  const totalPrice = reqList.reduce((acc, item) => acc + (item.price * (item.quantity ?? 1)), 0);
  const totalBV = reqList.reduce((acc, item) => acc + ((item.bv ?? 75) * (item.quantity ?? 1)), 0);

  const handleGenerateAgain = () => {
    router.back();
  };

  const handleNextPress = () => {
    if (type === "75BV" && list75BV.length > 0) {
      router.replace("/budget-setup/35BV");
    } else {
      setShowPrompt(true);
    }
  };

  const onSaveList = (name: string) => {
    if (list75BV.length > 0 && list35BV.length > 0) {
      const combinedList = [...list75BV, ...list35BV];
      savePlan(
        {
          name: name || "New Purchase Plan",
          budget,
          adjustment,
          products: combinedList,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plans'] });
            router.replace("/my-plans");
          },
        }
      );
    } else {
      Toast.show({
        type: "error",
        text1: "One or more lists could not be found",
        text2: "Redirecting to budget page...",
        position: "top",
        visibilityTime: 1500,
      });

      setTimeout(() => {
        router.replace("/budget-setup/75BV")
      }, 1500)
    }

  }

  const renderItem = ({ item }: { item: Product }) => (
    <View className="bg-white rounded-xl shadow-md p-4 mb-3 border border-gray-200">
      <Text className="text-base font-bricolage-semibold text-gray-800">
        {item.name}
      </Text>
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-gray-600 font-kanit-semibold">₹{item.price}</Text>
        <Text className="text-sm text-gray-600 font-kanit-semibold">{item.bv} BV</Text>
      </View>
      <View className="flex-row justify-between mt-1">
        <Text className="text-sm text-gray-500 font-kanit">Quantity: {item.quantity}</Text>
        <Text className="text-sm text-gray-500 font-kanit">
          Priority: {item.priorityweight}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-6">
      {/* Header */}
      <Text className="text-2xl font-bricolage-bold text-center text-mi-purple my-4">
        Generated {type} List
      </Text>

      {/* Summary */}
      <View className="bg-mi-purple rounded-xl shadow-lg px-4 py-3 mb-5">
        <View className="flex-row justify-between">
          <Text className="text-white font-bricolage-semibold">Total Price</Text>
          <Text className="text-white font-bricolage-bold">₹{totalPrice}</Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-white font-bricolage-semibold">Total BV</Text>
          <Text className="text-white font-bricolage-bold">{totalBV}</Text>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={reqList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10 font-kanit">
            No items in the generated list
          </Text>
        }
      />

      {/* Buttons */}
      <View className="flex-row justify-between mt-6">
        <TouchableOpacity
          className="flex-1 bg-gray-300 py-3 rounded-full mr-2 shadow-md active:opacity-70"
          onPress={handleGenerateAgain}
        >
          <Text className="text-center text-gray-800 font-bricolage-semibold text-lg">
            Generate Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-mi-purple py-3 rounded-full ml-2 shadow-md active:opacity-70"
          onPress={handleNextPress}
        >
          <Text className="text-center text-white font-bricolage-semibold text-lg">
            {type === "75BV" ? "Continue" : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <NamePrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
        onSubmit={onSaveList}
      />
    </SafeAreaView>
  );
};

export default GeneratedList;
