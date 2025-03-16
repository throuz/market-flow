"use client";

import { useTranslations } from "next-intl";
import { Database } from "@/database.types";
import useOrderStatus from "@/hooks/useOrderStatus";
import useProductUnits from "@/hooks/useProductUnits";
import usePaymentMethods from "@/hooks/usePaymentMethods";

const formatDateTime = (date: string) => new Date(date).toLocaleString();

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

  const getStatusLabel = (status: string) =>
    orderStatusOptions.find((option) => option.value === status)?.label || "-";

  const getProductUnitLabel = (productId: number | undefined) => {
    const foundProduct = products.find((product) => product.id === productId);
    return foundProduct?.unit ? productUnitMap[foundProduct.unit] : "-";
  };

  const getPaymentLabel = (method: string) =>
    paymentMethodOptions.find((option) => option.value === method)?.label ||
    "-";

  const getProductName = (productId: number | undefined) => {
    const foundProduct = products.find((product) => product.id === productId);
    return foundProduct?.name ?? "-";
  };

  const calculateSubtotal = () => {
    return order.orderItems.reduce(
      (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
      0
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <strong>{t("Email")}:</strong> {profile?.email ?? ""}
      </div>
      <div>
        <strong>{t("Status")}:</strong> {getStatusLabel(order.status)}
      </div>
      <div>
        <strong>{t("Phone")}:</strong> {order.phone}
      </div>
      <div>
        <strong>{t("Address")}:</strong> {order.address}
      </div>
      <div>
        <strong>{t("Estimated Delivery Time")}:</strong>{" "}
        {formatDateTime(order.estimated_delivery_time)}
      </div>
      <div>
        <strong>{t("Payment Method")}:</strong>{" "}
        {getPaymentLabel(order.payment_method)}
      </div>
      {order.payment_method === "money_transfer" && (
        <div>
          <strong>{t("Account Last 5 Digits")}:</strong>{" "}
          {order.account_last_five}
        </div>
      )}
      <div>
        <strong>{t("Order Items")}:</strong>
        <ul className="space-y-2 mt-2">
          {order.orderItems.map((item, index) => (
            <li key={index} className="border p-2 rounded">
              <div>
                <strong>{t("Product Name")}:</strong>{" "}
                {getProductName(item.product_id)}
              </div>
              <div>
                <strong>{t("Price")}:</strong> ${item.price?.toFixed(2)}
              </div>
              <div>
                <strong>{t("Quantity")}:</strong> {item.quantity}{" "}
                {getProductUnitLabel(item.product_id)}
              </div>
              <div>
                <strong>{t("Total")}:</strong> $
                {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-lg font-semibold">
        {t("Subtotal")}: ${calculateSubtotal().toFixed(2)}
      </div>
    </div>
  );
}
