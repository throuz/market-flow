"use server";

import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

async function uploadFile(file: File | null): Promise<string> {
  if (!file || file.size === 0) return "";

  const supabase = await createClient();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExtension}`;

  try {
    const { error } = await supabase.storage
      .from("assets")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) throw error;

    return supabase.storage.from("assets").getPublicUrl(fileName).data
      .publicUrl;
  } catch (error) {
    throw new Error("Image upload failed");
  }
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const imageUrl = await uploadFile(formData.get("image") as File);

  const product: Database["public"]["Tables"]["products"]["Insert"] = {
    name: formData.get("name") as string,
    category_id: Number(formData.get("category_id")),
    description: formData.get("description") as string,
    price_per_unit: parseFloat(formData.get("price_per_unit") as string) || 0,
    image_url: imageUrl || (formData.get("image_url") as string),
    is_active: formData.get("is_active") === "on",
    stock_quantity: Number(formData.get("stock_quantity")) || 0,
    unit: formData.get("unit") as Database["public"]["Enums"]["product_unit"],
  };

  try {
    const { error } = await supabase.from("products").insert(product);
    if (error) throw error;
    revalidatePath("/vendor/products");
  } catch (error) {
    throw new Error("Product creation failed");
  }
}

export async function updateProduct(id: number, formData: FormData) {
  const supabase = await createClient();
  const imageUrl = await uploadFile(formData.get("image") as File);

  const product: Database["public"]["Tables"]["products"]["Update"] = {
    name: formData.get("name") as string,
    category_id: Number(formData.get("category_id")),
    description: formData.get("description") as string,
    price_per_unit: parseFloat(formData.get("price_per_unit") as string) || 0,
    image_url: imageUrl || (formData.get("image_url") as string),
    is_active: formData.get("is_active") === "on",
    stock_quantity: Number(formData.get("stock_quantity")) || 0,
    unit: formData.get("unit") as Database["public"]["Enums"]["product_unit"],
  };

  try {
    const { error } = await supabase
      .from("products")
      .update(product)
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/vendor/products");
  } catch (error) {
    throw new Error("Product update failed");
  }
}

export async function deleteProduct(id: number) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/vendor/products");
  } catch (error) {
    throw new Error("Product deletion failed");
  }
}
