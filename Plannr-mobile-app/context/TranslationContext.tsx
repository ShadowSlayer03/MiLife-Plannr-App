import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type TranslationContextType = {
  translatedLang: string; // the target language
  setTranslatedLang: (lang: string) => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [translatedLang, setTranslatedLangState] = useState("en");

  useEffect(() => {
    AsyncStorage.getItem("user_lang").then((lang) => {
      if (lang) setTranslatedLangState(lang);
    });
  }, []);

  const setTranslatedLang = (lang: string) => {
    setTranslatedLangState(lang);
    AsyncStorage.setItem("user_lang", lang);
  };

  return (
    <TranslationContext.Provider value={{ translatedLang, setTranslatedLang }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslationContext must be used inside TranslationProvider");
  return ctx;
};
