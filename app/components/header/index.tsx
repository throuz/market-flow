import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import HeaderAuth from "@/app/components/header/header-auth";

import NavLinks from "./nav-links";
import HeaderDrawer from "./header-drawer";

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

  return (
    <header className="relative">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center">
            <Link href="/" className="font-semibold">
              Market flow
            </Link>
            <div className="hidden md:block">
              <NavLinks role={profile?.role ?? null} />
            </div>
          </div>
          <div className="hidden md:block">
            <HeaderAuth user={user} />
          </div>
          <HeaderDrawer role={profile?.role ?? null} user={user} />
        </div>
      </nav>
    </header>
  );
}
