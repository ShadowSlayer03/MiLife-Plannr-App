import { brands35BV, brands75BV } from "@/constants/Brands";
import { Product } from "@/types/Product";
import generateList from "@/utils/generateList";
import { Dispatch, SetStateAction } from "react";

interface CreateListParams {
    products: Product[];
    selected: Product[];
    budget: number;
    adjustment: number;
    type: "75BV" | "35BV";
    setList: (list: Product[]) => void;
    setBudget: Dispatch<SetStateAction<number>>;
    setAdjustment: Dispatch<SetStateAction<number>>;
}

export const createAndStoreList = ({
    products,
    selected,
    budget,
    adjustment,
    type,
    setList,
    setBudget,
    setAdjustment,
}: CreateListParams) => {
    const reqBrandArray = type === "75BV" ? brands75BV : brands35BV;
    const productsBasedOnBV = products.filter((p) =>
        reqBrandArray.includes(p.subbrand)
    );

    const generatedListOfProducts = generateList(
        productsBasedOnBV,
        budget,
        adjustment,
        selected,
        type
    );

    if (type === "75BV") {
        setBudget(budget);
        setAdjustment(adjustment);
    } else {
        setBudget((prev: number) => prev + budget);
        setAdjustment((prev: number) => prev + adjustment);
    }

    setList(generatedListOfProducts);

    return generatedListOfProducts;
};

