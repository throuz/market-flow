"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { User } from "@supabase/supabase-js";
import { signOutAction } from "@/app/[locale]/actions";

import LocaleSwitcherSelect from "./locale-switcher";
import { Button } from "../../../../components/ui/button";

interface HeaderAuthProps {
  user: User | null;
}

export default function HeaderAuth({ user }: HeaderAuthProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <LocaleSwitcherSelect />
      {user ? (
        <>
          <span>
            {t("Hey")}, {user.email}
          </span>
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              {t("Sign out")}
            </Button>
          </form>
        </>
      ) : (
        <>
          <Button asChild size="sm" variant="outline">
            <Link href="/sign-in">{t("Sign in")}</Link>
          </Button>
          <Button asChild size="sm" variant="default">
            <Link href="/sign-up">{t("Sign up")}</Link>
          </Button>
        </>
      )}
    </div>
  );
}
