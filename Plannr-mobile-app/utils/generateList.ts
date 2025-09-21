import { Product } from "@/types/Product";

interface WeightedProduct extends Product {
  bv: number;
  imp: number;
}

/**
 * Optimized DP-based generateList
 */
const generateList = (
  products: Product[],
  budget: number,
  adjustment: number,
  selected: Product[],
  type: "75BV" | "35BV"
): Product[] => {
  const totalAvailableBudget = budget + adjustment;
  const currentSpent = selected.reduce((acc, s) => acc + s.price * (s.quantity || 1), 0);
  const remainingBudget = totalAvailableBudget - currentSpent;
  const quantityCap = 8;

  if (remainingBudget <= 0) {
    return selected.map(s => ({
      ...s,
      bv: type === "75BV" ? 75 : 35,
      quantity: s.quantity || 1,
    }));
  }

  // Filter out already selected products
  const selectedIds = new Set(selected.map(s => s.id));
  const availableProducts: WeightedProduct[] = products
    .filter(p => !selectedIds.has(p.id))
    .map(p => ({
      ...p,
      bv: type === "75BV" ? 75 : 35,
      imp: (type === "75BV" ? 75 : 35) * p.priorityweight,
    }));

  const W = remainingBudget;
  const n = availableProducts.length;

  // 1D DP: dp[w] = best map of productId → quantity for budget w
  const dp: Array<Map<string, number> | null> = Array(W + 1).fill(null);
  dp[0] = new Map();

  for (let i = 0; i < n; i++) {
    const prod = availableProducts[i];
    const weight = prod.price;

    // Traverse backwards to prevent overwriting previous states
    for (let w = W; w >= weight; w--) {
      for (let k = 1; k <= quantityCap; k++) {
        const prevW = w - k * weight;
        if (prevW < 0 || !dp[prevW]) break;

        const candidate = new Map(dp[prevW]);
        const existingQty = candidate.get(prod.id) || 0;
        const newQty = Math.min(existingQty + k, quantityCap);
        candidate.set(prod.id, newQty);

        if (!dp[w] || totalImportance(candidate, availableProducts) > totalImportance(dp[w], availableProducts)) {
          dp[w] = candidate;
        }
      }
    }
  }

  // Find best combination from dp array
  let bestMap: Map<string, number> | null = new Map();
  for (let w = 0; w <= W; w++) {
    if (dp[w] && totalImportance(dp[w], availableProducts) > totalImportance(bestMap, availableProducts)) {
      bestMap = dp[w];
    }
  }

  // Convert Map to product list with quantities
  const bestProducts: Product[] = [];
  bestMap?.forEach((qty, id) => {
    const prod = availableProducts.find(p => p.id === id);
    if (prod) bestProducts.push({ ...prod, quantity: qty });
  });

  // Merge with selected items
  const updatedSelected = selected.map(s => ({
    ...s,
    bv: type === "75BV" ? 75 : 35,
    quantity: s.quantity || 1,
  }));

  return [...updatedSelected, ...bestProducts];
};

/**
 * Calculate total importance of product map
 */
function totalImportance(map: Map<string, number> | null, products: WeightedProduct[]): number {
  let total = 0;
  map?.forEach((qty, id) => {
    const prod = products.find(p => p.id === id);
    if (prod) total += (prod.imp ?? 0) * qty;
  });
  return total;
}

export default generateList;
