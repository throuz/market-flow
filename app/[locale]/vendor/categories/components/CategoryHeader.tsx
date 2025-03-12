"use client";

import { useTranslations } from "next-intl";

import { createCategory } from "../actions";
import CategoryFormDialog from "./CategoryFormDialog";

export default function CategoryHeader() {
  const t = useTranslations();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="text-2xl font-bold">{t("Categories")}</div>
      <CategoryFormDialog onSubmit={createCategory} />
    </div>
  );
}
