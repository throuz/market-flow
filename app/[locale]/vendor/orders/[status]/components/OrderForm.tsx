"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useOrderStatusOptions from "../hooks/useOrderStatusOptions";

interface OrderFormProps {
  profiles: Database["public"]["Tables"]["profiles"]["Row"][];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  products: Database["public"]["Tables"]["products"]["Row"][];
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Update"][];
  };
}

export default function OrderForm({
  profiles,
  categories,
  products,
  onSubmit,
  initialData,
}: OrderFormProps) {
  const t = useTranslations();

  const orderStatusOptions = useOrderStatusOptions();

  const [orderItems, setOrderItems] = useState<
    Database["public"]["Tables"]["order_items"]["Update"][]
  >(initialData?.orderItems ?? [{ quantity: 1 }]);

  const calculateSubtotal = (items: typeof orderItems) => {
    return items.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
      0
    );
  };

  const getProductUnit = (productId?: number) =>
    products.find((product) => product.id === productId)?.unit ?? "";

  const userIdOptions: {
    label: string;
    value: Database["public"]["Tables"]["orders"]["Row"]["user_id"];
  }[] = profiles.map((profile) => ({
    label: profile.email,
    value: profile.id,
  }));

  const productIdOptions = products.reduce<
    Record<
      string,
      {
        label: string;
        value: Database["public"]["Tables"]["products"]["Row"]["id"];
      }[]
    >
  >((acc, product) => {
    const categoryName =
      categories.find((c) => c.id === product.category_id)?.name ||
      "Uncategorized";

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push({
      label: product.name,
      value: product.id,
    });

    return acc;
  }, {});

  const addOrderItem = () => {
    setOrderItems([...orderItems, { quantity: 1 }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) return;

    setOrderItems((items) =>
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              product_id: parseInt(productId),
              price: product.price_per_unit,
            }
          : item
      )
    );
  };

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="user_id">{t("User")}</Label>
        <Select
          name="user_id"
          defaultValue={initialData?.user_id}
          required
          disabled={!!initialData}
        >
          <SelectTrigger id="user_id">
            <SelectValue placeholder={t("Select user")} />
          </SelectTrigger>
          <SelectContent>
            {userIdOptions.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!!initialData && (
          <Input
            type="hidden"
            name="user_id"
            defaultValue={initialData?.user_id}
          />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">{t("Status")}</Label>
        <Select name="status" defaultValue={initialData?.status} required>
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
        <Label htmlFor="phone">{t("Phone")}</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={initialData?.phone}
          required
          pattern="[0-9]{10}"
          title={t("Phone number must be 10 digits")}
          placeholder={t("Enter phone number")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">{t("Address")}</Label>
        <Input
          type="text"
          id="address"
          name="address"
          defaultValue={initialData?.address}
          required
          pattern=".{10,}"
          title={t("Address must be at least 10 characters long")}
          placeholder={t("Enter delivery address")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estimated_delivery_time">
          {t("Estimated Delivery Time")}
        </Label>
        <Input
          type="datetime-local"
          id="estimated_delivery_time"
          name="estimated_delivery_time"
          defaultValue={initialData?.estimated_delivery_time.slice(0, 16)}
          required
          // 1 day later & UTC+8 timezone
          min={new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 16)}
          // 1 month later & UTC+8 timezone
          max={new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
          )
            .toISOString()
            .slice(0, 16)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{t("Order Items")}</h3>
          <div className="flex gap-4 items-center">
            <div className="text-lg">
              {t("Subtotal")}: ${calculateSubtotal(orderItems).toFixed(2)}
            </div>
            <Button type="button" variant="secondary" onClick={addOrderItem}>
              {t("Add Item")}
            </Button>
          </div>
        </div>

        {orderItems.map((item, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div className="font-medium">
                {t("Item")} #{index + 1}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeOrderItem(index)}
              >
                {t("Remove")}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`order_items.${index}.product_id`}>
                  {t("Product")}
                </Label>
                <Select
                  name={`order_items.${index}.product_id`}
                  defaultValue={item.product_id?.toString()}
                  onValueChange={(value) => handleProductSelect(index, value)}
                  required
                >
                  <SelectTrigger id={`order_items.${index}.product_id`}>
                    <SelectValue placeholder={t("Select product")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(productIdOptions).map(
                      ([category, options]) => (
                        <div key={category}>
                          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                            {category}
                          </div>
                          {options
                            .filter(
                              (option) =>
                                !orderItems.some(
                                  (item, idx) =>
                                    idx !== index &&
                                    item.product_id === option.value
                                )
                            )
                            .map(({ label, value }) => (
                              <SelectItem key={value} value={value.toString()}>
                                {label}
                              </SelectItem>
                            ))}
                          <Separator />
                        </div>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`order_items.${index}.price`}>
                  {t("Price")}
                </Label>
                <div className="p-2 bg-muted rounded-md">
                  NT${item.price?.toFixed(2) ?? "0.00"}
                </div>
                <Input
                  type="hidden"
                  name={`order_items.${index}.price`}
                  value={item.price}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`order_items.${index}.quantity`}>
                  {t("Quantity")}
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    name={`order_items.${index}.quantity`}
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 1;
                      setOrderItems((items) =>
                        items.map((item, i) =>
                          i === index
                            ? { ...item, quantity: newQuantity }
                            : item
                        )
                      );
                    }}
                    min="1"
                    required
                    className="pr-12"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                    {getProductUnit(item.product_id)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              {t("Item total")}: $
              {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        {t("Save")}
      </Button>
    </form>
  );
}
