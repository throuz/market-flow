import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import HeaderAuth from "@/app/[locale]/components/header/header-auth";

import NavLinks from "./nav-links";
import HeaderDrawer from "./header-drawer";
import ShoppingCartDrawer from "./ShoppingCartDrawer";
import { Database } from "@/database.types";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id ?? "")
    .single();

  const role: Database["public"]["Enums"]["app_role"] | null =
    profile?.role ?? null;

  const { data: products } = await supabase.from("products").select("*");

  return (
    <header className="relative">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center">
            <HeaderDrawer role={role} user={user} />
            <Link href="/" className="font-semibold">
              Market flow
            </Link>
            <div className="hidden md:block">
              <NavLinks role={role} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <HeaderAuth user={user} />
            </div>
            {(role === null || role === "customer") && (
              <ShoppingCartDrawer products={products ?? []} />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
