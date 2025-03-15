"use client";

import { Database } from "@/database.types";
import useAppRoles from "@/hooks/useAppRoles";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";

interface CustomerUserInfoProps {
  user: User | null;
  role: Database["public"]["Enums"]["app_role"];
}

export default function CustomerUserInfo({
  user,
  role,
}: CustomerUserInfoProps) {
  const t = useTranslations();

  const { appRoleMap } = useAppRoles();

  const userDisplay: { label: string; value: string }[] = [
    {
      label: t("ID"),
      value: user?.id ?? "",
    },
    {
      label: t("Email"),
      value: user?.email ?? "",
    },
    {
      label: t("Role"),
      value: appRoleMap[role],
    },
    {
      label: t("Created at"),
      value: new Date(user?.created_at ?? "").toLocaleString(),
    },
    {
      label: t("Last sign in"),
      value: new Date(user?.last_sign_in_at ?? "").toLocaleString(),
    },
  ];

  return (
    <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
      <div className="space-y-4">
        {userDisplay.map(({ label, value }) => (
          <div key={label} className="flex justify-between">
            <span className="font-medium capitalize">{label}:</span>
            <span className="text-gray-600">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
