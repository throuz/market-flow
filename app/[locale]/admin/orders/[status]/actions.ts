"use server";

import { Database } from "@/database.types";
import { revalidatePath } from "next/cache";
import { formatTimestamptz } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export async function updateOrderStatus(id: number, formData: FormData) {
  const supabase = await createClient();

  const order: Database["public"]["Tables"]["orders"]["Update"] = {
    status: formData.get(
      "status"
    ) as Database["public"]["Enums"]["order_status"],
    updated_at: formatTimestamptz(new Date().toString()),
  };

  try {
    const { error: updateError } = await supabase
      .from("orders")
      .update(order)
      .eq("id", id);

    if (updateError) throw updateError;

    revalidatePath("/admin/orders");
  } catch (error) {
    throw new Error("Order status update failed");
  }
}
