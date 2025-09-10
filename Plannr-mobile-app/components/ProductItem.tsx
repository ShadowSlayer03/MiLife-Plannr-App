import { Product } from "@/types/Product";
import { truncateText } from "@/utils/truncateText";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type ProductItemProps = {
    product: Product;
    onAdd: (product: Product) => void;
    onSub: (product: Product) => void;
    isSelected: boolean;
};

const ProductItem: React.FC<ProductItemProps> = ({ product, onAdd, onSub, isSelected }) => {
    const onClickToggle = () => {
        if (isSelected) {
            onSub(product);
        } else {
            onAdd(product);
        }
    };

    return (
        <View className="flex-row justify-between items-center p-3 bg-white rounded-xl mb-2 shadow">
            <View>
                <Text className="text-lg font-kanit-semibold">
                    {truncateText(product.name,20)}
                </Text>
                <Text className="text-sm text-gray-500 font-kanit">₹{product.price}</Text>
            </View>

            {isSelected ? (
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => onSub(product)}
                        className="bg-gray-300 px-3 py-1 rounded-l-lg"
                    >
                        <Text className="text-mi-purple font-bold">-</Text>
                    </TouchableOpacity>
                    <Text className="px-3 font-kanit">{product.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => onAdd(product)}
                        className="bg-mi-purple px-3 py-1 rounded-r-lg"
                    >
                        <Text className="text-white font-bold">+</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => onAdd(product)}
                    className="bg-mi-purple px-4 py-2 rounded-lg"
                >
                    <Text className="text-white font-kanit font-medium">+ Add</Text>
                </TouchableOpacity>
            )}
        </View>

    );
};

export default ProductItem;
