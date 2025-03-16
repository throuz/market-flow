"use client";

import { useTranslations } from "next-intl";

export default function CategoryTitle() {
  const t = useTranslations();

  return <div className="text-2xl font-bold">{t("Categories")}</div>;
}
