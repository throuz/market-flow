"use client";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["categories"]["Row"];
}

export default function CategoryForm({
  onSubmit,
  initialData,
}: CategoryFormProps) {
  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder="Category Name"
          defaultValue={initialData?.name}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
}
