import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import queryClient from "@/config/QueryClient";
import { useTranslatePage } from "@/hooks/useTranslatePage";
import { NewProductPageContent } from "@/constants/Content";

const NewProduct = () => {
  const [name, setName] = useState("");
  const [subbrand, setSubbrand] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { translated, translating } = useTranslatePage(NewProductPageContent)

  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!error) {
        setIsAdmin(profile?.role === "admin");
      }
    };

    checkAdmin();
  }, []);

  const handleAddProduct = async () => {
    if (!name || !subbrand || !price) {
      Toast.show({
        type: "error",
        text1: translated.validationText,
        text2: translated.fillAllFieldsText,
        position: "top",
        visibilityTime: 1500,
      });
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Toast.show({
        type: "error",
        text1: translated.validationText,
        text2: translated.invalidPriceText,
        position: "top",
        visibilityTime: 1500,
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("products").insert([
      { name, subbrand, price: parsedPrice },
    ]);

    setLoading(false);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "top",
        visibilityTime: 1500,
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['products'] });

      Toast.show({
        type: "success",
        text1: translated.successText,
        text2: translated.addProductSuccessText,
        position: "top",
        visibilityTime: 1500,
      });

      setTimeout(() => {
        router.back();
      }, 1500);
    }
  };

  if (translating) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9333EA" />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg font-kanit-semibold text-gray-700">
          {translated.notAuthorizedTitle}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-6">
      <Text className="text-2xl font-bricolage-bold text-gray-800 mb-6 text-center">
        {translated.addProductText}
      </Text>

      <View className="flex-1 justify-center">
        {/* Name Input */}
        <Text className="text-gray-700 font-kanit mb-2">{translated.nameLabel}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={translated.namePlaceholder}
          placeholderTextColor="#aaa"
          className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-xl px-4 py-3 mb-4 text-gray-800 font-kanit shadow-sm"
        />

        {/* Subbrand Input */}
        <Text className="text-gray-700 font-kanit mb-2">{translated.subbrandLabel}</Text>
        <TextInput
          value={subbrand}
          onChangeText={setSubbrand}
          placeholder={translated.subbrandPlaceholder}
          placeholderTextColor="#aaa"
          className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-xl px-4 py-3 mb-4 text-gray-800 font-kanit shadow-sm"
        />

        {/* Price Input */}
        <Text className="text-gray-700 font-kanit mb-2">{translated.priceLabel}</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder={translated.pricePlaceholder}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
          className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-xl px-4 py-3 mb-6 text-gray-800 font-kanit shadow-sm"
        />

        {/* Submit Button */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleAddProduct}
          className="bg-mi-purple py-3 rounded-xl items-center shadow-md"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-kanit-semibold text-lg">
              {translated.pageTitle}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NewProduct;
