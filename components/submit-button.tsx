"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button>;

export function SubmitButton({ children, ...props }: Props) {
  const t = useTranslations();
  const { pending } = useFormStatus();

  const pendingText = t("Submitting") + "...";

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}
