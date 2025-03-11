import { Database } from "@/database.types";

import NavLink from "./nav-link";

type Role = Database["public"]["Enums"]["app_role"];

interface RoleLink {
  href: string;
  label: string;
}

const roleLinks: Record<Role | "guest", RoleLink[]> = {
  admin: [
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
  ],
  vendor: [
    { href: "/vendor/categories", label: "Categories" },
    { href: "/vendor/products", label: "Products" },
    { href: "/vendor/orders", label: "Orders" },
  ],
  customer: [
    { href: "/customer/products", label: "Products" },
    { href: "/customer/orders", label: "Orders" },
  ],
  guest: [
    { href: "/products", label: "Products" },
    { href: "/orders", label: "Orders" },
  ],
};

interface NavLinksProps {
  role: Role | null;
}

export default function NavLinks({ role }: NavLinksProps) {
  const links = role ? roleLinks[role] : roleLinks["guest"];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {links.map(({ href, label }) => (
        <NavLink key={href} href={href} label={label} />
      ))}
    </div>
  );
}
