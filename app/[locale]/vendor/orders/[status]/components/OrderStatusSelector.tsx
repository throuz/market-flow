"use client";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import useOrderStatus from "@/hooks/useOrderStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderStatus = Database["public"]["Enums"]["order_status"];

export default function OrderStatusSelector({
  status,
}: {
  status: OrderStatus;
}) {
  const { orderStatusOptions } = useOrderStatus();
  const t = useTranslations();

  // Define allowed status transitions
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["pending", "processing"],
    processing: ["processing", "completed", "cancelled"],
    completed: ["completed"],
    cancelled: ["cancelled"],
  };

  // Filter options based on current status
  const filteredOptions = orderStatusOptions.filter((option) =>
    allowedTransitions[status].includes(option.value)
  );

  const disabled = status === "completed" || status === "cancelled";

  return (
    <Select name="status" defaultValue={status} required disabled={disabled}>
      <SelectTrigger id="status">
        <SelectValue placeholder={t("Select status")} />
      </SelectTrigger>
      <SelectContent>
        {filteredOptions.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
