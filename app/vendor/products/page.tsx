import { createClient } from "@/utils/supabase/server";
import ProductForm from "./components/ProductForm";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default async function VendorProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="flex flex-col gap-8 p-16">
      <section>
        <CardHeader>
          <CardTitle className="text-center">Add New Product</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ProductForm onSubmit={createProduct} />
        </CardContent>
      </section>

      <Separator className="my-4" />

      <section>
        <CardHeader>
          <CardTitle className="text-center">Your Products</CardTitle>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <Card key={product.id}>
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
                <p className="text-muted-foreground mb-2">
                  {product.description}
                </p>
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
                    onSubmit={(formData) => updateProduct(product.id, formData)}
                  />
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await deleteProduct(product.id);
                    }}
                  >
                    <Button variant="destructive">Delete</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
