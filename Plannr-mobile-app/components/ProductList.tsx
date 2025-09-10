import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import ProductItem from "./ProductItem";
import { fetchProducts } from "@/lib/queries";
import { brands35BV, brands75BV } from "@/constants/Brands";
import { Product } from "@/types/Product";

type ProductListProps = {
  onAdd: (product: Product) => void;
  onSub: (product: Product) => void;
  selected: Product[];
  type: "75BV" | "35BV";
};

const ProductList: React.FC<ProductListProps> = ({ onAdd, onSub, selected, type }) => {
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState<string>("none");
  const [sortItems, setSortItems] = useState([
    { label: "Name (A-Z)", value: "nameAsc" },
    { label: "Price (Low → High)", value: "priceAsc" },
    { label: "Price (High → Low)", value: "priceDesc" },
  ]);

  const reqBrandArray = type === "75BV" ? brands75BV : brands35BV;

  const [brandOpen, setBrandOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [brandItems, setBrandItems] = useState(
    reqBrandArray.map((b) => ({ label: b, value: b }))
  );

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  if (isError) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: error.message,
      position: "bottom",
      visibilityTime: 2000,
    });
  }

  const productsBasedonBV = products.filter((p) => reqBrandArray.includes(p.subbrand));

  const filteredProducts = productsBasedonBV
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      selectedBrand !== "All"
        ? p.subbrand.toLowerCase() === selectedBrand.toLowerCase()
        : true
    )
    .sort((a, b) => {
      if (sortValue === "priceAsc") return a.price - b.price;
      if (sortValue === "priceDesc") return b.price - a.price;
      if (sortValue === "nameAsc") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <View className="flex-1">
      {/* Search Input */}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search products..."
        className="bg-white border-2 border-gray-200 focus:border-mi-purple rounded-full px-4 py-3 mb-4 shadow-md text-gray-800 font-kanit"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      <View className="flex-row justify-between mb-8 z-20">
        {/* Sort Dropdown */}
        <View style={{ flex: 1, marginRight: 6, zIndex: 2000 }}>
          <DropDownPicker
            open={sortOpen}
            value={sortValue}
            items={sortItems}
            setOpen={setSortOpen}
            setValue={setSortValue}
            setItems={setSortItems}
            placeholder="Sort"
            ArrowDownIconComponent={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#fff" />
            )}
            ArrowUpIconComponent={() => (
              <MaterialIcons name="keyboard-arrow-up" size={20} color="#fff" />
            )}
            TickIconComponent={() => (
              <MaterialIcons name="check" size={18} color="#fff" />
            )}
            style={{
              borderRadius: 8,
              borderColor: "#ccc",
              height: 40,
              backgroundColor: "#602c66",
            }}
            textStyle={{ fontSize: 13, color: "#fff", fontFamily: "kanit" }}
            dropDownContainerStyle={{
              borderColor: "#ccc",
              backgroundColor: "#602c66",
              borderRadius: 8,
            }}
            listItemLabelStyle={{ color: "#fff" }}
            placeholderStyle={{ color: "#eee" }}
          />
        </View>

        {/* Brand Dropdown */}
        <View style={{ flex: 1, marginLeft: 6, zIndex: 1000 }}>
          <DropDownPicker
            open={brandOpen}
            value={selectedBrand}
            items={brandItems}
            setOpen={setBrandOpen}
            setValue={setSelectedBrand}
            setItems={setBrandItems}
            placeholder="Brand"
            ArrowDownIconComponent={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color="#fff" />
            )}
            ArrowUpIconComponent={() => (
              <MaterialIcons name="keyboard-arrow-up" size={20} color="#fff" />
            )}
            TickIconComponent={() => (
              <MaterialIcons name="check" size={18} color="#fff" />
            )}
            style={{
              borderRadius: 8,
              borderColor: "#ccc",
              // height: 40,
              backgroundColor: "#602c66",
            }}
            textStyle={{ fontSize: 13, color: "#fff", fontFamily: "kanit" }}
            dropDownContainerStyle={{
              borderColor: "#ccc",
              backgroundColor: "#602c66",
              borderRadius: 8,
            }}
            listItemLabelStyle={{ color: "#fff" }}
            placeholderStyle={{ color: "#eee" }}
          />
        </View>
      </View>

      {/* Product List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#602c66" />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductItem
              product={{
                ...item,
                quantity: selected.find((p) => p.id === item.id)?.quantity || 0,
              }}
              onAdd={onAdd}
              onSub={onSub}
              isSelected={selected.some((p) => p.id === item.id)}
            />
          )}
          ListEmptyComponent={<Text className="font-kanit">No Products Found</Text>}
        />
      )}
    </View>
  );
};

export default ProductList;
