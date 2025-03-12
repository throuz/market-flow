import { Database } from "@/database.types";
import { useTranslations } from "next-intl";

export default function useProductUnitOptions() {
  const t = useTranslations();

  const productUnitOptions: {
    label: string;
    value: Database["public"]["Enums"]["product_unit"];
  }[] = [
    { label: t("Piece"), value: "piece" },
    { label: t("Kilogram"), value: "kg" },
    { label: t("Gram"), value: "g" },
    { label: t("Catty"), value: "catty" },
    { label: t("Tael"), value: "tael" },
    { label: t("Bundle"), value: "bundle" },
    { label: t("Box"), value: "box" },
    { label: t("Bag"), value: "bag" },
  ];

  return productUnitOptions;
}
