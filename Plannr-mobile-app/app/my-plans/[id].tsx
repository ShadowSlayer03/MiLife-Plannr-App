import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import formatDate from "@/utils/formatDate";
import { Plan } from "@/types/Plan";
import { fetchPlan } from "@/lib/queries";
import BackButton from "@/components/BackButton";
import ExportButton from "@/components/ExportButton";

const PlanDetail = () => {
  const { id } = useLocalSearchParams();

  const {
    data: plan,
    isLoading,
    isError,
    error,
  } = useQuery<Plan | null, Error>({
    queryKey: ["plan", id],
    queryFn: () => fetchPlan(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#602c66" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600 font-kanit">Error: {error.message}</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-700 font-kanit">Plan not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-6">
      <BackButton xPos="left-0" yPos="-top-4" />
      {/* Header Card */}
      <View className="bg-mi-purple rounded-2xl shadow-lg p-5 mt-8">
        <Text className="text-2xl font-bricolage-bold text-white mb-2">
          {plan.name}
        </Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-100 font-kanit">Budget</Text>
          <Text className="text-sm font-kanit-semibold text-gray-300">
            ₹{plan.budget}
          </Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-100 font-kanit">Adjustment</Text>
          <Text className="text-sm font-kanit-semibold text-gray-300">
            ₹{plan.adjustment}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-sm text-gray-100 font-kanit">Created</Text>
          <Text className="text-sm text-gray-200 font-kanit-semibold">
            {formatDate(plan.created_at)}
          </Text>
        </View>
      </View>

      <ExportButton plan={plan} />

      {/* Products */}
      <Text className="text-xl font-bricolage-semibold mb-3 text-gray-800">
        Products
      </Text>
      <FlatList
        data={plan.products}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View className="mb-3 p-4 rounded-xl bg-white shadow-md border border-gray-200">
            <Text
              className="font-kanit-semibold text-gray-900 text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <Text className="text-sm text-gray-600 font-kanit">
              Sub-Brand: {item.subbrand}
            </Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-sm text-gray-700 font-kanit">
                Price: ₹{item.price}
              </Text>
              <Text className="text-sm text-gray-700 font-kanit">
                Qty: {item.quantity}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-4 font-kanit">
            No products in this plan
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default PlanDetail;
