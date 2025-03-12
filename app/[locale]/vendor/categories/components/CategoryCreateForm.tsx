"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { createCategory } from "../actions";

interface CategoryCreateFormProps {
  onSubmit: () => void;
}

export default function CategoryCreateForm({
  onSubmit,
}: CategoryCreateFormProps) {
  return (
    <form
      action={async (formData) => {
        await createCategory(formData);
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
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
}
