"use client";

import { use } from "react";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/SubmitButton";
import { forgotPasswordAction } from "@/app/[locale]/actions";
import { FormMessage, Message } from "@/components/form-message";

export default function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = use(props.searchParams);
  const t = useTranslations();
  return (
    <form className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto">
      <div>
        <h1 className="text-2xl font-medium">{t("Reset Password")}</h1>
        <p className="text-sm text-secondary-foreground">
          {t("Already have an account?")}{" "}
          <Link className="text-primary underline" href="/sign-in">
            {t("Sign in")}
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">{t("Email")}</Label>
        <Input name="email" placeholder="you@example.com" required />
        <SubmitButton formAction={forgotPasswordAction}>
          {t("Reset Password")}
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
