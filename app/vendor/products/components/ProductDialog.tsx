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

import ProductForm from "./ProductForm";

interface ProductDialogProps {
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["products"]["Row"];
}

export default function ProductDialog({
  categories,
  onSubmit,
  initialData,
}: ProductDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialData ? "outline" : "default"}>
          {initialData ? "Edit" : "Add Product"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Product" : "Add New Product"}
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
