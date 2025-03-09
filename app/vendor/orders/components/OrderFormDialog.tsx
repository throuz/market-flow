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
  userIdOptions: {
    label: string;
    value: Database["public"]["Tables"]["orders"]["Row"]["user_id"];
  }[];
  productIdOptions: {
    label: string;
    value: Database["public"]["Tables"]["products"]["Row"]["id"];
    price: number;
  }[];
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Update"][];
  };
}

export default function OrderFormDialog({
  userIdOptions,
  productIdOptions,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Order" : "Add New Order"}
          </DialogTitle>
        </DialogHeader>
        <OrderForm
          userIdOptions={userIdOptions}
          productIdOptions={productIdOptions}
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
