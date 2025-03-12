"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ProductForm from "./ProductForm";

interface ProductDialogProps {
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["products"]["Row"];
}

export default function ProductFormDialog({
  categories,
  onSubmit,
  initialData,
}: ProductDialogProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialData ? "outline" : "default"}>
          {initialData ? t("Edit") : t("Add Product")}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg overflow-y-scroll max-w-[90vw] md:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t("Edit Product") : t("Add New Product")}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          initialData={initialData}
          categories={categories}
          onSubmit={async (formData) => {
            await onSubmit(formData);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
