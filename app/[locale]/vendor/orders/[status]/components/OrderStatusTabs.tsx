"use client";

import { Database } from "@/database.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/navigation";

interface OrderStatusTabsProps {
  status: Database["public"]["Enums"]["order_status"];
}

export default function OrderStatusTabs({ status }: OrderStatusTabsProps) {
  const router = useRouter();

  const orderStatusOptions: {
    label: string;
    value: Database["public"]["Enums"]["order_status"];
  }[] = [
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <Tabs
      value={status}
      onValueChange={(value) => router.push(`/vendor/orders/${value}`)}
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
