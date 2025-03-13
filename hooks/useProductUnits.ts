import { Database } from "@/database.types";
import { useTranslations } from "next-intl";

type ProductUnit = Database["public"]["Enums"]["product_unit"];
type ProductUnitMap = Record<ProductUnit, string>;
type ProductUnitOption = { label: string; value: ProductUnit };

export default function useProductUnits() {
  const t = useTranslations();

  const productUnitMap: ProductUnitMap = {
    piece: t("Piece"),
    kg: t("Kilogram"),
    g: t("Gram"),
    catty: t("Catty"),
    tael: t("Tael"),
    bundle: t("Bundle"),
    box: t("Box"),
    bag: t("Bag"),
  };

  const productUnitOptions: ProductUnitOption[] = Object.entries(
    productUnitMap
  ).map(([value, label]) => ({ label, value: value as ProductUnit }));

  return { productUnitMap, productUnitOptions };
}
