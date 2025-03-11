import Link from "next/link";
import HeaderAuth from "@/components/header-auth";
import NavLinks from "./nav-links";

export default function Header() {
  return (
    <header className="relative">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center">
            <Link href="/" className="font-semibold">
              Market flow
            </Link>
            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>
          <div className="hidden md:block">
            <HeaderAuth />
          </div>
          <label htmlFor="nav-toggle" className="md:hidden cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </label>
        </div>
      </nav>

      <input type="checkbox" id="nav-toggle" className="hidden peer" />
      <div className="fixed inset-0 z-50 bg-background -translate-x-full peer-checked:translate-x-0 transition-transform md:hidden">
        <div className="flex flex-col p-5 space-y-4">
          <label
            htmlFor="nav-toggle"
            className="flex justify-end cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </label>
          <NavLinks />
          <div className="pt-4">
            <HeaderAuth />
          </div>
        </div>
      </div>
    </header>
  );
}
