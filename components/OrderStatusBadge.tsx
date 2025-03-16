"use client";

import { cn } from "@/lib/utils";
import { Database } from "@/database.types";
import { Badge } from "@/components/ui/badge";
import useOrderStatus from "@/hooks/useOrderStatus";

const statusVariants: Record<
  Database["public"]["Enums"]["order_status"],
  string
> = {
  pending: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300",
  processing: "bg-blue-200 text-blue-800 hover:bg-blue-300",
  completed: "bg-green-200 text-green-800 hover:bg-green-300",
  cancelled: "bg-red-200 text-red-800 hover:bg-red-300",
};

interface OrderStatusBadgeProps {
  status: Database["public"]["Enums"]["order_status"];
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { orderStatusMap } = useOrderStatus();

  return (
    <Badge
      className={cn(
        statusVariants[status] || "bg-gray-200 text-gray-800",
        "transition-colors duration-200 ease-in-out"
      )}
    >
      {orderStatusMap[status]}
    </Badge>
  );
}
