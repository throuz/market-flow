"use client";

import { useTranslations } from "next-intl";
import useProductUnitOptions from "@/hooks/useProductUnitOptions";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["products"]["Row"];
}

export default function ProductForm({
  categories,
  onSubmit,
  initialData,
}: ProductFormProps) {
  const t = useTranslations();
  const productUnitOptions = useProductUnitOptions();

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("Product Name")}</Label>
        <Input
          id="name"
          type="text"
          name="name"
          defaultValue={initialData?.name}
          placeholder={t("Product name")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">{t("Category")}</Label>
        <Select
          name="category_id"
          defaultValue={initialData?.category_id?.toString()}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder={t("Select category")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("Description")}</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          placeholder={t("Description")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">{t("Price per Unit")}</Label>
        <Input
          id="price"
          type="number"
          name="price_per_unit"
          defaultValue={initialData?.price_per_unit}
          placeholder={t("Price per unit")}
          step="0.01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>{t("Product Image")}</Label>
        <ImageUpload
          inputName="image"
          initialInputName="image_url"
          initialImageUrl={initialData?.image_url}
          required={!initialData}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock">{t("Stock Quantity")}</Label>
        <Input
          id="stock"
          type="number"
          name="stock_quantity"
          defaultValue={initialData?.stock_quantity}
          placeholder={t("Stock quantity")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">{t("Unit")}</Label>
        <Select name="unit" defaultValue={initialData?.unit}>
          <SelectTrigger id="unit">
            <SelectValue placeholder={t("Select unit")} />
          </SelectTrigger>
          <SelectContent>
            {productUnitOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? t("Update Product") : t("Add Product")}
      </Button>
    </form>
  );
}
