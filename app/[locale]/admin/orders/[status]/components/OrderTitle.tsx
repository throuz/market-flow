"use client";

import { useTranslations } from "next-intl";

export default function OrderTitle() {
  const t = useTranslations();
  return <div className="text-2xl font-bold">{t("Orders")}</div>;
}
