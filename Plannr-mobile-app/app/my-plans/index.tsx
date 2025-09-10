import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPlans } from "@/lib/queries";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import UserMenu from "@/components/UserMenu";
import BackButton from "@/components/BackButton";

const MyPlans = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const extractUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data.user);
      }
    };
    extractUser();
  }, []);

  const { data: plans = [], isLoading, isError, error } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  if (isLoading) {
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
      text2: error.message,
      position: "bottom",
      visibilityTime: 2000,
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
        <Text className="text-gray-500 text-[17px] text-center mt-5 font-kanit">No plans created yet.</Text>
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
              <Text className="text-sm text-gray-500 font-kanit">Created: {new Date(item.created_at).toLocaleDateString()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default MyPlans;
