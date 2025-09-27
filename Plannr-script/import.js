import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// Setup Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SR_KEY // use service role key for inserts
);

const API_URL = "https://miadmin.milifeindia.com/api/Product/GetProductApi";

async function importProducts() {
  try {
    // 1. Fetch product data
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data.products)) {
      throw new Error("Unexpected API response format");
    }

    // 2. Map into your schema
    const rows = data.products.map((p) => ({
      id: randomUUID(),
      name: p.productName,
      price: p.rsp,
      subbrand: null, // fill later manually
    }));

    // 3. Bulk insert into Supabase table
    const { data: upserted, error } = await supabase
      .from("products")
      .upsert(rows, { onConflict: "id" });

    if (error) {
      console.error("Supabase insert error:", error);
    } else {
      console.log(`Inserted ${upserted?.length || 0} products successfully.`);
    }
  } catch (err) {
    console.error("Import failed:", err.message);
  }
}

importProducts();
