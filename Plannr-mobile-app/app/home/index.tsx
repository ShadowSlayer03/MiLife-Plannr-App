import ProductList from "@/components/ProductList";
import ShoppingPlanner from "@/components/ShoppingPlanner";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import { Avatar, Menu } from "react-native-paper";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Toast from "react-native-toast-message";
import { Product } from "@/types/Product";
import UserMenu from "@/components/UserMenu";

export default function Home() {
  const [selected, setSelected] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { type, budget, adjustment } = useLocalSearchParams();
  const budgetStr = Array.isArray(budget) ? budget[0] : budget;
  const adjustmentStr = Array.isArray(adjustment) ? adjustment[0] : adjustment;
  const typeStr = Array.isArray(type) ? type[0] : type;
  const safeType = typeStr as "75BV" | "35BV";

  const budgetNum = parseInt(budgetStr || "0", 10);
  const adjustmentNum = parseInt(adjustmentStr || "0", 10);

  const total = useMemo(
    () => selected.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0),
    [selected]
  );

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


  const handleAdd = (product: Product) => {
    const existing = selected.find((p) => p.id === product.id);
    const newTotal = total + product.price;

    if (newTotal > budgetNum + adjustmentNum) {
      Toast.show({
        type: "error",
        text1: "Budget exceeded!",
        position: "top",
        visibilityTime: 1500,
      });
      return;
    }

    if (existing) {
      setSelected((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        )
      );
    } else {
      setSelected((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleSubtract = (product: Product) => {
    const existing = selected.find((p) => p.id === product.id);
    if (!existing) return;

    if ((existing.quantity || 1) > 1) {
      setSelected((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) - 1 } : p
        )
      );
    } else {
      setSelected((prev) => prev.filter((p) => p.id !== product.id));
    }
  };


  // Dropdown menu state
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const router = useRouter();

  const handleCreateNewProductClick = async () => {
    closeMenu();
    router.push("/new-product");
  }

  const handleMyPlansClick = () => {
    closeMenu();
    router.push("/my-plans");
  }

  const handleProfileClick = () => {
    closeMenu();
    router.push("/profile");
  }

  const handleSignOutClick = async () => {
    closeMenu();
    const { error } = await supabase.auth.signOut();
    if (error) {
      Toast.show({
        type: "error",
        text1: "Signout failed",
        text2: error.message || "Error: User signout failed",
        text1Style: { color: "red" },
        position: "top",
        visibilityTime: 1500,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: "Signed out",
      text2: "User signed out successfully",
      text1Style: { color: "green" },
      position: "top",
      visibilityTime: 1500,
    });

    setTimeout(() => {
      router.replace("/login");
    }, 1500)
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-gray-100 px-6">
        {/* Header with title + avatar menu */}
        <View className="flex-row items-center justify-between my-4">
          <BackButton xPos="left-0" yPos="-top-5" />
          <Text className="text-2xl font-bricolage-bold ml-8">Mi Plannr</Text>

          <UserMenu user={user} />
        </View>

        {/* Products */}
        <ProductList
          onAdd={handleAdd}
          onSub={handleSubtract}
          selected={selected}
          type={safeType}
        />

        {/* Shopping planner summary */}
        <ShoppingPlanner
          selected={selected}
          budget={budgetNum}
          adjustment={adjustmentNum}
          type={safeType}
        />
      </SafeAreaView>
    </>
  );
}
