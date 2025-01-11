import HeaderAuth from "@/components/header-auth";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/">Market flow</Link>
          </div>
          <HeaderAuth />
        </div>
      </nav>
    </header>
  );
}
