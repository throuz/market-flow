"use client";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import useProductUnits from "@/hooks/useProductUnits";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProductFormDialog from "./ProductFormDialog";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Database["public"]["Tables"]["products"]["Row"];
}

export default function ProductCard({ product }: ProductCardProps) {
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
        <ProductFormDialog initialData={product} />
      </CardFooter>
    </Card>
  );
}
