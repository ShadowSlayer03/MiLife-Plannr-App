import NamePrompt from "@/components/NamePrompt";
import queryClient from "@/config/QueryClient";
import { useGeneratedList } from "@/hooks/useGeneratedList";
import { savePlan } from "@/lib/queries";
import { Product } from "@/types/Product";
import { AntDesign } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function GeneratedListPage() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: "75BV" | "35BV" }>();
  const { budget, adjustment, list75BV, list35BV, setList75BV, setList35BV } = useGeneratedList();
  const [showPrompt, setShowPrompt] = useState(false);

  const reqList = type === "75BV" ? list75BV : list35BV;
  const setList = type === "75BV" ? setList75BV : setList35BV;

  const totalPrice = reqList.reduce(
    (acc, item) => acc + (item.price * (item.quantity ?? 1)),
    0
  );
  const totalBV = reqList.reduce(
    (acc, item) => acc + ((item.bv ?? 75) * (item.quantity ?? 1)),
    0
  );

  const { mutate: savePlanMutation, isPending } = useMutation({
    mutationFn: savePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      router.replace("/my-plans");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Failed to save plan",
        text2: error.message,
        position: "top",
      });
    },
  });

  const handleAdd = (product: Product) => {
    setList(
      reqList.map((p) =>
        p.id === product.id
          ? { ...p, quantity: (p.quantity || 1) + 1 }
          : p
      )
    );
  };

  const handleSub = (product: Product) => {
    setList(
      reqList.map((p) =>
        p.id === product.id && (p.quantity || 1) > 1
          ? { ...p, quantity: (p.quantity || 1) - 1 }
          : p
      )
    );
  };

  const handleLongPress = (product: Product) => {
    Alert.alert(
      "Remove Item?",
      `Do you want to remove ${product.name} from the list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setList(reqList.filter((p) => p.id !== product.id)),
        },
      ]
    );
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
      savePlanMutation({
        name: name || "New Purchase Plan",
        budget,
        adjustment,
        products: combinedList,
      });
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
  };

  const handleGenerateAgain = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl text-center font-bricolage-bold my-4">
        Generated List ({type})
      </Text>

      {/* 🟣 Summary Section */}
      <View className="bg-mi-purple rounded-xl shadow-lg px-4 py-3 mb-5">
        <View className="flex-row justify-between">
          <Text className="text-white font-bricolage-semibold">
            Total Price
          </Text>
          <Text className="text-white font-bricolage-bold">
            ₹{totalPrice}
          </Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-white font-bricolage-semibold">
            Total BV
          </Text>
          <Text className="text-white font-bricolage-bold">{totalBV}</Text>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={reqList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            className="bg-white p-4 mb-3 rounded-xl shadow-sm flex-row justify-between items-center"
          >
            <View className="flex-1">
              <Text className="text-[16px] font-bricolage-semibold text-gray-800">
                {item.name}
              </Text>
              <View className="flex-row gap-3 mt-0 w-[100%]">
                <Text className="text-sm text-gray-500 font-kanit">
                  ₹{item.price}
                </Text>
                <Text className="text-sm text-gray-500 font-kanit">
                  {item.bv ?? 75} BV
                </Text>
              </View>
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => handleSub(item)}
                className="bg-gray-200 p-2 rounded-full"
              >
                <AntDesign name="minus" size={18} color="#602c66" />
              </TouchableOpacity>

              <Text className="w-6 text-center font-kanit text-lg">
                {item.quantity || 1}
              </Text>

              <TouchableOpacity
                onPress={() => handleAdd(item)}
                className="bg-mi-purple p-2 rounded-full"
              >
                <AntDesign name="plus" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10 font-kanit">
            No items generated yet.
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
          disabled={isPending}
        >
          <Text className="text-center text-white font-bricolage-semibold text-lg">
            {type === "75BV" ? "Continue" : isPending ? "Saving..." : "Save"}
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
}
