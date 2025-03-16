"use client";

import { Database } from "@/database.types";
import { useRouter } from "@/i18n/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useOrderStatus from "@/hooks/useOrderStatus";

interface OrderStatusTabsProps {
  status: Database["public"]["Enums"]["order_status"];
}

export default function OrderStatusTabs({ status }: OrderStatusTabsProps) {
  const router = useRouter();

  const { orderStatusOptions } = useOrderStatus();

  return (
    <Tabs
      value={status}
      onValueChange={(value) => router.push(`/admin/orders/${value}`)}
      className="w-full overflow-x-auto"
    >
      <TabsList>
        {orderStatusOptions.map(({ label, value }) => (
          <TabsTrigger key={value} value={value}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
