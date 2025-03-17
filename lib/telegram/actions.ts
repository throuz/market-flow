"use server";

import { Database } from "@/database.types";
import { formatDateTime, formatPrice } from "../utils";

export async function sendOrderCreatedMessage(
  orderData: Database["public"]["Tables"]["orders"]["Row"],
  orderItems: Database["public"]["Tables"]["order_items"]["Insert"][]
) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    throw new Error("Missing Telegram bot credentials");
  }

  const formattedMessage = `
  <b>🛒 新訂單已創建！</b>
  <b>📦 訂單編號：</b> ${orderData.id}
  <b>💰 總金額：</b> ${formatPrice(orderData.total_price)}
  <b>💳 支付方式：</b> ${orderData.payment_method} ${orderData.account_last_five ?? ""}
  <b>🚚 送貨時間：</b> ${formatDateTime(orderData.estimated_delivery_time)}
  <b>📦 地址：</b> ${orderData.address}
  <b>📦 電話：</b> ${orderData.phone}
  
  <b>🛍 商品：</b>
  ${orderItems
    .map(
      (item) =>
        `- <b>${item.name}</b> (${item.quantity}${item.unit}) - ${formatPrice(item.price * item.quantity)}`
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
