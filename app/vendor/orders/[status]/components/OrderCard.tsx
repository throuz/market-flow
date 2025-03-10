"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OrderFormDialog from "./OrderFormDialog";
import { Button } from "@/components/ui/button";
import { Database } from "@/database.types";

const formatDateTime = (date: string) => new Date(date).toLocaleString();

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

const orderStatusOptions: {
  label: string;
  value: Database["public"]["Enums"]["order_status"];
}[] = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const OrderStatus = ({
  status,
}: {
  status: Database["public"]["Enums"]["order_status"];
}) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(status)}`}
    >
      {orderStatusOptions.find((option) => option.value === status)?.label ??
        "N/A"}
    </span>
  );
};

interface OrderCardProps {
  order: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Update"][];
  };
  profiles: Database["public"]["Tables"]["profiles"]["Row"][];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  products: Database["public"]["Tables"]["products"]["Row"][];
  onUpdate: (id: number, formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function OrderCard({
  order,
  profiles,
  categories,
  products,
  onUpdate,
  onDelete,
}: OrderCardProps) {
  const userEmail = useMemo(
    () => profiles.find((profile) => profile.id === order.user_id)?.email ?? "",
    [profiles, order.user_id]
  );

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-800">
          Order #{order.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 py-4 border-t">
        <div>
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="font-medium">NT${order.total_price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <OrderStatus status={order.status} />
        </div>
        <div>
          <p className="text-sm text-gray-500">User Email</p>
          <p className="font-medium truncate">{userEmail}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">{order.phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">{order.address}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Estimated Delivery</p>
          <p className="font-medium">
            {formatDateTime(order.estimated_delivery_time)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created</p>
          <p className="font-medium">{formatDateTime(order.created_at)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Last Updated</p>
          <p className="font-medium">{formatDateTime(order.updated_at)}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-4 pt-4 border-t">
        <OrderFormDialog
          profiles={profiles}
          categories={categories}
          products={products}
          initialData={order}
          onSubmit={(formData) => onUpdate(order.id, formData)}
        />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onDelete(order.id);
          }}
        >
          <Button variant="destructive">Delete</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
