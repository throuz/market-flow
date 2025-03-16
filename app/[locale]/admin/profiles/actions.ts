"use server";

import { Database } from "@/database.types";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(id: string, formData: FormData) {
  const supabase = await createClient();

  const profile: Database["public"]["Tables"]["profiles"]["Update"] = {
    role: formData.get("role") as Database["public"]["Enums"]["app_role"],
  };

  try {
    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    revalidatePath("/admin/profiles");
  } catch (error) {
    throw new Error("Profile update failed");
  }
}
