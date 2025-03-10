"use client";

import { useState } from "react";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orderStatusOptions: Database["public"]["Enums"]["order_status"][] = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
  "failed",
];

interface OrderFormProps {
  profiles: Database["public"]["Tables"]["profiles"]["Row"][];
  products: Database["public"]["Tables"]["products"]["Row"][];
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Update"][];
  };
}

export default function OrderForm({
  profiles,
  products,
  onSubmit,
  initialData,
}: OrderFormProps) {
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
  }[] = profiles
    .filter((profile) => profile.role === "customer")
    .map((profile) => ({
      label: profile.email,
      value: profile.id,
    }));

  const productIdOptions: {
    label: string;
    value: Database["public"]["Tables"]["products"]["Row"]["id"];
  }[] = products.map((product) => ({
    label: product.name,
    value: product.id,
  }));

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
        <Label htmlFor="user_id">User</Label>
        <Select
          name="user_id"
          defaultValue={initialData?.user_id}
          required
          disabled={!!initialData}
        >
          <SelectTrigger id="user_id">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {userIdOptions.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={initialData?.status} required>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {orderStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Order Items</h3>
          <div className="flex gap-4 items-center">
            <div className="text-lg">
              Subtotal: ${calculateSubtotal(orderItems).toFixed(2)}
            </div>
            <Button type="button" variant="secondary" onClick={addOrderItem}>
              Add Item
            </Button>
          </div>
        </div>

        {orderItems.map((item, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <div className="font-medium">Item #{index + 1}</div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeOrderItem(index)}
              >
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`order_items.${index}.product_id`}>
                  Product
                </Label>
                <Select
                  name={`order_items.${index}.product_id`}
                  defaultValue={item.product_id?.toString()}
                  onValueChange={(value) => handleProductSelect(index, value)}
                  required
                >
                  <SelectTrigger id={`order_items.${index}.product_id`}>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productIdOptions
                      .filter(
                        (option) =>
                          !orderItems.some(
                            (item, idx) =>
                              idx !== index && item.product_id === option.value
                          )
                      )
                      .map(({ label, value }) => (
                        <SelectItem key={value} value={value.toString()}>
                          {label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`order_items.${index}.price`}>Price</Label>
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
                  Quantity
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
              Item total: $
              {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
}
