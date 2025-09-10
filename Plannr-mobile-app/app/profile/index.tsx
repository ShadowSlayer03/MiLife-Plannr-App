import React from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import formatDate from "@/utils/formatDate";
import { fetchProfile } from "@/lib/queries";
import BackButton from "@/components/BackButton";

export type ProfileData = {
  user: User;
  role: string | null;
};

const Profile = () => {
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery<ProfileData | null, Error>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600 font-kanit">
          Error: {error.message}
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-700">No user logged in</Text>
      </View>
    );
  }

  const { user, role } = profile;
  const initials = user.email?.[0].toUpperCase() || "U";

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-6">
      <BackButton xPos="left-0" yPos="-top-2" />
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        {/* Avatar */}
        <Avatar.Text
          size={80}
          label={initials}
          style={{ backgroundColor: "#602c66" }}
          color="#fff"
        />

        {/* Basic Info */}
        <Text className="mt-4 text-2xl font-bricolage-bold text-gray-800">
          {user.email}
        </Text>
        <Text className="mt-1 text-base text-gray-600">ID: {user.id}</Text>

        {/* Metadata */}
        <View className="mt-6 w-full bg-white rounded-2xl shadow p-4">
          <Text className="text-lg font-kanit-semibold mb-4 text-gray-700">
            Profile Details
          </Text>

          <Text className="text-sm text-gray-600 font-kanit mb-2">
            Role: {role}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            Provider: {user.app_metadata?.provider}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            Status: {user.role}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            Created At: {formatDate(user.created_at)}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            Confirmed At: {formatDate(user.confirmed_at)}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            Last Sign In: {formatDate(user.last_sign_in_at)}
          </Text>

          <Text className="text-lg font-kanit-semibold text-gray-700 my-4">
            Verification
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            Email Verified: {user.user_metadata?.email_verified ? "✅ Yes" : "❌ No"}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            Phone Verified: {user.user_metadata?.phone_verified ? "✅ Yes" : "❌ No"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
