"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryFormDialog from "./CategoryFormDialog";
import { Button } from "@/components/ui/button";
import { Database } from "@/database.types";
import { useTranslations } from "next-intl";

interface CategoryCardProps {
  category: Database["public"]["Tables"]["categories"]["Row"];
  onUpdate: (id: number, formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function CategoryCard({
  category,
  onUpdate,
  onDelete,
}: CategoryCardProps) {
  const t = useTranslations();
  return (
    <Card key={category.id}>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardFooter className="justify-end gap-4">
        <CategoryFormDialog
          initialData={category}
          onSubmit={(formData) => onUpdate(category.id, formData)}
        />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onDelete(category.id);
          }}
        >
          <Button variant="destructive">{t("Delete")}</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
