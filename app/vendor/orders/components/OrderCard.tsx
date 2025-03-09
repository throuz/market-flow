"use client";

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

const getStatusStyle = (
  status: Database["public"]["Enums"]["order_status"]
) => {
  switch (status) {
    case "pending":
      return "bg-yellow-200 text-yellow-800";
    case "processing":
      return "bg-blue-200 text-blue-800";
    case "shipped":
      return "bg-indigo-200 text-indigo-800";
    case "out_for_delivery":
      return "bg-purple-200 text-purple-800";
    case "delivered":
      return "bg-emerald-200 text-emerald-800";
    case "completed":
      return "bg-green-200 text-green-800";
    case "cancelled":
      return "bg-red-200 text-red-800";
    case "refunded":
      return "bg-orange-200 text-orange-800";
    case "failed":
      return "bg-rose-200 text-rose-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

interface OrderCardProps {
  order: Database["public"]["Tables"]["orders"]["Row"] & {
    orderItems: Database["public"]["Tables"]["order_items"]["Update"][];
  };
  profiles: Database["public"]["Tables"]["profiles"]["Row"][];
  products: Database["public"]["Tables"]["products"]["Row"][];
  onUpdate: (id: number, formData: FormData) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function OrderCard({
  order,
  profiles,
  products,
  onUpdate,
  onDelete,
}: OrderCardProps) {
  const getUserEmail = (userId: string) =>
    profiles.find((profile) => profile.id === userId)?.email ?? "";

  return (
    <Card key={order.id}>
      <CardHeader>
        <CardTitle>Order #{order.id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <span className="font-semibold">Total Price:</span> NT$
          {order.total_price.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(order.status)}`}
          >
            {order.status
              ?.split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ") || "N/A"}
          </span>
        </p>
        <p>
          <span className="font-semibold">User Email:</span>{" "}
          {getUserEmail(order.user_id)}
        </p>
        <p>
          <span className="font-semibold">Created:</span>{" "}
          {new Date(order.created_at).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Last Updated:</span>{" "}
          {new Date(order.updated_at).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-4">
        <OrderFormDialog
          profiles={profiles}
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
