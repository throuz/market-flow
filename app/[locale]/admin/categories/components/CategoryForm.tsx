"use client";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

interface CategoryFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["categories"]["Row"];
}

export default function CategoryForm({
  onSubmit,
  initialData,
}: CategoryFormProps) {
  const t = useTranslations();
  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-name">{t("Category Name")}</Label>
        <Input
          id="category-name"
          name="name"
          placeholder="Category Name"
          defaultValue={initialData?.name}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {t("Save")}
      </Button>
    </form>
  );
}
