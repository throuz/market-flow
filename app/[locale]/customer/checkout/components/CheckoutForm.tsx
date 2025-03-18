"use client";

import * as React from "react";

import { useTranslations } from "next-intl";
import { Minus, Plus, Trash } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import SubmitButton from "@/components/SubmitButton";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import { useCartStore } from "@/providers/shopping-cart-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createOrder } from "../actions";

interface CheckoutFormProps {
  userId: string;
  products: Database["public"]["Tables"]["products"]["Row"][];
}

export default function CheckoutForm({ userId, products }: CheckoutFormProps) {
  const router = useRouter();
  const cart = useCartStore((store) => store.cart);
  const removeFromCart = useCartStore((store) => store.removeFromCart);
  const updateCartItem = useCartStore((store) => store.updateCartItem);
  const clearCart = useCartStore((store) => store.clearCart);
  const t = useTranslations();
  const { paymentMethodOptions } = usePaymentMethods();
  const [paymentMethod, setPaymentMethod] =
    React.useState<Database["public"]["Enums"]["payment_method"]>();
  const [isPending, startTransition] = React.useTransition();

  const productMap = React.useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      item.quantity * (productMap.get(item.product_id)?.price_per_unit ?? 0),
    0
  );

  const formAction = (formData: FormData): void => {
    startTransition(async () => {
      await createOrder(formData);
      clearCart();
      router.push("/customer/orders");
    });
  };

  return (
    <form action={formAction} className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Your Cart")}</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-gray-500">{t("Your cart is empty")}</p>
          ) : (
            cart.map((item, index) => {
              const product = productMap.get(item.product_id);
              if (!product) return null;

              const subtotal = item.quantity * product.price_per_unit;

              return (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center p-4 border-b"
                >
                  <Input
                    type="hidden"
                    name={`order_items.${index}.product_id`}
                    value={product.id}
                    required
                  />
                  <Input
                    type="hidden"
                    name={`order_items.${index}.name`}
                    value={product.name}
                    required
                  />
                  <Input
                    type="hidden"
                    name={`order_items.${index}.price`}
                    value={product.price_per_unit}
                    required
                  />
                  <Input
                    type="hidden"
                    name={`order_items.${index}.quantity`}
                    value={item.quantity}
                    required
                  />
                  <Input
                    type="hidden"
                    name={`order_items.${index}.unit`}
                    value={product.unit}
                    required
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-500">
                      {formatPrice(product.price_per_unit)}
                    </p>
                    <p className="text-gray-700 font-semibold">
                      {t("Subtotal")}: {formatPrice(subtotal)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateCartItem(item.product_id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateCartItem(item.product_id, item.quantity + 1)
                      }
                      disabled={item.quantity === product.stock_quantity}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("Order Details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="hidden"
              name="user_id"
              defaultValue={userId}
              required
            />
            <Input
              type="hidden"
              name="status"
              defaultValue="pending"
              required
            />
            <div>
              <Label htmlFor="phone">{t("Phone")}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                required
                pattern="[0-9]{10}"
                title={t("Phone number must be 10 digits")}
                placeholder={t("Enter phone number")}
              />
            </div>
            <div>
              <Label htmlFor="address">{t("Address")}</Label>
              <Input
                type="text"
                id="address"
                name="address"
                required
                pattern=".{10,}"
                title={t("Address must be at least 10 characters long")}
                placeholder={t("Enter delivery address")}
              />
            </div>
            <div>
              <Label htmlFor="estimated_delivery_time">
                {t("Estimated Delivery Time")}
              </Label>
              <Input
                type="datetime-local"
                id="estimated_delivery_time"
                name="estimated_delivery_time"
                required
                // 1 day later & UTC+8 timezone
                min={new Date(
                  Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
                )
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
            <div>
              <Label htmlFor="payment_method">{t("Payment Method")}</Label>
              <Select
                name="payment_method"
                onValueChange={(value) =>
                  setPaymentMethod(
                    value as Database["public"]["Enums"]["payment_method"]
                  )
                }
                required
              >
                <SelectTrigger id="payment_method">
                  <SelectValue placeholder={t("Select payment method")} />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {paymentMethod === "money_transfer" && (
              <div>
                <Label htmlFor="account_last_five">
                  {t("Account Last 5 Digits")}
                </Label>
                <Input
                  type="text"
                  id="account_last_five"
                  name="account_last_five"
                  pattern="\d{5}"
                  title={t("Please enter last 5 digits of the account")}
                  placeholder={t("Enter last 5 digits")}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("Order Summary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-lg font-semibold">
            <span>{t("Total Price")}:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
        </CardContent>
      </Card>

      <SubmitButton className="w-full" disabled={isPending}>
        {isPending ? t("Placing Order") + "..." : t("Place Order")}
      </SubmitButton>
    </form>
  );
}
