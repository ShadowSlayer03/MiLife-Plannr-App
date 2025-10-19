import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import Icon from "@/components/Icon";
import { SignupPageContent } from "@/constants/Content";
import Toast from "react-native-toast-message";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslatePage } from "@/hooks/useTranslatePage";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const { translated, translating } = useTranslatePage(SignupPageContent);
  const router = useRouter();

  useEffect(() => {
    if (!password) return setPasswordError("");

    const rules = [
      { check: password.length >= 8, msg: "Password must be at least 8 characters." },
      { check: /[A-Z]/.test(password), msg: "Include at least 1 uppercase letter." },
      { check: /[a-z]/.test(password), msg: "Include at least 1 lowercase letter." },
      { check: /[0-9]/.test(password), msg: "Include at least 1 number." },
      { check: /[!@#$%^&*(),.?\":{}|<>]/.test(password), msg: "Include at least 1 special character." },
    ];

    const invalid = rules.find(r => !r.check);
    setPasswordError(invalid ? invalid.msg : "");
  }, [password]);

  useEffect(() => {
    if (!confirmPassword) return setConfirmError("");
    setConfirmError(password === confirmPassword ? "" : "Passwords do not match.");
  }, [password, confirmPassword]);

  const signUp = async () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: translated.errorText,
        text2: translated.allFieldsAreRequiredText,
        position: "top",
        visibilityTime: 1500,
      });
      return;
    }

    if (passwordError || confirmError) {
      Toast.show({
        type: "error",
        text1: translated.errorText,
        text2: passwordError || confirmError,
        position: "top",
        visibilityTime: 1500,
      });
      return;
    }

    setLoading(true);
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const user = signUpData.user;
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, role: "user" }]);
        if (profileError) throw profileError;
      }

      Toast.show({
        type: "success",
        text1: translated.successText,
        text2: translated.successDesc,
        position: "top",
        visibilityTime: 1500,
      });

      setTimeout(() => router.push("/login"), 1500);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: translated.errorText,
        text2: error.message,
        position: "top",
        visibilityTime: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => router.push("/login");

  if (translating) {
    return (
      <View className="flex-1 justify-center items-center space-y-3">
        <ActivityIndicator size="large" color="#602c66" />
        <Text className="text-lg font-kanit text-black">
          {translated.loadingMessage}
        </Text>
      </View>
    );
  }

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
      {passwordError ? <Text className="text-red-500 mb-2">{passwordError}</Text> : null}

      {/* Confirm Password Input */}
      <View className="relative">
        <TextInput
          placeholder={translated.confirmPasswordPlaceholder}
          value={confirmPassword}
          secureTextEntry={!showConfirmPassword}
          onChangeText={setConfirmPassword}
          className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-full px-5 py-3 mb-8 shadow-md text-gray-800 font-kanit"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-4 top-3"
        >
          <Text className="font-kanit">{showConfirmPassword ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
      {confirmError ? <Text className="text-red-500 mb-2">{confirmError}</Text> : null}

      {/* Signup Button */}
      <TouchableOpacity
        onPress={signUp}
        className="bg-mi-purple py-3 rounded-full mb-4 items-center shadow-md"
        disabled={loading || translating}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text numberOfLines={1} className="text-white font-bricolage-semibold text-[16px] leading-4">
            {translated.signUpButtonText}
          </Text>
        )}
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLoginClick}
        className="bg-gray-100 py-3 rounded-full items-center shadow-md"
        disabled={loading || translating}
      >
        <Text numberOfLines={1} className="text-gray-800 font-bricolage-semibold text-[16px] leading-4">
          {translated.loginButtonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}