"use client";

import { useTranslations } from "next-intl";

export default function AdminTitle() {
  const t = useTranslations();

  return <h2 className="font-bold text-2xl mb-4">{t("Dashboard")}</h2>;
}
