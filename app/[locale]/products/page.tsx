import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";

import ProductCard from "./components/ProductCard";
import ProductTitle from "./components/ProductTitle";
import NoProductsMessage from "./components/NoProductsMessage";

type ProductsByCategory = Record<
  number,
  Database["public"]["Tables"]["products"]["Row"][]
>;

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*");
  const { data: categories } = await supabase.from("categories").select("*");

  const productsByCategory = products?.reduce<ProductsByCategory>(
    (acc, product) => {
      const categoryId = product.category_id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
      return acc;
    },
    {}
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <ProductTitle />
        </div>
        <div className="space-y-8">
          {categories?.map((category) => (
            <div key={category.id}>
              <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {productsByCategory?.[category.id]?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                )) ?? <NoProductsMessage />}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
