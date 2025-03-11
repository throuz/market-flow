"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export const signUpAction = async (formData: FormData): Promise<void> => {
  const locale = await getLocale();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    encodedRedirect(
      locale,
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") || "";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    encodedRedirect(locale, "error", "/sign-up", error.message);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user?.id ?? "")
    .single();

  redirect({
    locale,
    href: `/${profile?.role ?? ""}`,
  });
};

export const signInAction = async (formData: FormData): Promise<void> => {
  const locale = await getLocale();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    encodedRedirect(
      locale,
      "error",
      "/sign-in",
      "Email and password are required"
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    encodedRedirect(locale, "error", "/sign-in", error.message);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect({
    locale,
    href: `/${profile?.role ?? ""}`,
  });
};

export const forgotPasswordAction = async (
  formData: FormData
): Promise<void> => {
  const locale = await getLocale();

  const email = formData.get("email")?.toString();
  if (!email) {
    encodedRedirect(locale, "error", "/forgot-password", "Email is required");
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") || "";
  const callbackUrl = formData.get("callbackUrl")?.toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    encodedRedirect(
      locale,
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    redirect({
      locale,
      href: callbackUrl,
    });
  }

  encodedRedirect(
    locale,
    "success",
    "/forgot-password",
    "Check your email for a reset link."
  );
};

export const resetPasswordAction = async (
  formData: FormData
): Promise<void> => {
  const locale = await getLocale();

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  if (!password || !confirmPassword) {
    encodedRedirect(
      locale,
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }
  if (password !== confirmPassword) {
    encodedRedirect(
      locale,
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    encodedRedirect(
      locale,
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect(
    locale,
    "success",
    "/protected/reset-password",
    "Password updated"
  );
};

export const signOutAction = async (): Promise<void> => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect({
    locale,
    href: "/sign-in",
  });
};
