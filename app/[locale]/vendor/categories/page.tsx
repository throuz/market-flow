import { createClient } from "@/utils/supabase/server";

import CategoryCard from "./components/CategoryCard";
import CategoryCreateDialog from "./components/CategoryCreateDialog";

export default async function VendorCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Categories</div>
          <CategoryCreateDialog />
        </div>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories?.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
}
