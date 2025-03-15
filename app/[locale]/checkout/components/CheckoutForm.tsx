"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/providers/shopping-cart-provider";
import { Database } from "@/database.types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash } from "lucide-react";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CheckoutFormProps {
  products: Database["public"]["Tables"]["products"]["Row"][];
}

export default function CheckoutForm({ products }: CheckoutFormProps) {
  const cart = useCartStore((store) => store.cart);
  const removeFromCart = useCartStore((store) => store.removeFromCart);
  const updateCartItem = useCartStore((store) => store.updateCartItem);
  const t = useTranslations();
  const router = useRouter();
  const { paymentMethodOptions } = usePaymentMethods();

  const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null);
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");

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

  const handlePlaceOrder = () => {
    console.log("Order placed with:", { phone, address, paymentMethod });
    router.push("/order-confirmation");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Your Cart")}</CardTitle>
        </CardHeader>
        <CardContent>
          {cart.length === 0 ? (
            <p className="text-gray-500">{t("Your cart is empty")}</p>
          ) : (
            cart.map((item) => {
              const product = productMap.get(item.product_id);
              if (!product) return null;

              return (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center p-4 border-b"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-500">
                      ${product.price_per_unit.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
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
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateCartItem(item.product_id, item.quantity + 1)
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
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
            <div>
              <Label htmlFor="phone">{t("Phone")}</Label>
              <Input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder={t("Enter phone number")}
              />
            </div>
            <div>
              <Label htmlFor="address">{t("Address")}</Label>
              <Input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder={t("Enter delivery address")}
              />
            </div>
            <div>
              <Label htmlFor="payment_method">{t("Payment Method")}</Label>
              <Select
                name="payment_method"
                value={paymentMethod ?? ""}
                onValueChange={setPaymentMethod}
                required
              >
                <SelectTrigger id="payment_method">
                  <SelectValue placeholder={t("Select payment method")} />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {paymentMethod === "money_transfer" && (
              <div className="space-y-2">
                <Label htmlFor="account_last_five">
                  {t("Account Last 5 Digits")}
                </Label>
                <Input
                  type="text"
                  id="account_last_five"
                  name="account_last_five"
                  defaultValue=""
                  required
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
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        className="w-full"
        onClick={handlePlaceOrder}
        disabled={!phone || !address || !paymentMethod}
      >
        {t("Place Order")}
      </Button>
    </div>
  );
}
