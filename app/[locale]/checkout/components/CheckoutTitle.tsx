"use client";

import { useTranslations } from "next-intl";

export default function CheckoutTitle() {
  const t = useTranslations();
  return <div className="text-2xl font-bold">{t("Checkout")}</div>;
}
