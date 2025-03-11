"use client";

import HeaderAuth from "@/app/[locale]/components/header/header-auth";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import NavLinks from "./nav-links";
import { Database } from "@/database.types";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

interface HeaderDrawerProps {
  role: Database["public"]["Enums"]["app_role"] | null;
  user: User | null;
}

export default function HeaderDrawer({ role, user }: HeaderDrawerProps) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild onClick={() => setOpen(true)}>
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
      </DrawerTrigger>
      <DrawerContent
        className="top-0 mt-0 mr-20 rounded-none"
        onClick={() => setOpen(false)}
      >
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <NavLinks role={role} />
          <div className="pt-4">
            <HeaderAuth user={user} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
