"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData): Promise<void> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    encodedRedirect("error", "/sign-up", "Email and password are required");
    return;
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") || "";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  error
    ? encodedRedirect("error", "/sign-up", error.message)
    : redirect("/customer");
};

export const signInAction = async (formData: FormData): Promise<void> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    encodedRedirect("error", "/sign-in", "Email and password are required");
    return;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    encodedRedirect("error", "/sign-in", error.message);
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();
  redirect(`/${profile?.role ?? ""}`);
};

export const forgotPasswordAction = async (
  formData: FormData
): Promise<void> => {
  const email = formData.get("email")?.toString();
  if (!email) {
    encodedRedirect("error", "/forgot-password", "Email is required");
    return;
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") || "";
  const callbackUrl = formData.get("callbackUrl")?.toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    encodedRedirect("error", "/forgot-password", "Could not reset password");
    return;
  }

  callbackUrl
    ? redirect(callbackUrl)
    : encodedRedirect(
        "success",
        "/forgot-password",
        "Check your email for a reset link."
      );
};

export const resetPasswordAction = async (
  formData: FormData
): Promise<void> => {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
    return;
  }
  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
    return;
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async (): Promise<void> => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
};
