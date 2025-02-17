"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const { error } = await supabase.from("categories").insert([{ name }]);
  if (error) throw error;
  revalidatePath("/vendor/categories");
}

export async function updateCategory(id: number, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/vendor/categories");
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/vendor/categories");
}
