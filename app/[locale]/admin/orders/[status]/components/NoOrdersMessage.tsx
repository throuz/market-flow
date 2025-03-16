import { useTranslations } from "next-intl";

export default function NoOrdersMessage() {
  const t = useTranslations();
  return (
    <div className="col-span-full text-center py-8 text-gray-500">
      {t("No orders found")}
    </div>
  );
}
