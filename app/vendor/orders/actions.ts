"use server";

import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const order: Database["public"]["Tables"]["orders"]["Insert"] = {
    status: formData.get(
      "status"
    ) as Database["public"]["Enums"]["order_status"],
    total_price: Number(formData.get("total_price")),
    user_id: formData.get("user_id") as string,
  };

  try {
    const { error } = await supabase.from("orders").insert(order);
    if (error) throw error;
    revalidatePath("/vendor/orders");
  } catch (error) {
    throw new Error("Order creation failed");
  }
}

export async function updateOrder(id: number, formData: FormData) {
  const supabase = await createClient();
  const order: Database["public"]["Tables"]["orders"]["Update"] = {
    status: formData.get(
      "status"
    ) as Database["public"]["Enums"]["order_status"],
    total_price: Number(formData.get("total_price")),
    user_id: formData.get("user_id") as string,
  };

  try {
    const { error } = await supabase.from("orders").update(order).eq("id", id);
    if (error) throw error;
    revalidatePath("/vendor/orders");
  } catch (error) {
    throw new Error("Order update failed");
  }
}

export async function deleteOrder(id: number) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/vendor/orders");
  } catch (error) {
    throw new Error("Order deletion failed");
  }
}
