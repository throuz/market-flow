"use server";

import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { formatTimestamptz } from "@/lib/utils";

export async function createOrder(formData: FormData) {
  const supabase = await createClient();

  const order: Database["public"]["Tables"]["orders"]["Insert"] = {
    status: formData.get(
      "status"
    ) as Database["public"]["Enums"]["order_status"],
    user_id: formData.get("user_id") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    estimated_delivery_time: formatTimestamptz(
      String(formData.get("estimated_delivery_time"))
    ),
    total_price: 0,
    payment_method: formData.get(
      "payment_method"
    ) as Database["public"]["Enums"]["payment_method"],
    account_last_five: formData.get("account_last_five")
      ? Number(formData.get("account_last_five"))
      : null,
  };

  try {
    // Start a transaction
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (orderError) throw orderError;

    // Process order items
    const orderItems: Database["public"]["Tables"]["order_items"]["Insert"][] =
      [];
    const formEntries = Array.from(formData.entries());

    formEntries.forEach(([key, value]) => {
      if (key.startsWith("order_items.") && key.endsWith(".name")) {
        const index = key.split(".")[1];
        const name = String(value);
        const price = Number(formData.get(`order_items.${index}.price`));
        const quantity = Number(formData.get(`order_items.${index}.quantity`));
        const unit = String(
          formData.get(`order_items.${index}.unit`)
        ) as Database["public"]["Enums"]["product_unit"];

        orderItems.push({
          order_id: orderData.id,
          name,
          price,
          quantity,
          unit,
        });
      }
    });

    // Insert order items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update order total price
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const { error: updateError } = await supabase
      .from("orders")
      .update({ total_price: totalPrice })
      .eq("id", orderData.id);

    if (updateError) throw updateError;
  } catch (error) {
    throw new Error("Order creation failed");
  }
}
