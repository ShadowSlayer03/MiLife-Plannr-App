// Knapsack Prob with Greedy Approach
// Profit - High BV/ priority products - BV * priorityweight of products
// Weight - price of products
// Constraint - price should not exceed remaining (budget+adjustment-selected_products_price)

import { Product } from "@/types/Product";

const generateList = (
    products: Product[],
    budget: number,
    adjustment: number,
    selected: Product[],
    type: "75BV" | "35BV"
) => {
    const totalAvailableBudget = budget + adjustment;
    const currentSpent = selected.reduce((acc, s) => acc + s.price, 0);
    const quantityCap = 8;
    const remaining = totalAvailableBudget - currentSpent;

    if (remaining <= 0) return [];

    const selectedIds = new Set(selected.map((s) => s.id));
    const availableProductsToCreateList = products.filter(
        (p) => !selectedIds.has(p.id)
    );

    const availableProductsWithBV = availableProductsToCreateList.map((a) => ({
        ...a,
        bv: type === "75BV" ? 75 : 35,
    }));

    const productsWithReqData = availableProductsWithBV.map((p) => ({
        ...p,
        imp: p.bv * p.priorityweight,
        density: (p.bv * p.priorityweight) / p.price,
    }));

    const productsWithSortedDensity = productsWithReqData.sort(
        (a, b) => b.density - a.density
    );

    const chosenProducts: Product[] = [];
    let amountLeftToChoose = remaining;

    // Strategy: Maximize variety (1 quantity per product, skip duplicates)
    if (type === "35BV") {
        for (const product of productsWithSortedDensity) {
            if (product.price <= amountLeftToChoose) {
                chosenProducts.push({ ...product, quantity: 1 });
                amountLeftToChoose = Math.max(0, amountLeftToChoose - product.price);
            }
        }
        // Strategy: Maximize high-priority products(but upper limit of product selection is 10)
    } else if (type === "75BV") {
        for (const product of productsWithSortedDensity) {
            let countForThisProduct = 0;
            while (
                product.price <= amountLeftToChoose &&
                countForThisProduct < quantityCap
            ) {
                const existing = chosenProducts.find((p) => p.id === product.id);
                if (existing) {
                    existing.quantity = (existing.quantity || 1) + 1;
                } else {
                    chosenProducts.push({ ...product, quantity: 1 });
                }
                amountLeftToChoose -= product.price;
                countForThisProduct++;
            }
        }
    }

    const updatedSelected = selected.map((s) => ({
        ...s,
        bv: type === "75BV" ? 75 : 35,
        quantity: s.quantity || 1,
    }));

    return [...updatedSelected, ...chosenProducts];
};

export default generateList;
