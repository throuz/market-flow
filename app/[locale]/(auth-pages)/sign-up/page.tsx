"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { signUpAction } from "@/app/[locale]/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";

export default function Signup(props: { searchParams: Promise<Message> }) {
  const searchParams = use(props.searchParams);
  const t = useTranslations();

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <form className="flex flex-col min-w-64 max-w-64 mx-auto">
      <h1 className="text-2xl font-medium">{t("Sign up")}</h1>
      <p className="text-sm text text-foreground">
        {t("Already have an account?")}{" "}
        <Link className="text-primary font-medium underline" href="/sign-in">
          {t("Sign in")}
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">{t("Email")}</Label>
        <Input name="email" placeholder="you@example.com" required />
        <Label htmlFor="password">{t("Password")}</Label>
        <Input
          type="password"
          name="password"
          placeholder={t("Your password")}
          minLength={6}
          required
        />
        <SubmitButton
          formAction={signUpAction}
          pendingText={t("Signing up") + "..."}
        >
          {t("Sign up")}
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
