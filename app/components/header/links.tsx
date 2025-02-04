import Link from "next/link";
import { redirect } from "next/navigation";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

const roleLinks: Record<
  Database["public"]["Enums"]["app_role"],
  { href: string; label: string }[]
> = {
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
    return redirect("/sign-in");
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
