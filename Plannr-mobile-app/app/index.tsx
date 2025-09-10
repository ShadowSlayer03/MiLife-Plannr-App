import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#602c66" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/signup" />;
}