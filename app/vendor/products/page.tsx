import { createClient } from "@/utils/supabase/server";
import ProductDialog from "./components/ProductDialog";
import ProductCard from "./components/ProductCard";
import { createProduct, updateProduct, deleteProduct } from "./actions";

export default async function VendorProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Products</div>
          <ProductDialog onSubmit={createProduct} />
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdate={updateProduct}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
