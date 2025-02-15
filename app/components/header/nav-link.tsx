"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      key={href}
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        pathname === href
          ? "bg-gray-900 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}
