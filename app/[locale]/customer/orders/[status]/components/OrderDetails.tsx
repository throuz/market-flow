"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Database } from "@/database.types";
import useOrderStatus from "@/hooks/useOrderStatus";
import useProductUnits from "@/hooks/useProductUnits";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { formatDateTime } from "@/lib/utils";

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
  const { orderStatusOptions } = useOrderStatus();
  const { productUnitMap } = useProductUnits();
  const { paymentMethodOptions } = usePaymentMethods();

  // Create product lookup map
  const productMap = useMemo(
    () =>
      products.reduce(
        (acc, product) => {
          acc[product.id] = product;
          return acc;
        },
        {} as Record<number, Database["public"]["Tables"]["products"]["Row"]>
      ),
    [products]
  );

  const getStatusLabel = (status: string) =>
    orderStatusOptions.find((option) => option.value === status)?.label || "-";

  const getPaymentLabel = (method: string) =>
    paymentMethodOptions.find((option) => option.value === method)?.label ||
    "-";

  const calculateSubtotal = useMemo(
    () =>
      order.orderItems.reduce(
        (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
        0
      ),
    [order.orderItems]
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
            <strong>{t("Phone")}:</strong> {order.phone}
          </p>
          <p>
            <strong>{t("Address")}:</strong> {order.address}
          </p>
          <p>
            <strong>{t("Estimated Delivery Time")}:</strong>{" "}
            {formatDateTime(order.estimated_delivery_time)}
          </p>
          <p>
            <strong>{t("Payment Method")}:</strong>{" "}
            {getPaymentLabel(order.payment_method)}
          </p>
          {order.payment_method === "money_transfer" && (
            <p>
              <strong>{t("Account Last 5 Digits")}:</strong>{" "}
              {order.account_last_five}
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
                    <TableCell>${item.price?.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.quantity}{" "}
                      {product?.unit ? productUnitMap[product.unit] : "-"}
                    </TableCell>
                    <TableCell>
                      ${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="text-lg font-semibold">
          {t("Subtotal")}: ${calculateSubtotal.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
}
