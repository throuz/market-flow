"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Database } from "@/database.types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useOrderStatus from "@/hooks/useOrderStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import useProductUnits from "@/hooks/useProductUnits";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import SubmitButton from "@/components/SubmitButton";

interface OrderFormProps {
  profiles: Database["public"]["Tables"]["profiles"]["Row"][];
  products: Database["public"]["Tables"]["products"]["Row"][];
  initialData: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Row"][];
  };
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function OrderForm({
  profiles,
  products,
  initialData,
  onSubmit,
}: OrderFormProps) {
  const t = useTranslations();
  const { orderStatusOptions } = useOrderStatus();
  const { productUnitMap } = useProductUnits();
  const { paymentMethodMap } = usePaymentMethods();

  const userEmail = profiles.find(
    (profile) => profile.id === initialData.user_id
  )?.email;

  const productMap = useMemo(
    () =>
      products.reduce<
        Record<number, Database["public"]["Tables"]["products"]["Row"]>
      >((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {}),
    [products]
  );

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">{t("Status")}</Label>
        <Select name="status" defaultValue={initialData.status} required>
          <SelectTrigger id="status">
            <SelectValue placeholder={t("Select status")} />
          </SelectTrigger>
          <SelectContent>
            {orderStatusOptions.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{t("Email")}</Label>
        <div className="p-2 bg-muted rounded-md">{userEmail}</div>
      </div>

      <div className="space-y-2">
        <Label>{t("Phone")}</Label>
        <div className="p-2 bg-muted rounded-md">{initialData.phone}</div>
      </div>

      <div className="space-y-2">
        <Label>{t("Address")}</Label>
        <div className="p-2 bg-muted rounded-md">{initialData.address}</div>
      </div>

      <div className="space-y-2">
        <Label>{t("Estimated Delivery Time")}</Label>
        <div className="p-2 bg-muted rounded-md">
          {initialData.estimated_delivery_time}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("Payment Method")}</Label>
        <div className="p-2 bg-muted rounded-md">
          {paymentMethodMap[initialData.payment_method]}
        </div>
      </div>

      {initialData.payment_method === "money_transfer" && (
        <div className="space-y-2">
          <Label>{t("Account Last 5 Digits")}</Label>
          <div className="p-2 bg-muted rounded-md">
            {initialData.account_last_five}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>{t("Order Items")}</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Product Name")}</TableHead>
              <TableHead>{t("Price")}</TableHead>
              <TableHead>{t("Quantity")}</TableHead>
              <TableHead>{t("Total")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.orderItems.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPrice(item.price)}</TableCell>
                  <TableCell>
                    {item.quantity} {item.unit}
                  </TableCell>
                  <TableCell>
                    {formatPrice(item.price * item.quantity)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="text-lg font-semibold">
        {t("Subtotal")}: {formatPrice(initialData.total_price)}
      </div>

      <SubmitButton className="w-full">{t("Save")}</SubmitButton>
    </form>
  );
}
