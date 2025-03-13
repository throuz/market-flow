import { Database } from "@/database.types";
import { useTranslations } from "next-intl";

type OrderStatus = Database["public"]["Enums"]["order_status"];
type OrderStatusMap = Record<OrderStatus, string>;
type OrderStatusOption = { label: string; value: OrderStatus };

export default function useOrderStatus() {
  const t = useTranslations();

  const orderStatusMap: OrderStatusMap = {
    pending: t("Pending"),
    processing: t("Processing"),
    completed: t("Completed"),
    cancelled: t("Cancelled"),
  };

  const orderStatusOptions: OrderStatusOption[] = Object.entries(
    orderStatusMap
  ).map(([value, label]) => ({ label, value: value as OrderStatus }));

  return { orderStatusMap, orderStatusOptions };
}
