import { useTranslations } from "next-intl";

export default function NoProductsMessage() {
  const t = useTranslations();
  return (
    <p className="text-gray-500 italic">{t("No products in this category")}</p>
  );
}
