"use server";

import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const product: Database["public"]["Tables"]["products"]["Insert"] = {
    name: formData.get("name") as string,
    category_id: parseInt(formData.get("category_id") as string),
    description: formData.get("description") as string,
    price_per_unit: parseFloat(formData.get("price_per_unit") as string),
    image_url: formData.get("image_url") as string,
    is_active: formData.get("is_active") === "on",
    stock_quantity: parseInt(formData.get("stock_quantity") as string),
    unit: formData.get("unit") as Database["public"]["Enums"]["product_unit"],
  };

  const { error } = await supabase.from("products").insert(product);
  if (error) throw error;
  revalidatePath("/vendor/products");
}

export async function updateProduct(id: number, formData: FormData) {
  const supabase = await createClient();

  const product: Database["public"]["Tables"]["products"]["Update"] = {
    name: formData.get("name") as string,
    category_id: parseInt(formData.get("category_id") as string),
    description: formData.get("description") as string,
    price_per_unit: parseFloat(formData.get("price_per_unit") as string),
    image_url: formData.get("image_url") as string,
    is_active: formData.get("is_active") === "on",
    stock_quantity: parseInt(formData.get("stock_quantity") as string),
    unit: formData.get("unit") as Database["public"]["Enums"]["product_unit"],
  };

  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/vendor/products");
}

export async function deleteProduct(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/vendor/products");
}
