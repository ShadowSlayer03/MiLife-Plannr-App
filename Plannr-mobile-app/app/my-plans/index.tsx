import BackButton from "@/components/BackButton";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { fetchPlans } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const MyPlans = () => {
  const router = useRouter();
  const { session, loading } = useAuth();

  const user = session?.user ?? null;

  const { data: plans = [], isLoading, isError, error } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  if (loading || isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#602c66" />
      </View>
    );
  }

  if (isError) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error?.message || "Failed to fetch plans",
      position: "bottom",
      visibilityTime: 1500,
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-6">
      {/* Header */}
      <View className="flex-row items-center justify-between my-4">
        <BackButton xPos="left-0" yPos="-top-5" />
        <Text className="text-2xl font-bricolage-bold ml-8">My Plans</Text>
        <UserMenu user={user} />
      </View>

      {plans.length === 0 ? (
        <Text className="text-gray-500 text-[17px] text-center mt-5 font-kanit">
          No plans created yet.
        </Text>
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mt-6 mb-5 p-4 rounded-2xl bg-white shadow-md"
              onPress={() => router.push(`/my-plans/${item.id}`)}
            >
              <Text className="text-lg font-kanit-semibold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-500 font-kanit">Budget: ₹{item.budget}</Text>
              <Text className="text-sm text-gray-500 font-kanit">
                Created: {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default MyPlans;
