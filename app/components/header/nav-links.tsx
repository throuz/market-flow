import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

import NavLink from "./nav-link";

type Role = Database["public"]["Enums"]["app_role"];

interface RoleLink {
  href: string;
  label: string;
}

const roleLinks: Record<Role, RoleLink[]> = {
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
};

export default async function NavLinks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const links = profile ? roleLinks[profile.role] : [];

  return (
    <div className="flex gap-4 items-center">
      {links.map(({ href, label }) => (
        <NavLink key={href} href={href} label={label} />
      ))}
    </div>
  );
}
