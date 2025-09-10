import { Product } from "@/types/Product";
import React, { createContext, Dispatch, SetStateAction, useState } from "react";

type GeneratedListContextType = {
  list75BV: Product[];
  setList75BV: Dispatch<SetStateAction<Product[]>>;
  list35BV: Product[];
  setList35BV: Dispatch<SetStateAction<Product[]>>;
  budget: number;
  setBudget: Dispatch<SetStateAction<number>>;
  adjustment: number;
  setAdjustment: Dispatch<SetStateAction<number>>;

};

export const GeneratedListContext = createContext<GeneratedListContextType | undefined>(undefined);

export const GeneratedListProvider = ({ children }: { children: React.ReactNode }) => {
  const [list75BV, setList75BV] = useState<Product[]>([]);
  const [list35BV, setList35BV] = useState<Product[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [adjustment, setAdjustment] = useState<number>(0);

  return (
    <GeneratedListContext.Provider value={{
      list75BV,
      setList75BV,
      list35BV,
      setList35BV,
      budget,
      setBudget,
      adjustment,
      setAdjustment,
    }}>
      {children}
    </GeneratedListContext.Provider>
  );
};
