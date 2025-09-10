
import { supabase } from "./supabase";
import { ProfileData } from "@/app/profile";
import { Plan } from "@/types/Plan";
import { Product } from "@/types/Product";
import { PlanProductInput, SavePlanParams } from "@/types/SavePlanParams";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export const fetchPlans = async () => {
  const { data, error } = await supabase.from("plans").select("*").order("created_at", { ascending: false });
  if (error)
    throw new Error(error.message);
  return data || [];
}

export const fetchProfile = async (): Promise<ProfileData | null> => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);

  return { user, role: data?.role ?? "user" };
};

export const fetchPlan = async (id: string): Promise<Plan | null> => {
  const { data, error } = await supabase
    .from("plans")
    .select(`
      id, name, budget, adjustment, created_at,
      plan_products (
        quantity,
        products (*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const products =
    data.plan_products?.map((pp: any) => ({
      ...pp.products,
      quantity: pp.quantity,
    })) || [];

  return { ...data, products };
};

export const savePlan = async ({
  name,
  budget,
  adjustment,
  products,
}: SavePlanParams) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated");

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .insert([{ owner_id: user.id, name, budget, adjustment }])
    .select("id")
    .single();

  if (planError) throw planError;

  const planProducts: PlanProductInput[] = products.map((p) => ({
    product_id: p.id,
    quantity: p.quantity,
  }));

  const { error: planProductsError } = await supabase
    .from("plan_products")
    .insert(
      planProducts.map((pp) => ({
        plan_id: plan.id,
        ...pp,
      }))
    );

  if (planProductsError) throw planProductsError;

  return plan;

};

