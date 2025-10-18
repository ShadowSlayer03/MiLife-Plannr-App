import { brands35BV, brands75BV } from "@/constants/Brands";
import { ExportButtonContent } from "@/constants/Content";
import { useTranslatePage } from "@/hooks/useTranslatePage";
import { Plan } from "@/types/Plan";
import { Product } from "@/types/Product";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import * as XLSX from "xlsx";

type ExportButtonProps = {
    plan: Plan;
    format: "excel" | "word";
};

const ExportButton: React.FC<ExportButtonProps> = ({ plan, format }) => {

    const { translating, translated } = useTranslatePage(ExportButtonContent);

    const list75BV = plan.products.filter(p => brands75BV.includes(p.subbrand));
    const list35BV = plan.products.filter(p => brands35BV.includes(p.subbrand));

    const exportToExcel = async () => {
        const planDetails = [
            { Name: plan.name, Budget: plan.budget, Adjustment: plan.adjustment, Created: plan.created_at },
        ];

        const createSheet = (products: Product[], label: string) => {
            if (products.length === 0) {
                return XLSX.utils.json_to_sheet([
                    { "Info": `No ${label} products found` }
                ]);
            }

            const data = products.map(p => ({
                "Product Name": p.name,
                "Sub-Brand": p.subbrand || "",
                Price: p.price ?? 0,
                Quantity: p.quantity ?? 1,
                Priority_Weight: p.priorityweight ?? 0,
            }));

            const totalPrice = products.reduce((sum, p) => sum + (p.price ?? 0) * (p.quantity ?? 1), 0);
            const totalQuantity = products.reduce((sum, p) => sum + (p.quantity ?? 1), 0);
            const avgPW = products.reduce((sum, p) => sum + (p.priorityweight ?? 0), 0) / products.length;

            data.push({
                "Product Name": `TOTAL VALUES / AVG PW (${label})`,
                "Sub-Brand": "",
                Price: totalPrice,
                Quantity: totalQuantity,
                Priority_Weight: avgPW,
            });

            return XLSX.utils.json_to_sheet(data);
        };

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(planDetails), "Plan Details");
        XLSX.utils.book_append_sheet(workbook, createSheet(list75BV, "75BV"), "75BV Products");
        XLSX.utils.book_append_sheet(workbook, createSheet(list35BV, "35BV"), "35BV Products");

        const excelBinary = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });

        const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
        const fileName = `MiPlannr-${timestamp}.xlsx`;

        if (Platform.OS === "web") {
            const { saveAs } = await import("file-saver");
            const blob = new Blob([XLSX.write(workbook, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" });
            saveAs(blob, fileName);
        } else {
            const fileUri = FileSystem.cacheDirectory + fileName;
            await FileSystem.writeAsStringAsync(fileUri, excelBinary, { encoding: FileSystem.EncodingType.Base64 });
            await Sharing.shareAsync(fileUri);
        }
    };

    const exportToWord = async (timestamp: string) => {
        const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = await import("docx");

        const createTable = (products: Product[], label: string) => {
            if (products.length === 0) {
                return new Paragraph({ text: `No ${label} products found`, spacing: { after: 200 } });
            }

            const rows = products.map(p =>
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(p.name)] }),
                        new TableCell({ children: [new Paragraph(p.subbrand || "")] }),
                        new TableCell({ children: [new Paragraph((p.quantity ?? 1).toString())] }),
                    ],
                })
            );

            return new Table({
                rows: [
                    new TableRow({ children: [new TableCell({ children: [new Paragraph({ text: `${label} Products`, heading: "Heading2" })], columnSpan: 3 })] }),
                    ...rows,
                ],
            });
        };

        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({ text: plan.name, heading: "Heading1" }),
                        createTable(list75BV, "75BV"),
                        createTable(list35BV, "35BV"),
                    ],
                },
            ],
        });

        const buffer = await Packer.toBase64String(doc);
        const fileName = `MiPlannr-${timestamp}.docx`;
        const fileUri = FileSystem.cacheDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, buffer, { encoding: FileSystem.EncodingType.Base64 });
        await Sharing.shareAsync(fileUri);
    };

    const exportPlan = async () => {
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
        if (format === "excel") {
            await exportToExcel();
        } else {
            await exportToWord(timestamp);
        }
    };

    const formattedTitle = (translated.title || "").replace(/\{.*?\}/, format === "excel" ? "Excel" : "Word");

    if (translating) {
        return (
            <View className="flex-1 justify-center items-center space-y-5">
                <ActivityIndicator size="large" color="bg-mi-purple" />
                <Text className="text-lg font-kanit">
                    {translated.buttonLoadingText}
                </Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            onPress={exportPlan}
            className={`${format === "excel" ? "bg-excel-green" : "bg-word-purple"} py-3 px-5 rounded-xl shadow-md mt-2`}
        >
            <Text className="text-white text-base font-bricolage-semibold text-center">
                {formattedTitle}
            </Text>
        </TouchableOpacity>
    );
};

export default ExportButton;
