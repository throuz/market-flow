"use server";

import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { formatTimestamptz } from "@/lib/utils";
import { sendOrderCreatedMessage } from "@/lib/telegram/actions";

export async function createOrder(formData: FormData) {
  const supabase = await createClient();

  // Process order items
  const orderItems: {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    unit: Database["public"]["Enums"]["product_unit"];
  }[] = [];
  const formEntries = Array.from(formData.entries());

  // Extract order items from the form data
  formEntries.forEach(([key, value]) => {
    if (key.startsWith("order_items.") && key.endsWith(".name")) {
      const index = key.split(".")[1];
      const product_id = Number(
        formData.get(`order_items.${index}.product_id`)
      );
      const name = String(value);
      const price = Number(formData.get(`order_items.${index}.price`));
      const quantity = Number(formData.get(`order_items.${index}.quantity`));
      const unit = String(
        formData.get(`order_items.${index}.unit`)
      ) as Database["public"]["Enums"]["product_unit"];

      orderItems.push({
        product_id, // Set 0 first, will fill in after order created
        name,
        price,
        quantity,
        unit,
      });
    }
  });

  // Check and update stock before proceeding with the order creation
  const stockUpdates = orderItems.map(async (item) => {
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("id, name, stock_quantity")
      .eq("id", item.product_id)
      .single();

    if (productError)
      throw new Error(`Error fetching product: ${productError.message}`);

    if (productData) {
      if (productData.stock_quantity < item.quantity) {
        throw new Error("Not enough stock for product: " + productData.name);
      }

      // Decrease stock quantity
      const { error: stockUpdateError } = await supabase
        .from("products")
        .update({
          stock_quantity: productData.stock_quantity - item.quantity,
        })
        .eq("id", productData.id);

      if (stockUpdateError) throw stockUpdateError;
    }
  });

  try {
    // Wait for all stock updates to complete
    await Promise.all(stockUpdates);

    // Create the order after ensuring stock is available
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

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const insertOrderItems: Database["public"]["Tables"]["order_items"]["Insert"][] =
      orderItems.map(({ name, price, quantity, unit }) => ({
        order_id: orderData.id,
        name,
        price,
        quantity,
        unit,
      }));

    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .insert(insertOrderItems)
      .select();

    if (!itemsData || itemsError) throw itemsError;

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

    // Send telegram message with order details
    await sendOrderCreatedMessage(
      { ...orderData, total_price: totalPrice },
      itemsData
    );
  } catch (error) {
    throw new Error(`Order creation failed: ${(error as Error).message}`);
  }
}
