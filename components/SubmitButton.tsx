"use client";

import { type ComponentProps } from "react";

import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export default function SubmitButton({
  children,
  pendingText,
  ...props
}: Props) {
  const { pending } = useFormStatus();
  const t = useTranslations();

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? pendingText || `${t("Submitting")}...` : children}
    </Button>
  );
}
