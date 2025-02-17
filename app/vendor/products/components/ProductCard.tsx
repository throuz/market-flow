import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProductForm from "./ProductForm";
import { Database } from "@/database.types";

interface ProductCardProps {
  product: Database["public"]["Tables"]["products"]["Row"];
  onUpdate: (id: number, formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function ProductCard({
  product,
  onUpdate,
  onDelete,
}: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <p className="text-muted-foreground mb-2">{product.description}</p>
        <div className="space-y-2 mb-4">
          <p className="font-semibold">
            ${product.price_per_unit}/{product.unit}
          </p>
          <p className="text-sm">
            Stock: {product.stock_quantity} {product.unit}s
          </p>
          <p className="text-sm">
            Status: {product.is_active ? "Active" : "Inactive"}
          </p>
        </div>
        <div className="flex gap-2">
          <ProductForm
            initialData={product}
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
        </div>
      </CardContent>
    </Card>
  );
}
