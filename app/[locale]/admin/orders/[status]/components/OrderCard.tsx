"use client";

import { useMemo } from "react";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import usePaymentMethods from "@/hooks/usePaymentMethods";
import { formatDateTime, formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import OrderFormDialog from "./OrderFormDialog";

interface OrderCardProps {
  order: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Row"][];
  };
  profiles: Database["public"]["Tables"]["profiles"]["Row"][];
  products: Database["public"]["Tables"]["products"]["Row"][];
  onUpdate: (id: number, formData: FormData) => Promise<void>;
}

export default function OrderCard({
  order,
  profiles,
  products,
  onUpdate,
}: OrderCardProps) {
  const t = useTranslations();

  const { paymentMethodMap } = usePaymentMethods();

  const userEmail = useMemo(
    () => profiles.find((profile) => profile.id === order.user_id)?.email ?? "",
    [profiles, order.user_id]
  );

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
          <p className="font-medium">{formatPrice(order.total_price)}</p>
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
          <p className="text-sm text-gray-500">{t("User Email")}</p>
          <p className="font-medium truncate">{userEmail}</p>
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
      <CardFooter className="justify-end gap-4 pt-4 border-t">
        <OrderFormDialog
          profiles={profiles}
          products={products}
          initialData={order}
          onSubmit={(formData) => onUpdate(order.id, formData)}
        />
      </CardFooter>
    </Card>
  );
}
