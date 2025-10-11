import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";
import { LoginPageContent } from "@/constants/Content";
import Toast from "react-native-toast-message";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTranslatePage } from "@/hooks/useTranslatePage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { translated, translating } = useTranslatePage(LoginPageContent);
  const router = useRouter();

  const signIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Email and password are required",
        position: "top",
        visibilityTime: 1500,
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      Toast.show({
        type: "error",
        text1: error?.message || "Login failed",
        text2: error ? undefined : "Invalid email or password",
        position: "top",
        visibilityTime: 1500,
      });
      setLoading(false);
      return;
    }

    Toast.show({
      type: "success",
      text1: "User logged in successfully!",
      position: "top",
      visibilityTime: 1500,
    });

    setLoading(false);
    setTimeout(() => router.push("/budget-setup/instructions"), 1500);
  };

  const handleSignUpClick = () => router.push("/signup");

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <View className="flex justify-center items-center mb-10">
        <Icon width={70} height={70} />
      </View>

      <Text className="text-3xl font-bricolage-bold mb-8 text-center text-mi-purple">
        {translated.heading}
      </Text>

      {/* Email Input */}
      <TextInput
        placeholder={translated.emailPlaceholder}
        value={email}
        onChangeText={setEmail}
        className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-full px-5 py-3 mb-4 shadow-md text-gray-800 font-kanit"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      {/* Password Input */}
      <View className="relative">
        <TextInput
          placeholder={translated.passwordPlaceholder}
          value={password}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-full px-5 py-3 mb-4 shadow-md text-gray-800 font-kanit"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-3"
        >
          <Text className="font-kanit">{showPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={signIn}
        className="bg-mi-purple py-3 rounded-full mb-4 items-center shadow-md"
        disabled={loading || translating}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bricolage-semibold text-[16px] leading-4">
            {translated.loginButtonText}
          </Text>
        )}
      </TouchableOpacity>

      {/* Signup Button */}
      <TouchableOpacity
        onPress={handleSignUpClick}
        className="bg-gray-100 py-3 rounded-full items-center shadow-md"
        disabled={loading || translating}
      >
        <Text className="text-gray-800 font-bricolage-semibold text-[16px] leading-4">
          {translated.signUpButtonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;