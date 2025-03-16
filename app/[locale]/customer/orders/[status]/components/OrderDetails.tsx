"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import useProductUnits from "@/hooks/useProductUnits";
import { Card, CardContent } from "@/components/ui/card";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import { formatDateTime, formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderDetailsProps {
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  products: Database["public"]["Tables"]["products"]["Row"][];
  order: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Row"][];
  };
}

export default function OrderDetails({
  profile,
  products,
  order,
}: OrderDetailsProps) {
  const t = useTranslations();
  const { productUnitMap } = useProductUnits();
  const { paymentMethodMap } = usePaymentMethods();

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
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-2">
          <p>
            <strong>{t("Email")}:</strong> {profile?.email ?? "-"}
          </p>
          <p>
            <strong>{t("Status")}:</strong>{" "}
            <OrderStatusBadge status={order.status} />
          </p>
          <p>
            <strong>{t("Phone")}:</strong> {order.phone ?? "-"}
          </p>
          <p>
            <strong>{t("Address")}:</strong> {order.address ?? "-"}
          </p>
          <p>
            <strong>{t("Estimated Delivery Time")}:</strong>{" "}
            {order.estimated_delivery_time
              ? formatDateTime(order.estimated_delivery_time)
              : "-"}
          </p>
          <p>
            <strong>{t("Payment Method")}:</strong>{" "}
            {paymentMethodMap[order.payment_method]}
          </p>
          {order.payment_method === "money_transfer" && (
            <p>
              <strong>{t("Account Last 5 Digits")}:</strong>{" "}
              {order.account_last_five ?? "-"}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold">{t("Order Items")}</h3>
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
              {order.orderItems.map((item, index) => {
                const product = productMap[item.product_id];
                return (
                  <TableRow key={index}>
                    <TableCell>{product?.name ?? "-"}</TableCell>
                    <TableCell>{formatPrice(item.price)}</TableCell>
                    <TableCell>
                      {item.quantity}{" "}
                      {product?.unit ? productUnitMap[product.unit] : "-"}
                    </TableCell>
                    <TableCell>
                      {formatPrice((item.price ?? 0) * (item.quantity ?? 0))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="text-lg font-semibold">
          {t("Subtotal")}: {formatPrice(order.total_price)}
        </div>
      </CardContent>
    </Card>
  );
}
