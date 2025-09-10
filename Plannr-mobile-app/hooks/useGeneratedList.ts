import { GeneratedListContext } from "@/context/GeneratedListContext";
import { useContext } from "react";

export const useGeneratedList = () => {
  const context = useContext(GeneratedListContext);
  if (!context) {
    throw new Error("useGeneratedList must be used inside GeneratedListProvider");
  }
  return context;
};