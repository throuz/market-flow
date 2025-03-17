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
  const message = `
🛒 *New Order Created!*
📦 *Order ID:* ${orderId}
💰 *Total:* $${totalAmount}
💳 *Payment Method:* ${paymentMethod}
🚚 *Estimated Delivery:* ${estimatedDelivery}

🛍 *Items:*
${itemsList}
  `.trim();

  const escapeMarkdown = (text: string) =>
    text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, "\\$1");

  const safeMessage = escapeMarkdown(message);

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      // text: message,
      text: safeMessage,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send Telegram message");
  }
}
