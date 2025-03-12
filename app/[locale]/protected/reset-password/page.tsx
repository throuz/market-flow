"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { resetPasswordAction } from "@/app/[locale]/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = use(props.searchParams);
  const t = useTranslations();

  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4 mx-auto">
      <h1 className="text-2xl font-medium">{t("Reset password")}</h1>
      <p className="text-sm text-foreground/60">
        {t("Please enter your new password below.")}
      </p>
      <Label htmlFor="password">{t("New password")}</Label>
      <Input
        type="password"
        name="password"
        placeholder={t("New password")}
        required
      />
      <Label htmlFor="confirmPassword">{t("Confirm password")}</Label>
      <Input
        type="password"
        name="confirmPassword"
        placeholder={t("Confirm password")}
        required
      />
      <SubmitButton
        formAction={resetPasswordAction}
        pendingText={t("Resetting") + "..."}
      >
        {t("Reset password")}
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
