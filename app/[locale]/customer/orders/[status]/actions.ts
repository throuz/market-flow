"use server";

import { Database } from "@/database.types";
import { revalidatePath } from "next/cache";
import { formatTimestamptz } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export async function cancelOrder(id: number) {
  const supabase = await createClient();

  const order: Database["public"]["Tables"]["orders"]["Update"] = {
    status: "cancelled",
    updated_at: formatTimestamptz(new Date().toString()),
  };

  try {
    const { error: updateError } = await supabase
      .from("orders")
      .update(order)
      .eq("id", id);

    if (updateError) throw updateError;

    revalidatePath("/customer/orders");
  } catch (error) {
    throw new Error("Order cancel failed");
  }
}
