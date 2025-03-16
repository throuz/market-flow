"use client";

import { useState } from "react";

import { Database } from "@/database.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CategoryForm from "./CategoryForm";
import { useTranslations } from "next-intl";

interface CategoryDialogProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["categories"]["Row"];
}

export default function CategoryFormDialog({
  onSubmit,
  initialData,
}: CategoryDialogProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialData ? "outline" : "default"}>
          {initialData ? t("Edit") : t("Add Category")}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg overflow-y-scroll max-w-[90vw] md:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("Edit Category") : t("Add New Category")}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          initialData={initialData}
          onSubmit={async (formData) => {
            await onSubmit(formData);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
