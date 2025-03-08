"use client";

import { Database } from "@/database.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orderStatusOptions: Database["public"]["Enums"]["order_status"][] = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
  "failed",
];

interface OrderFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: Database["public"]["Tables"]["orders"]["Row"];
}

export default function OrderForm({ onSubmit, initialData }: OrderFormProps) {
  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={initialData?.status}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {orderStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="total-price">Total Price</Label>
        <Input
          id="total-price"
          name="total_price"
          type="number"
          step="0.01"
          placeholder="Total Price"
          defaultValue={initialData?.total_price}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="user-id">User ID</Label>
        <Input
          id="user-id"
          name="user_id"
          placeholder="User ID"
          defaultValue={initialData?.user_id}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
}
