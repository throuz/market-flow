"use client";

import { useTranslations } from "next-intl";

import { formatPrice } from "@/lib/utils";
import { Database } from "@/database.types";
import SubmitButton from "@/components/SubmitButton";
import useProductUnits from "@/hooks/useProductUnits";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProductFormDialog from "./ProductFormDialog";

interface ProductCardProps {
  product: Database["public"]["Tables"]["products"]["Row"];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  onUpdate: (id: number, formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function ProductCard({
  product,
  categories,
  onUpdate,
  onDelete,
}: ProductCardProps) {
  const t = useTranslations();

  const { productUnitMap } = useProductUnits();

  const productUnitLabel = productUnitMap[product.unit];

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 py-4 border-t">
        {product.image_url && (
          <div className="mb-4">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">{t("Price per unit")}</p>
          <p className="font-medium">
            {formatPrice(product.price_per_unit)} / {productUnitLabel}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("Stock")}</p>
          <p className="font-medium">
            {product.stock_quantity} {productUnitLabel}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("Description")}</p>
          <p className="font-medium">{product.description}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-4 pt-4 border-t">
        <ProductFormDialog
          initialData={product}
          categories={categories}
          onSubmit={(formData) => onUpdate(product.id, formData)}
        />
        <form
          action={async () => {
            await onDelete(product.id);
          }}
        >
          <SubmitButton
            variant="destructive"
            pendingText={`${t("Deleting")}...`}
          >
            {t("Delete")}
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  );
}
