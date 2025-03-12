"use client";

import { Database } from "@/database.types";
import useOrderStatusOptions from "../../../../../../hooks/useOrderStatusOptions";

const getStatusStyle = (
  status: Database["public"]["Enums"]["order_status"]
) => {
  switch (status) {
    case "pending":
      return "bg-yellow-200 text-yellow-800";
    case "processing":
      return "bg-blue-200 text-blue-800";
    case "completed":
      return "bg-green-200 text-green-800";
    case "cancelled":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

interface OrderStatusBadgeProps {
  status: Database["public"]["Enums"]["order_status"];
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const orderStatusOptions = useOrderStatusOptions();

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(status)}`}
    >
      {orderStatusOptions.find((option) => option.value === status)?.label ??
        "N/A"}
    </span>
  );
}
