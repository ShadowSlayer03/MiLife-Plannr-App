import React from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Product } from "@/types/Product";
import { Plan } from "@/types/Plan";

type ExportButtonProps = {
    plan: Plan;
};

const ExportButton: React.FC<ExportButtonProps> = ({ plan }) => {
    const exportToExcel = async () => {
        const planDetails = [
            {
                Name: plan.name,
                Budget: plan.budget,
                Adjustment: plan.adjustment,
                Created: plan.created_at,
            },
        ];

        const productDetails = plan.products.map((p: Product) => ({
            "Product Name": p.name,
            "Sub-Brand": p.subbrand,
            Price: p.price,
            Quantity: p.quantity,
            Priority_Weight: p.priorityweight,
        }));

        const totalPrice = plan.products.reduce(
            (sum, p) => sum + p.price * (p.quantity as number),
            0
        );
        const totalQuantity = plan.products.reduce(
            (sum, p) => sum + (p.quantity as number),
            0
        );

        const sumPriorityWeight = plan.products.reduce(
            (sum, p) => sum + (p.priorityweight as number),
            0
        );
        const avgPW = sumPriorityWeight / plan.products.length;

        productDetails.push({
            "Product Name": "TOTAL VALUES/ AVG PW",
            "Sub-Brand": "",
            Price: totalPrice,
            Quantity: totalQuantity,
            Priority_Weight: avgPW,
        });

        const workbook = XLSX.utils.book_new();
        const planSheet = XLSX.utils.json_to_sheet(planDetails);
        const productSheet = XLSX.utils.json_to_sheet(productDetails);

        XLSX.utils.book_append_sheet(workbook, planSheet, "Plan Details");
        XLSX.utils.book_append_sheet(workbook, productSheet, "Products");

        const excelBinary = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });

        const timestamp = new Date()
            .toISOString()
            .replace(/[-:T.]/g, "")
            .slice(0, 14);
        const fileName = `MiPlannr-${timestamp}.xlsx`;

        if (Platform.OS === "web") {
            const { saveAs } = await import("file-saver");
            const blob = new Blob(
                [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
                { type: "application/octet-stream" }
            );
            saveAs(blob, fileName);
        } else {
            const fileUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(fileUri, excelBinary, {
                encoding: FileSystem.EncodingType.Base64,
            });
            await Sharing.shareAsync(fileUri);
        }
    };

    return (
        <TouchableOpacity
            onPress={exportToExcel}
            className="bg-mi-purple py-3 px-5 rounded-xl items-center my-2 mb-4 shadow-md"
        >
            <Text className="text-white text-base font-bricolage-semibold">
                Export to Excel
            </Text>
        </TouchableOpacity>
    );
};

export default ExportButton;
