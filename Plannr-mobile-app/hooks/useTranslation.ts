import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useTranslationContext } from "../context/TranslationContext";
import { useCallback } from "react";
import { Alert } from "react-native";

export const useTranslation = () => {
  const { translatedLang } = useTranslationContext();
  const supabaseEdgeUrl = Constants.expoConfig?.extra?.supabaseEdgeUrl;
  const supabaseKey = Constants.expoConfig?.extra?.supabaseKey;

  if (!supabaseEdgeUrl || !supabaseKey) {
    Alert.alert("Edge URL or Anon Key not set!");
    throw new Error("SUPABASE_EDGE_URL or SUPABASE_KEY is missing");
  }

  const t = useCallback(
    async (object: Record<string, string>) => {
      // Always assume English source
      const cacheKey = `${JSON.stringify(object)}_en_${translatedLang}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);

      const res = await fetch(`${supabaseEdgeUrl}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          objectToTranslate: object,
          fromLang: "en",
          toLang: translatedLang,
        }),
      });

      const data = await res.json();
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data.data));
      return data.data;
    },
    [translatedLang, supabaseEdgeUrl, supabaseKey]
  );

  return { t };
};
