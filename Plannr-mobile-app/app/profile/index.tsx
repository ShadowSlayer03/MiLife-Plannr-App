import BackButton from "@/components/BackButton";
import { ProfilePageContent } from "@/constants/Content";
import { useTranslatePage } from "@/hooks/useTranslatePage";
import { fetchProfile } from "@/lib/queries";
import formatDate from "@/utils/formatDate";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const { translated, translating } = useTranslatePage(ProfilePageContent);

  if (isLoading || translating) {
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
          {translated.errorText} {error.message}
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-700">{translated.noUserLoggedInText}</Text>
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
        <Text className="mt-4 text-2xl text-center font-bricolage-bold text-gray-800">
          {user.email}
        </Text>
        <Text className="mt-1 text-base text-center text-gray-600">{translated.idText} {user.id}</Text>

        {/* Metadata */}
        <View className="mt-6 w-full bg-white rounded-2xl shadow p-4">
          <Text className="text-lg font-kanit-semibold mb-4 text-gray-700">
            {translated.profileDetailsText}
          </Text>

          <Text className="text-sm text-gray-600 font-kanit mb-2">
            {translated.roleText} {role}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            {translated.providerText} {user.app_metadata?.provider}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            {translated.statusText} {user.role}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            {translated.createdAtText} {formatDate(user.created_at)}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            {translated.confirmedAtText} {formatDate(user.confirmed_at)}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            {translated.lastSignInAt} {formatDate(user.last_sign_in_at)}
          </Text>

          <Text className="text-lg font-kanit-semibold text-gray-700 my-4">
            {translated.verificationText}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            {translated.emailVerfiedText} {user.user_metadata?.email_verified ? "✅ Yes" : "❌ No"}
          </Text>
          <Text className="text-sm text-gray-600 font-kanit mb-2">
            {translated.phoneVerifiedText} {user.user_metadata?.phone_verified ? "✅ Yes" : "❌ No"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
