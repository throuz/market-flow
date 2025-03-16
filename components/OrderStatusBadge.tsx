"use client";

import { Database } from "@/database.types";
import useOrderStatus from "@/hooks/useOrderStatus";
import { Badge } from "@/components/ui/badge";

const statusVariants: Record<
  Database["public"]["Enums"]["order_status"],
  string
> = {
  pending: "bg-yellow-200 text-yellow-800",
  processing: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
  cancelled: "bg-red-200 text-red-800",
};

interface OrderStatusBadgeProps {
  status: Database["public"]["Enums"]["order_status"];
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { orderStatusOptions } = useOrderStatus();
  const label =
    orderStatusOptions.find((option) => option.value === status)?.label ??
    "N/A";

  return (
    <Badge className={statusVariants[status] || "bg-gray-200 text-gray-800"}>
      {label}
    </Badge>
  );
}
