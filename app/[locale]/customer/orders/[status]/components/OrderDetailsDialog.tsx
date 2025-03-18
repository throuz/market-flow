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
import OrderDetails from "./OrderDetails";

interface OrderDetailsDialogProps {
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  order: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Row"][];
  };
}

export default function OrderDetailsDialog({
  profile,
  order,
}: OrderDetailsDialogProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("View")}</Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg overflow-y-scroll max-w-[90vw] md:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t("View Order Details")}</DialogTitle>
        </DialogHeader>
        <OrderDetails profile={profile} order={order} />
      </DialogContent>
    </Dialog>
  );
}
