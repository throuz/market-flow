"use client";

import { useTransition } from "react";

import clsx from "clsx";
import { useLocale } from "next-intl";

import { Locale } from "@/i18n/types";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const localeOptions: { label: string; value: Locale }[] = [
    { label: "繁體中文", value: "zh-TW" },
    { label: "English", value: "en-US" },
  ];

  function onSelectChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <div
      className={clsx(
        isPending && "transition-opacity [&:disabled]:opacity-30"
      )}
    >
      <Select
        defaultValue={locale}
        onValueChange={onSelectChange}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {localeOptions.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
