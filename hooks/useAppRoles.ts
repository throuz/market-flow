import { Database } from "@/database.types";
import { useTranslations } from "next-intl";

type AppRole = Database["public"]["Enums"]["app_role"];
type AppRoleMap = Record<AppRole, string>;
type AppRoleOption = { label: string; value: AppRole };

export default function useAppRoles() {
  const t = useTranslations();

  const appRoleMap: AppRoleMap = {
    admin: t("Admin"),
    vendor: t("Vendor"),
    customer: t("Customer"),
  };

  const appRoleOptions: AppRoleOption[] = Object.entries(appRoleMap).map(
    ([value, label]) => ({ label, value: value as AppRole })
  );

  return { appRoleMap, appRoleOptions };
}
