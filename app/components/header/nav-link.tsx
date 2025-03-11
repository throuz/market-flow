"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
        pathname.startsWith(href)
          ? "bg-gray-900 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      onClick={() => router.push(href)}
    >
      {label}
    </div>
  );
}
