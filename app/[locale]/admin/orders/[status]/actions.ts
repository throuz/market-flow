"use server";

import { Database } from "@/database.types";
import { revalidatePath } from "next/cache";
import { formatTimestamptz } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

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
      if (key.startsWith("order_items.") && key.endsWith(".product_id")) {
        const index = key.split(".")[1];
        const productId = Number(value);
        const quantity = Number(formData.get(`order_items.${index}.quantity`));
        const price = Number(formData.get(`order_items.${index}.price`));

        orderItems.push({
          order_id: orderData.id,
          product_id: productId,
          quantity: quantity,
          price: price,
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

    revalidatePath("/admin/orders");
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
    user_id: formData.get("user_id") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    estimated_delivery_time: formatTimestamptz(
      formData.get("estimated_delivery_time") as string
    ),
    total_price: 0,
    payment_method: formData.get(
      "payment_method"
    ) as Database["public"]["Enums"]["payment_method"],
    account_last_five: formData.get("account_last_five")
      ? Number(formData.get("account_last_five"))
      : null,
    updated_at: formatTimestamptz(new Date().toString()),
  };

  try {
    // Delete existing order items
    const { error: deleteError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", id);

    if (deleteError) throw deleteError;

    // Process new order items
    const orderItems: Database["public"]["Tables"]["order_items"]["Insert"][] =
      [];
    const formEntries = Array.from(formData.entries());

    formEntries.forEach(([key, value]) => {
      if (key.startsWith("order_items.") && key.endsWith(".product_id")) {
        const index = key.split(".")[1];
        const productId = Number(value);
        const quantity = Number(formData.get(`order_items.${index}.quantity`));
        const price = Number(formData.get(`order_items.${index}.price`));

        orderItems.push({
          order_id: id,
          product_id: productId,
          quantity: quantity,
          price: price,
        });
      }
    });

    // Insert new order items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Update order with new total price
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    order.total_price = totalPrice;

    const { error: updateError } = await supabase
      .from("orders")
      .update(order)
      .eq("id", id);

    if (updateError) throw updateError;

    revalidatePath("/admin/orders");
  } catch (error) {
    throw new Error("Order update failed");
  }
}

export async function deleteOrder(id: number) {
  const supabase = await createClient();
  try {
    // Delete order items first
    const { error: itemsError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", id);

    if (itemsError) throw itemsError;

    // Then delete the order
    const { error: orderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (orderError) throw orderError;

    revalidatePath("/admin/orders");
  } catch (error) {
    throw new Error("Order deletion failed");
  }
}
