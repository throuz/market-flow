"use server";

import { Database } from "@/database.types";
import { formatPrice } from "../utils";

export async function sendOrderCreatedMessage(
  orderData: Database["public"]["Tables"]["orders"]["Row"],
  orderItems: Database["public"]["Tables"]["order_items"]["Insert"][]
) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error("Missing Telegram bot credentials");
  }

  // Extract relevant order details
  const orderId = orderData.id;
  const totalAmount = formatPrice(orderData.total_price);
  const paymentMethod = orderData.payment_method;
  const estimatedDelivery = orderData.estimated_delivery_time;

  // Format order items list
  const itemsList = orderItems
    .map(
      (item) =>
        `- ${item.quantity}x ${item.name} (${item.unit}) - ${formatPrice(item.price * item.quantity)}`
    )
    .join("\n");

  // Construct the message
  const formattedMessage = `
  <b>🛒 New Order Created!</b>
  <b>📦 Order ID:</b> ${orderData.id}
  <b>💰 Total:</b> $${orderData.total_price.toFixed(2)}
  <b>💳 Payment:</b> ${orderData.payment_method}
  <b>🚚 Delivery:</b> ${orderData.estimated_delivery_time}
  
  <b>🛍 Items:</b>
  ${orderItems
    .map(
      (item) =>
        `- <b>${item.name}</b> (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n")}
  `.trim();

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: formattedMessage,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send Telegram message");
  }
}
