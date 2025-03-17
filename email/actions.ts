"use server";

import { CreateBatchOptions, Resend } from "resend";
import OrderCreated from "./templates/OrderCreated";
import { Database } from "@/database.types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderCreatedEmail(
  emails: string[],
  orderData: Database["public"]["Tables"]["orders"]["Row"],
  orderItems: Database["public"]["Tables"]["order_items"]["Insert"][]
) {
  const createBatchOptions: CreateBatchOptions = emails.map((email) => ({
    from: "Market Flow <onboarding@resend.dev>",
    to: [email],
    subject: `Order #${orderData.id} Created`,
    react: OrderCreated({ orderData, orderItems }),
  }));
  const response = await resend.batch.send(createBatchOptions);
  return response;
}
