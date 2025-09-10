import { Product } from "./Product";

export type PlanProductInput = {
  product_id: string;
  quantity: number;
};

export type SavePlanParams = {
  name: string;
  budget: number;
  adjustment: number;
  products: Product[];
};

