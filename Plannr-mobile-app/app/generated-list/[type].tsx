import CustomModal from "@/components/CustomModal";
import NamePrompt from "@/components/NamePrompt";
import queryClient from "@/config/QueryClient";
import { brands35BV, brands75BV } from "@/constants/Brands";
import { GeneratedListPageContent } from "@/constants/Content";
import { useGeneratedList } from "@/hooks/useGeneratedList";
import { useTranslatePage } from "@/hooks/useTranslatePage";
import { fetchProducts, savePlan } from "@/lib/queries";
import { Product } from "@/types/Product";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function GeneratedListPage() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: "75BV" | "35BV" }>();
  const { budget, adjustment, list75BV, list35BV, setList75BV, setList35BV } =
    useGeneratedList();

  const [showPrompt, setShowPrompt] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Replace states
  const [replaceProduct, setReplaceProduct] = useState<Product | null>(null);
  const [availableItems, setAvailableItems] = useState<Product[]>([]);
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  const { translated, translating } = useTranslatePage(GeneratedListPageContent);

  const reqList = type === "75BV" ? list75BV : list35BV;
  const setList = type === "75BV" ? setList75BV : setList35BV;

  const totalPrice = reqList.reduce(
    (acc, item) => acc + (item.price * (item.quantity ?? 1)),
    0
  );
  const totalBV = reqList.reduce(
    (acc, item) => acc + ((item.bv ?? 75) * (item.quantity ?? 1)),
    0
  );

  const filteredTotalBVLabel = translated.totalBVLabel.replace(/{BV}/g, "BV");

  const {
    data: products = [],
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });


  if (isError) {
    Toast.show({
      type: "error",
      text1: translated.errorTitleText,
      text2: error.message,
      position: "bottom",
      visibilityTime: 2000,
    });
  }

  const reqBrandArray = type === "75BV" ? brands75BV : brands35BV;
  const productsBasedonBV = products.filter((p) => reqBrandArray.includes(p.subbrand));

  const { mutate: savePlanMutation, isPending } = useMutation({
    mutationFn: savePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      router.replace("/my-plans");
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: translated.saveErrorTitle,
        text2: error.message,
        position: "top",
      });
    },
  });

  const handleAdd = (product: Product) => {
    setList(
      reqList.map((p) =>
        p.id === product.id
          ? { ...p, quantity: (p.quantity || 1) + 1 }
          : p
      )
    );
  };

  const handleSub = (product: Product) => {
    setList(
      reqList.map((p) =>
        p.id === product.id && (p.quantity || 1) > 1
          ? { ...p, quantity: (p.quantity || 1) - 1 }
          : p
      )
    );
  };

  const handleClosePress = (product: Product) => {
    setSelectedProduct(product);
    setShowRemoveModal(true);
  };

  const handleNextPress = () => {
    if (type === "75BV" && list75BV.length > 0) {
      setShowModal(true);
    } else {
      setShowPrompt(true);
    }
  };

  const onSaveList = (name: string) => {
    const combinedList = [...list75BV, ...list35BV];
    savePlanMutation({
      name: name || "New Purchase Plan",
      budget,
      adjustment,
      products: combinedList,
    });
  };

  const handleGenerateAgain = () => router.back();

  // 🔹 Replace Handler
  const handleReplaceClick = (item: Product) => {
    setReplaceProduct(item);
    const pool = productsBasedonBV.filter(
      (p) => !reqList.some((r) => r.id === p.id) && p.id !== item.id
    );
    setAvailableItems(pool);
    setShowReplaceModal(true);
  };

  if (translating) {
    return (
      <View className="flex-1 justify-center items-center space-y-3">
        <ActivityIndicator size="large" color="#602c66" />
        <Text className="text-lg font-kanit">{translated.loadingMessage}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl text-center font-bricolage-bold my-4">
        {translated.pageTitle} ({type})
      </Text>

      {/* 🟣 Summary Section */}
      <View className="bg-mi-purple rounded-xl shadow-lg px-4 py-3 mb-5">
        <View className="flex-row justify-between">
          <Text className="text-white font-bricolage-semibold">
            {translated.totalPriceLabel}
          </Text>
          <Text className="text-white font-bricolage-bold">₹{totalPrice}</Text>
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-white font-bricolage-semibold">
            {filteredTotalBVLabel}
          </Text>
          <Text className="text-white font-bricolage-bold">{totalBV}</Text>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={reqList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-3 rounded-xl shadow-sm relative">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => handleClosePress(item)}
              className="absolute top-1 right-2"
            >
              <Text className="text-sm font-bricolage-semibold text-gray-500">
                ✕
              </Text>
            </TouchableOpacity>

            <View className="flex-1">
              <Text className="text-[16px] font-bricolage-semibold text-gray-800">
                {item.name}
              </Text>
              <View className="flex-row gap-3 mt-0 w-[100%]">
                <Text className="text-sm text-gray-500 font-kanit">
                  ₹{item.price}
                </Text>
                <Text className="text-sm text-gray-500 font-kanit">
                  {item.bv ?? 75} BV
                </Text>
              </View>
            </View>

            {/* Quantity Controls */}
            <View className="flex-row items-center gap-2 mt-2">
              <TouchableOpacity
                onPress={() => handleSub(item)}
                className="bg-gray-200 p-2 rounded-full"
              >
                <AntDesign name="minus" size={14} color="#602c66" />
              </TouchableOpacity>

              <Text className="w-6 text-center font-kanit text-lg">
                {item.quantity || 1}
              </Text>

              <TouchableOpacity
                onPress={() => handleAdd(item)}
                className="bg-mi-purple p-2 rounded-full"
              >
                <AntDesign name="plus" size={14} color="white" />
              </TouchableOpacity>
            </View>

            {/* Replace Button */}
            <TouchableOpacity
              onPress={() => handleReplaceClick(item)}
              className="absolute bottom-3 right-4 bg-mi-purple p-2 rounded-full shadow-md"
            >
              <AntDesign name="swap" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-500 text-center mt-10 font-kanit">
            {translated.listEmptyText}
          </Text>
        }
      />

      {/* Buttons */}
      <View className="flex-row justify-between mt-6">
        <TouchableOpacity
          className="flex-1 justify-center bg-gray-300 py-3 rounded-full mr-2 shadow-md active:opacity-70"
          onPress={handleGenerateAgain}
        >
          <Text className="text-center text-gray-800 font-bricolage-semibold text-lg">
            {translated.generateAgain}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 justify-center bg-mi-purple py-3 rounded-full ml-2 shadow-md active:opacity-70"
          onPress={handleNextPress}
          disabled={isPending}
        >
          <Text className="text-center text-white font-bricolage-semibold text-lg">
            {type === "75BV"
              ? translated.continueText
              : isPending
              ? translated.savingText
              : translated.saveText}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Save Modal */}
      {showModal && (
        <CustomModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          title={translated.whatNextTitle}
          description={translated.whatNextDescription}
          buttons={[
            {
              label: translated.generate35BVText,
              onPress: () => router.replace("/budget-setup/35BV"),
              bgColor: "bg-mi-purple",
            },
            {
              label: translated.submitDirectlyText,
              onPress: () => setShowPrompt(true),
              bgColor: "bg-gray-100",
              textColor: "text-gray-800",
            },
          ]}
        />
      )}

      {/* Remove Modal */}
      {showRemoveModal && selectedProduct && (
        <CustomModal
          visible={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
          title={`${translated.removeText} ${selectedProduct.name}?`}
          description={translated.removeDescription}
          buttons={[
            {
              label: translated.removeText,
              onPress: () =>
                setList(reqList.filter((p) => p.id !== selectedProduct.id)),
              bgColor: "bg-red-500",
            },
          ]}
        />
      )}

      {/* Replace Modal */}
      {showReplaceModal && replaceProduct && (
        <CustomModal
          visible={showReplaceModal}
          onClose={() => setShowReplaceModal(false)}
          title={`Replace ${replaceProduct.name}`}
          description="Select an item from the pool to replace this one."
          content={
            <FlatList
              data={availableItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setList(
                      reqList.map((p) =>
                        p.id === replaceProduct.id ? item : p
                      )
                    );
                    setShowReplaceModal(false);
                    Toast.show({
                      type: "success",
                      text1: `Replaced ${replaceProduct.name} with ${item.name}`,
                    });
                  }}
                  className="p-3 bg-gray-100 mb-2 rounded-lg"
                >
                  <Text className="text-gray-800 font-bricolage-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-gray-500 text-sm font-kanit-semibold">
                    ₹{item.price}
                  </Text>
                </TouchableOpacity>
              )}
            />
          }
        />
      )}

      <NamePrompt
        visible={showPrompt}
        onClose={() => setShowPrompt(false)}
        onSubmit={onSaveList}
      />
    </SafeAreaView>
  );
}
