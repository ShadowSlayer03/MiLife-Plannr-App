import Icon from "@/components/Icon";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePathname } from 'expo-router';
import Toast from "react-native-toast-message";


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const router = useRouter();
  const pathname = usePathname();


  // Password strength check
  useEffect(() => {
    if (!password) {
      setPasswordError("");
      return;
    }

    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!lengthCheck) setPasswordError("Password must be at least 8 characters.");
    else if (!uppercaseCheck) setPasswordError("Include at least 1 uppercase letter.");
    else if (!lowercaseCheck) setPasswordError("Include at least 1 lowercase letter.");
    else if (!numberCheck) setPasswordError("Include at least 1 number.");
    else if (!specialCheck) setPasswordError("Include at least 1 special character.");
    else setPasswordError("");
  }, [password]);

  // Confirm password match check
  useEffect(() => {
    if (!confirmPassword) {
      setConfirmError("");
      return;
    }
    if (password !== confirmPassword) setConfirmError("Passwords do not match.");
    else setConfirmError("");
  }, [password, confirmPassword]);

  const signUp = async () => {
    if (!email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields are required!",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    if (passwordError || confirmError) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "All fields are required!",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      // Sign up user
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      // Get user and insert profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, role: "user" }]);

        if (profileError) throw profileError;
      }

      // Success
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Redirecting to login...",
        position: "top",
        visibilityTime: 2000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000)
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "top",
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push("/login")
  };

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <View className="flex justify-center items-center mb-10">
        <Icon width={70} height={70} />
      </View>

      <Text className="text-3xl font-bricolage-bold mb-8 text-center text-mi-purple">
        Signup
      </Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
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
          placeholder="Password"
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
          placeholder="Confirm Password"
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
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bricolage-semibold text-[16px]">Signup</Text>
        )}
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLoginClick}
        className="bg-gray-100 py-3 rounded-full items-center shadow-md"
        disabled={loading}
      >
        <Text className="text-gray-800 font-bricolage-semibold text-[16px]">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
