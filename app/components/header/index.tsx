import Link from "next/link";
import HeaderAuth from "@/components/header-auth";

import Links from "./links";

export default function Header() {
  return (
    <header>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center">
            <Link href="/" className="font-semibold">
              Market flow
            </Link>
            <Links />
          </div>
          <HeaderAuth />
        </div>
      </nav>
    </header>
  );
}
