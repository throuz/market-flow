"use client";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useProductUnits from "@/hooks/useProductUnits";
import SubmitButton from "@/components/SubmitButton";

interface ProductFormProps {
  onSubmit: (formData: FormData) => void;
  initialData: Database["public"]["Tables"]["products"]["Row"];
}

export default function ProductForm({
  onSubmit,
  initialData,
}: ProductFormProps) {
  const t = useTranslations();
  const { productUnitMap } = useProductUnits();

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <Input
        type="hidden"
        id="product_id"
        name="product_id"
        defaultValue={initialData.id}
        required
      />
      <div className="space-y-2">
        <Label htmlFor="quantity">{t("Quantity")}</Label>
        <div className="relative">
          <Input
            type="number"
            name="quantity"
            defaultValue={1}
            min="1"
            max={initialData.stock_quantity}
            required
            className="pr-12"
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
            {productUnitMap[initialData.unit]}
          </span>
        </div>
      </div>
      <SubmitButton className="w-full">{t("Add to cart")}</SubmitButton>
    </form>
  );
}
