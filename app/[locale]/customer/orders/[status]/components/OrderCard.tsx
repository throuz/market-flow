"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import OrderStatusBadge from "./OrderStatusBadge";

const formatDateTime = (date: string) => new Date(date).toLocaleString();

interface OrderCardProps {
  order: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Update"][];
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const t = useTranslations();

  const { paymentMethodMap } = usePaymentMethods();

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800">
          {t("Order")} #{order.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 py-4 border-t">
        <div>
          <p className="text-sm text-gray-500">{t("Total Price")}</p>
          <p className="font-medium">NT${order.total_price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("Payment Method")}</p>
          <p className="font-medium capitalize">
            {paymentMethodMap[order.payment_method]}
          </p>
        </div>
        {order.payment_method === "money_transfer" &&
          order.account_last_five && (
            <div>
              <p className="text-sm text-gray-500">
                {t("Account Last 5 Digits")}
              </p>
              <p className="font-medium">{order.account_last_five}</p>
            </div>
          )}
        <div>
          <p className="text-sm text-gray-500">{t("Status")}</p>
          <OrderStatusBadge status={order.status} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("Phone")}</p>
          <p className="font-medium">{order.phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("Address")}</p>
          <p className="font-medium">{order.address}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("Estimated Delivery")}</p>
          <p className="font-medium">
            {formatDateTime(order.estimated_delivery_time)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("Created")}</p>
          <p className="font-medium">{formatDateTime(order.created_at)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("Last Updated")}</p>
          <p className="font-medium">{formatDateTime(order.updated_at)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
