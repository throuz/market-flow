"use client";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateCategory } from "../actions";

interface CategoryUpdateFormProps {
  onSubmit: () => void;
  initialData: Database["public"]["Tables"]["categories"]["Row"];
}

export default function CategoryUpdateForm({
  onSubmit,
  initialData,
}: CategoryUpdateFormProps) {
  return (
    <form
      action={async (formData) => {
        await updateCategory(initialData.id, formData);
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="category-name">Category Name</Label>
        <Input
          id="category-name"
          name="name"
          placeholder="Category Name"
          defaultValue={initialData.name}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
}
