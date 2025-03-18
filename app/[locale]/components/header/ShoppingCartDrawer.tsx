"use client";

import * as React from "react";

import { useTranslations } from "next-intl";
import { Minus, Plus, ShoppingCart, Trash, X } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Database } from "@/database.types";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/i18n/navigation";
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
  const [isOpen, setIsOpen] = React.useState(false);
  const itemCount = cart.length;

  const router = useRouter();

  const productMap = React.useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  // Calculate subtotal for each item and total for the cart
  const subtotal = cart.reduce((acc, item) => {
    const product = productMap.get(item.product_id);
    return product ? acc + product.price_per_unit * item.quantity : acc;
  }, 0);

  const handleProceedToCheckout = () => {
    router.push("/customer/checkout");
    setIsOpen(false);
  };

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

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

        <div className="p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("Your cart is empty")}.
            </p>
          ) : (
            cart.map((item) => {
              const product = productMap.get(item.product_id);
              if (!product) return null;

              const itemSubtotal = product.price_per_unit * item.quantity;

              return (
                <div
                  key={item.product_id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(product.price_per_unit)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("Subtotal")}: {formatPrice(itemSubtotal)}
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
                      disabled={item.quantity === product.stock_quantity}
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
              );
            })
          )}
        </div>

        <DrawerFooter>
          {cart.length > 0 && (
            <>
              <div className="flex justify-between items-center">
                <p className="font-semibold">{t("Subtotal")}:</p>
                <p className="font-semibold">{formatPrice(subtotal)}</p>
              </div>
              <Button className="w-full" onClick={handleProceedToCheckout}>
                {t("Proceed to Checkout")}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
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
