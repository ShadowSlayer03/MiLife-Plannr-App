import { Product } from "@/types/Product";

interface WeightedProduct extends Product {
  bv: number;
  imp: number;
}

interface DPState {
  map: Map<string, number>;
  importance: number;
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
  const currentSpent = selected.reduce(
    (acc, s) => acc + s.price * (s.quantity || 1),
    0
  );
  const remainingBudget = totalAvailableBudget - currentSpent;
  const quantityCap = 8;

  if (remainingBudget <= 0) {
    return selected.map((s) => ({
      ...s,
      bv: type === "75BV" ? 75 : 35,
      quantity: s.quantity || 1,
    }));
  }

  // Filter out already selected products
  const selectedIds = new Set(selected.map((s) => s.id));
  const availableProducts: WeightedProduct[] = products
    .filter((p) => !selectedIds.has(p.id))
    .map((p) => ({
      ...p,
      bv: type === "75BV" ? 75 : 35,
      imp: (type === "75BV" ? 75 : 35) * p.priorityweight,
    }));

  const W = remainingBudget;
  const n = availableProducts.length;

  // Precompute importance lookup
  const impMap = new Map<string, number>();
  availableProducts.forEach((p) => impMap.set(p.id, p.imp));

  // 1D DP: dp[w] = best state at weight w
  const dp: Array<DPState | null> = Array(W + 1).fill(null);
  dp[0] = { map: new Map(), importance: 0 };

  for (let i = 0; i < n; i++) {
    const prod = availableProducts[i];
    const weight = prod.price;
    const prodImp = prod.imp;

    // Traverse backwards
    for (let w = W; w >= weight; w--) {
      for (let k = 1; k <= quantityCap; k++) {
        const prevW = w - k * weight;
        if (prevW < 0 || !dp[prevW]) break;

        const prevState = dp[prevW]!;
        const candidateMap = new Map(prevState.map);
        const existingQty = candidateMap.get(prod.id) || 0;
        const newQty = Math.min(existingQty + k, quantityCap);
        candidateMap.set(prod.id, newQty);

        const candidateImportance =
          prevState.importance + prodImp * (newQty - existingQty);

        if (!dp[w] || candidateImportance > dp[w]!.importance) {
          dp[w] = {
            map: candidateMap,
            importance: candidateImportance,
          };
        }
      }
    }
  }

  // Find best combination
  let bestState: DPState = { map: new Map(), importance: 0 };
  for (let w = 0; w <= W; w++) {
    if (dp[w] && dp[w]!.importance > bestState.importance) {
      bestState = dp[w]!;
    }
  }

  // Convert Map to product list with quantities
  const bestProducts: Product[] = [];
  bestState.map.forEach((qty, id) => {
    const prod = availableProducts.find((p) => p.id === id);
    if (prod) bestProducts.push({ ...prod, quantity: qty });
  });

  // Merge with selected items
  const updatedSelected = selected.map((s) => ({
    ...s,
    bv: type === "75BV" ? 75 : 35,
    quantity: s.quantity || 1,
  }));

  return [...updatedSelected, ...bestProducts];
};

export default generateList;
