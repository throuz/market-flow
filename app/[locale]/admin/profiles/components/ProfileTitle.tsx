"use client";

import { useTranslations } from "next-intl";

export default function ProfileTitle() {
  const t = useTranslations();

  return <div className="text-2xl font-bold">{t("Profiles")}</div>;
}
