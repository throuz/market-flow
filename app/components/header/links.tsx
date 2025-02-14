import Link from "next/link";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

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
    { href: "/vendor/products", label: "Products" },
    { href: "/vendor/orders", label: "Orders" },
  ],
  customer: [
    { href: "/customer/products", label: "Products" },
    { href: "/customer/orders", label: "Orders" },
  ],
};

export default async function Links() {
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
    <>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </>
  );
}
