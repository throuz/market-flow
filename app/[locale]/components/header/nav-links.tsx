"use client";

import { Database } from "@/database.types";

import NavLink from "./nav-link";
import { useTranslations } from "next-intl";

type Role = Database["public"]["Enums"]["app_role"];

interface RoleLink {
  href: string;
  label: string;
}

interface NavLinksProps {
  role: Role | null;
}

export default function NavLinks({ role }: NavLinksProps) {
  const t = useTranslations();

  const roleLinks: Record<Role | "guest", RoleLink[]> = {
    admin: [
      { href: "/admin/profiles", label: t("Profiles") },
      { href: "/admin/categories", label: t("Categories") },
      { href: "/admin/products", label: t("Products") },
      { href: "/admin/orders", label: t("Orders") },
    ],
    vendor: [
      { href: "/vendor/categories", label: t("Categories") },
      { href: "/vendor/products", label: t("Products") },
      { href: "/vendor/orders", label: t("Orders") },
    ],
    customer: [
      { href: "/customer/products", label: t("Products") },
      { href: "/customer/orders", label: t("Orders") },
      { href: "/customer/shopping-cart", label: t("Shopping Cart") },
    ],
    guest: [
      { href: "/products", label: t("Products") },
      { href: "/orders", label: t("Orders") },
      { href: "/shopping-cart", label: t("Shopping Cart") },
    ],
  };

  const links = role ? roleLinks[role] : roleLinks["guest"];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {links.map(({ href, label }) => (
        <NavLink key={href} href={href} label={label} />
      ))}
    </div>
  );
}
