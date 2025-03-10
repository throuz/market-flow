"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductFormDialog from "./ProductFormDialog";
import { Database } from "@/database.types";

interface ProductCardProps {
  product: Database["public"]["Tables"]["products"]["Row"];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  onUpdate: (id: number, formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const getStatusStyle = (isActive: boolean) => {
  return isActive
    ? "bg-emerald-200 text-emerald-800"
    : "bg-red-200 text-red-800";
};

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(isActive)}`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

export default function ProductCard({
  product,
  categories,
  onUpdate,
  onDelete,
}: ProductCardProps) {
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
          <p className="text-sm text-gray-500">Price per unit</p>
          <p className="font-medium">
            ${product.price_per_unit}/{product.unit}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Stock</p>
          <p className="font-medium">
            {product.stock_quantity} {product.unit}s
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Description</p>
          <p className="font-medium">{product.description}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <StatusBadge isActive={product.is_active} />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-4 pt-4 border-t">
        <ProductFormDialog
          initialData={product}
          categories={categories}
          onSubmit={(formData) => onUpdate(product.id, formData)}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onDelete(product.id);
          }}
        >
          <Button variant="destructive">Delete</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
