"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { signInAction } from "@/app/[locale]/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";

export default function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = use(props.searchParams);
  const t = useTranslations();

  return (
    <form className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium">{t("Sign in")}</h1>
      <p className="text-sm text-foreground">
        {t("Don‘t have an account?")}{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          {t("Sign up")}
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">{t("Email")}</Label>
        <Input name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">{t("Password")}</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            {t("Forgot Password?")}
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder={t("Your password")}
          required
        />
        <SubmitButton
          pendingText={t("Signing In") + "..."}
          formAction={signInAction}
        >
          {t("Sign in")}
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
