import { useGeneratedList } from "@/hooks/useGeneratedList";
import { fetchProducts } from "@/lib/queries";
import { Product } from "@/types/Product";
import { createAndStoreList } from "@/utils/createAndStoreList";
import { truncateText } from "@/utils/truncateText";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

interface ShoppingPlanner {
  selected: Product[];
  budget: number;
  adjustment: number;
  type: "75BV" | "35BV";
};

const ShoppingPlanner: React.FC<ShoppingPlanner> = ({
  selected,
  budget,
  adjustment,
  type
}) => {
  const router = useRouter();
  const total = selected.reduce((acc, p) => acc + p.price * (p.quantity || 1), 0);
  const maxBudget = budget + adjustment;
  const { setList75BV, setList35BV, setBudget, setAdjustment } = useGeneratedList();
  const setList = (type === "75BV") ? setList75BV : setList35BV;

  const {
    data: products = [],
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  if (isError) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error.message,
      position: "bottom",
      visibilityTime: 2000,
    });
  }

  const handleGenerateListClick = () => {
    createAndStoreList({ products, selected, budget, adjustment, type, setList, setBudget, setAdjustment });

    router.push({
      pathname: "/generated-list/[type]",
      params: {
        type: type,
        bgt: String(budget),
        adj: String(adjustment),
      },
    });
  };



  return (
    <View className="bg-mi-purple rounded-t-2xl shadow-lg p-4 mt-3">
      {/* Budget Info */}
      <View className="flex-row justify-between mb-3">
        <Text className="text-white font-bricolage-semibold">Budget</Text>
        <Text className="text-white font-bricolage-semibold">
          ₹{budget} (+₹{adjustment})
        </Text>
      </View>

      {/* Items List */}
      <View style={{ maxHeight: 1 * 65 }}>
        {/* 3 rows * ~50px row height, adjust if needed */}
        <FlatList
          data={selected}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-base font-kanit text-white">{truncateText(item.name, 20)} X {item.quantity}</Text>
              <Text className="text-base font-medium font-kanit text-white">
                ₹{item.price}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 py-4 font-kanit">
              No items added yet
            </Text>
          }
        />
      </View>

      {/* Total Section */}
      <View className="mt-4 bg-gray-100 rounded-xl px-4 py-3">
        <View className="flex-row justify-between">
          <Text className="text-lg font-semibold text-gray-700 font-bricolage-bold">Total</Text>
          <Text
            className={`text-lg font-bricolage-bold text-green-600`}
          >
            ₹{total}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="w-full h-2 bg-gray-300 rounded-full mt-2">
          <View
            className={`h-2 rounded-full ${total <= maxBudget ? "bg-green-500" : "bg-red-500"
              }`}
            style={{
              width: `${Math.min((total / maxBudget) * 100, 100)}%`,
            }}
          />
        </View>
        <TouchableOpacity
          className="bg-mi-purple py-2 px-2 mt-4 w-md rounded-xl shadow-md active:opacity-60"
          onPress={() => {
            router.push({
              pathname: "/loading",
              params: {
                type: type,
                bgt: String(budget),
                adj: String(adjustment),
                selected: JSON.stringify(selected),
              },
            });
          }}
        >
          <Text className="text-white text-center font-kanit font-semibold text-[15px]">
            Generate List
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShoppingPlanner;
