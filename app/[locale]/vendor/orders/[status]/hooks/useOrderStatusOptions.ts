import { Database } from "@/database.types";
import { useTranslations } from "next-intl";

export default function useOrderStatusOptions() {
  const t = useTranslations();

  const orderStatusOptions: {
    label: string;
    value: Database["public"]["Enums"]["order_status"];
  }[] = [
    { label: t("Pending"), value: "pending" },
    { label: t("Processing"), value: "processing" },
    { label: t("Completed"), value: "completed" },
    { label: t("Cancelled"), value: "cancelled" },
  ];

  return orderStatusOptions;
}
