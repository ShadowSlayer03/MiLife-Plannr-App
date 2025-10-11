import React, { useState } from "react";
import { Alert, Pressable } from "react-native";
import { Avatar, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import Toast from "react-native-toast-message";
import { User } from "@supabase/supabase-js";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserMenuProps {
  user: User | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const adminEmail = Constants.expoConfig?.extra?.adminEmail;

  if (!adminEmail) {
    Alert.alert("Admin Email not set!");
    console.error("ADMIN_EMAIL env variable not found.")
  }

  const handleCreateNewProductClick = () => {
    closeMenu();
    router.push("/new-product");
  };

  const handleMyPlansClick = () => {
    closeMenu();
    router.push("/my-plans");
  };

  const handleProfileClick = () => {
    closeMenu();
    router.push("/profile");
  };

  const handleLangChange = async () => {
    closeMenu();
    await AsyncStorage.removeItem("user_lang");
    router.push("/language");
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
    }, 1500);
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Pressable onPress={openMenu}>
          <Avatar.Text
            size={40}
            label={user?.email ? user.email[0].toUpperCase() : "?"}
            style={{ backgroundColor: "#602c66" }}
            color="#fff"
          />
        </Pressable>
      }
    >
      <Menu.Item
        onPress={handleMyPlansClick}
        title="My Plans"
        titleStyle={{ fontFamily: "bricolage-bold", fontSize: 16 }}
      />
      <Menu.Item
        onPress={handleProfileClick}
        title="Profile"
        titleStyle={{ fontFamily: "bricolage-bold", fontSize: 16 }}
      />
      {user?.email === adminEmail && (
        <Menu.Item
          onPress={handleCreateNewProductClick}
          title="Add Product"
          titleStyle={{ fontFamily: "bricolage-bold", fontSize: 16 }}
        />
      )}
      <Menu.Item
        onPress={handleLangChange}
        title="Change Language"
        titleStyle={{ fontFamily: "bricolage-bold", fontSize: 16 }}
      />
      <Menu.Item
        onPress={handleSignOutClick}
        title="Sign Out"
        titleStyle={{ fontFamily: "bricolage-bold", fontSize: 16 }}
      />
    </Menu>
  );
}
