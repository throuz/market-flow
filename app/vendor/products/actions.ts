"use server";

import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  // Handle file upload
  const file = formData.get("image") as File | null; // Expecting the image file field as 'image'
  let imageUrl = "";

  if (file) {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    try {
      const { data, error } = await supabase.storage
        .from("assets")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get the public URL of the uploaded image
      const publicUrl = supabase.storage.from("assets").getPublicUrl(fileName)
        .data.publicUrl;

      imageUrl = publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  }

  const product: Database["public"]["Tables"]["products"]["Insert"] = {
    name: formData.get("name") as string,
    category_id: parseInt(formData.get("category_id") as string),
    description: formData.get("description") as string,
    price_per_unit: parseFloat(formData.get("price_per_unit") as string),
    image_url: imageUrl || (formData.get("image_url") as string), // Use the uploaded image URL if available
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

  // Handle file upload
  const file = formData.get("image") as File | null; // Expecting the image file field as 'image'
  let imageUrl = "";

  if (file) {
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;

    try {
      const { data, error } = await supabase.storage
        .from("assets")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get the public URL of the uploaded image
      const publicUrl = supabase.storage.from("assets").getPublicUrl(fileName)
        .data.publicUrl;

      imageUrl = publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  }

  const product: Database["public"]["Tables"]["products"]["Update"] = {
    name: formData.get("name") as string,
    category_id: parseInt(formData.get("category_id") as string),
    description: formData.get("description") as string,
    price_per_unit: parseFloat(formData.get("price_per_unit") as string),
    image_url: imageUrl || (formData.get("image_url") as string), // Use the uploaded image URL if available
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
