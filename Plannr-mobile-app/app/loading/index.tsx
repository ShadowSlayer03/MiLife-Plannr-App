import { useGeneratedList } from "@/hooks/useGeneratedList";
import { fetchProducts } from "@/lib/queries";
import { createAndStoreList } from "@/utils/createAndStoreList";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const LoadingPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setList75BV, setList35BV, setBudget, setAdjustment } = useGeneratedList();

  useEffect(() => {
    const generateList = async () => {
      try {
        const type = params.type as "75BV" | "35BV";
        const budget = Number(params.bgt);
        const adjustment = Number(params.adj);
        const selected = JSON.parse(params.selected as string);
        const products = await fetchProducts();

        const setList = type === "75BV" ? setList75BV : setList35BV;

        await createAndStoreList({
          products,
          selected,
          budget,
          adjustment,
          type,
          setList,
          setBudget,
          setAdjustment,
        });

        router.replace(`/generated-list/${type}`);
      } catch (err: any) {
        console.error(err);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to generate list",
          position: "bottom",
        });
        router.back();
      }
    };

    generateList();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-mi-purple">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white font-kanit mt-4 text-xl">
        Generating your list...
      </Text>
    </View>
  );
};

export default LoadingPage;
