import BackButton from "@/components/BackButton";
import ProductList from "@/components/ProductList";
import ShoppingPlanner from "@/components/ShoppingPlanner";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/Product";
import { User } from "@supabase/supabase-js";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function Home() {
  const { session, loading } = useAuth();
  const [selected, setSelected] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(session?.user ?? null);
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
    if (session) {
      setUser(session.user);
    }
  }, [session]);

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

  if (loading) 
    return (<View className="flex-1 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#602c66" />
            </View>
        );

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
