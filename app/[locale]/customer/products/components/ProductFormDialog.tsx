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
import { useCartStore } from "@/providers/shopping-cart-provider";
import { CartItem } from "@/stores/shopping-cart-store";

interface ProductDialogProps {
  initialData: Database["public"]["Tables"]["products"]["Row"];
}

export default function ProductFormDialog({ initialData }: ProductDialogProps) {
  const t = useTranslations();
  const addToCart = useCartStore((store) => store.addToCart);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("Add to cart")}</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg overflow-y-scroll max-w-[90vw] md:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t("Add to cart")}</DialogTitle>
        </DialogHeader>
        <ProductForm
          initialData={initialData}
          onSubmit={(formData) => {
            const cartItem: CartItem = {
              product_id: Number(formData.get("product_id")),
              quantity: Number(formData.get("quantity")),
            };
            addToCart(cartItem);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
