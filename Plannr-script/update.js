import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Setup Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SR_KEY // service role key needed for unrestricted writes
);

const API_URL = "https://miadmin.milifeindia.com/api/Product/GetProductApi";

// Normalize API product names (remove "Wellness" for Elements products)
function normalizeProductName(name) {
  if (name.toLowerCase().includes("elements")) {
    return name.replace(/\bWellness\b/gi, "").replace(/\s+/g, " ").trim();
  }
  return name.trim();
}

async function updateProducts() {
  try {
    // 1. Fetch product data from API
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data.products)) {
      throw new Error("Unexpected API response format");
    }

    // 2. Loop through and update prices
    for (const p of data.products) {
      const normalizedName = normalizeProductName(p.productName);

      const { error } = await supabase
        .from("products")
        .update({ price: p.rsp })
        .eq("name", normalizedName);

      if (error) {
        console.error(`❌ Failed to update ${normalizedName}:`, error.message);
      } else {
        console.log(`✅ Updated ${normalizedName} with price ${p.rsp}`);
      }
    }

    console.log("✨ Product prices updated successfully.");
  } catch (err) {
    console.error("Update failed:", err.message);
  }
}

updateProducts();
