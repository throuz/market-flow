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

import OrderForm from "./OrderForm";

interface OrderDialogProps {
  profiles: Database["public"]["Tables"]["profiles"]["Row"][];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  products: Database["public"]["Tables"]["products"]["Row"][];
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Update"][];
  };
}

export default function OrderFormDialog({
  profiles,
  categories,
  products,
  onSubmit,
  initialData,
}: OrderDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialData ? "outline" : "default"}>
          {initialData ? "Edit" : "Add Order"}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg overflow-y-scroll max-w-[90vw] md:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Order" : "Add New Order"}
          </DialogTitle>
        </DialogHeader>
        <OrderForm
          profiles={profiles}
          categories={categories}
          products={products}
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
