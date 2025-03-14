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
import { useTranslations } from "next-intl";
import { AlignLeft } from "lucide-react";

interface HeaderDrawerProps {
  role: Database["public"]["Enums"]["app_role"] | null;
  user: User | null;
}

export default function HeaderDrawer({ role, user }: HeaderDrawerProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild onClick={() => setOpen(true)}>
        <div className="md:hidden cursor-pointer">
          <AlignLeft />
        </div>
      </DrawerTrigger>
      <DrawerContent
        className="top-0 mt-0 mr-20 rounded-none"
        onClick={() => setOpen(false)}
      >
        <DrawerHeader>
          <DrawerTitle>{t("Menu")}</DrawerTitle>
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
