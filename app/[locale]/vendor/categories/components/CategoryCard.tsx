"use client";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import SubmitButton from "@/components/SubmitButton";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import CategoryFormDialog from "./CategoryFormDialog";

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
          action={async () => {
            await onDelete(category.id);
          }}
        >
          <SubmitButton
            variant="destructive"
            pendingText={`${t("Deleting")}...`}
          >
            {t("Delete")}
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  );
}
