"use client";

import { Database } from "@/database.types";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { deleteCategory } from "../actions";
import CategoryUpdateDialog from "./CategoryUpdateDialog";

interface CategoryCardProps {
  category: Database["public"]["Tables"]["categories"]["Row"];
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card key={category.id}>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardFooter className="justify-end gap-4">
        <CategoryUpdateDialog initialData={category} />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await deleteCategory(category.id);
          }}
        >
          <Button variant="destructive">Delete</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
