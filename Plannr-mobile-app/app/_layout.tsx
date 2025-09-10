import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import useCustomFonts from "@/hooks/useCustomFonts";
import Toast from "react-native-toast-message";
import toastConfig from "@/config/ToastConfig";
import { PaperProvider } from "react-native-paper";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/config/QueryClient";
import { GeneratedListProvider } from "@/context/GeneratedListContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <GeneratedListProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="login" />
              <Stack.Screen name="home" />
            </Stack>
            <Toast config={toastConfig} />
          </>
        </PaperProvider>
      </QueryClientProvider>
    </GeneratedListProvider>
  );
}
