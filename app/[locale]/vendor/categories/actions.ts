"use server";

import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const category: Database["public"]["Tables"]["categories"]["Insert"] = {
    name: formData.get("name") as string,
  };

  try {
    const { error } = await supabase.from("categories").insert(category);
    if (error) throw error;
    revalidatePath("/vendor/categories");
  } catch (error) {
    throw new Error("Category creation failed");
  }
}

export async function updateCategory(id: number, formData: FormData) {
  const supabase = await createClient();
  const category: Database["public"]["Tables"]["categories"]["Update"] = {
    name: formData.get("name") as string,
  };

  try {
    const { error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/vendor/categories");
  } catch (error) {
    throw new Error("Category update failed");
  }
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/vendor/categories");
  } catch (error) {
    throw new Error("Category deletion failed");
  }
}
