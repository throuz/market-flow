"use client";

import { ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/providers/shopping-cart-provider";
import { Badge } from "@/components/ui/badge";

export default function ShoppingCartLink() {
  const cart = useCartStore((store) => store.cart);
  const itemCount = cart.length;

  return (
    <Link href="/cart" className="relative">
      <Button variant="ghost" size="icon">
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <Badge variant="destructive" className="absolute -top-2 -right-2">
            {itemCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}
