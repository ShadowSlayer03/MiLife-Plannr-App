import { Product } from "./Product";

export type Plan = {
  id: string;
  name: string;
  budget: number;
  adjustment: number;
  created_at: string;
  products: Product[];
};