import { createClient } from "@/utils/supabase/server";
import CategoryForm from "./components/CategoryForm";
import { createCategory, updateCategory, deleteCategory } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <CategoryForm
                    initialData={category}
                    onSubmit={(formData) =>
                      updateCategory(category.id, formData)
                    }
                  />
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await deleteCategory(category.id);
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
