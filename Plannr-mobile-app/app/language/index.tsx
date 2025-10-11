import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useTranslationContext } from "@/context/TranslationContext";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ml", label: "മലയാളം" },
  { code: "ta", label: "தமிழ்" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

export default function LanguageScreen() {
  const { translatedLang, setTranslatedLang } = useTranslationContext();
  const router = useRouter();
  const { session } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Initialize selected to current translated language
  useEffect(() => {
    setSelected(translatedLang);
  }, [translatedLang]);

  const handleSelect = async (langCode: string) => {
    try {
      setSelected(langCode);
      setSaving(true);

      // Update the target language
      setTranslatedLang(langCode);

      await AsyncStorage.setItem("user_lang", langCode);

      // small delay for UI feedback
      await new Promise((res) => setTimeout(res, 300));

      if (session) router.replace("/budget-setup/instructions");
      else router.replace("/login");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-2xl font-semibold mb-4 text-[#602c66] font-bricolage-semibold">
        Select Language
      </Text>

      {LANG_OPTIONS.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          onPress={() => handleSelect(lang.code)}
          disabled={saving}
          className={`w-full p-4 mb-3 rounded-2xl border ${
            selected === lang.code ? "bg-[#602c66]" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-center text-lg font-kanit ${
              selected === lang.code ? "text-white" : "text-black"
            }`}
          >
            {lang.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
