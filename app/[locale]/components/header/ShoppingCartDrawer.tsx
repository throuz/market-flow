"use client";

import * as React from "react";

import { useTranslations } from "next-intl";
import { Minus, Plus, ShoppingCart, Trash, X } from "lucide-react";

import { Database } from "@/database.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/providers/shopping-cart-provider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ShoppingCartDrawerProps {
  products: Database["public"]["Tables"]["products"]["Row"][];
}

export default function ShoppingCartDrawer({
  products,
}: ShoppingCartDrawerProps) {
  const t = useTranslations();
  const cart = useCartStore((store) => store.cart);
  const removeFromCart = useCartStore((store) => store.removeFromCart);
  const updateCartItem = useCartStore((store) => store.updateCartItem);
  const itemCount = cart.length;
  const [isOpen, setIsOpen] = React.useState(false);

  const getProductName = (productId: number) => {
    return products.find((product) => product.id === productId)?.name;
  };

  const getProductPrice = (productId: number) => {
    return products.find((product) => product.id === productId)?.price_per_unit;
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      {/* Shopping Cart Button (Trigger) */}
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge variant="destructive" className="absolute top-1 right-1">
              {itemCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      {/* Cart Drawer Content */}
      <DrawerContent className="top-0 mt-0 ml-20 md:w-1/4 md:ml-auto rounded-none">
        <DrawerHeader>
          <div className="flex justify-between items-center">
            <DrawerTitle>{t("Shopping Cart")}</DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Cart Items */}
        <div className="p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("Your cart is empty")}.
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="font-semibold">
                    {getProductName(item.product_id)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${getProductPrice(item.product_id)?.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      updateCartItem(item.product_id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      updateCartItem(item.product_id, item.quantity + 1)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Buttons */}
        <DrawerFooter>
          {cart.length > 0 && (
            <>
              <Button className="w-full">{t("Proceed to Checkout")}</Button>
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  {t("Continue Shopping")}
                </Button>
              </DrawerClose>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
