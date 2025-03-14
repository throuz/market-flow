import { Database } from "@/database.types";
import { useTranslations } from "next-intl";

type PaymentMethod = Database["public"]["Enums"]["payment_method"];
type PaymentMethodMap = Record<PaymentMethod, string>;
type PaymentMethodOption = { label: string; value: PaymentMethod };

export default function usePaymentMethods() {
  const t = useTranslations();

  const paymentMethodMap: PaymentMethodMap = {
    money_transfer: t("Money Transfer"),
    cash_on_delivery: t("Cash on delivery"),
  };

  const paymentMethodOptions: PaymentMethodOption[] = Object.entries(
    paymentMethodMap
  ).map(([value, label]) => ({ label, value: value as PaymentMethod }));

  return { paymentMethodMap, paymentMethodOptions };
}
