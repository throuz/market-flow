"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CategoryForm from "./CategoryForm";
import { Button } from "@/components/ui/button";

type CategoryCardProps = {
  category: {
    id: number;
    name: string;
  };
  onUpdate: (id: number, formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export default function CategoryCard({
  category,
  onUpdate,
  onDelete,
}: CategoryCardProps) {
  return (
    <Card key={category.id}>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardFooter className="justify-end gap-4">
        <CategoryForm
          initialData={category}
          onSubmit={(formData) => onUpdate(category.id, formData)}
        />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onDelete(category.id);
          }}
        >
          <Button variant="destructive">Delete</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
