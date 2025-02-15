import { createClient } from "@/utils/supabase/server";
import CategoryForm from "./components/CategoryForm";
import CategoryCard from "./components/CategoryCard";
import { createCategory, updateCategory, deleteCategory } from "./actions";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function VendorCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="flex flex-col gap-8 p-16">
      <section>
        <CardHeader>
          <CardTitle className="text-center">Add New Category</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <CategoryForm onSubmit={createCategory} />
        </CardContent>
      </section>

      <Separator className="my-4" />

      <section>
        <CardHeader>
          <CardTitle className="text-center">Categories</CardTitle>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onUpdate={updateCategory}
              onDelete={deleteCategory}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
