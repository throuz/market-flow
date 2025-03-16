"use client";

import { useState } from "react";

import { Database } from "@/database.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import ProfileForm from "./ProfileForm";
import { useTranslations } from "next-intl";

interface ProfileDialogProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData: Database["public"]["Tables"]["profiles"]["Row"];
}

export default function ProfileFormDialog({
  onSubmit,
  initialData,
}: ProfileDialogProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={initialData ? "outline" : "default"}>
          {t("Edit")}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg overflow-y-scroll max-w-[90vw] md:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t("Edit Profile")}</DialogTitle>
        </DialogHeader>
        <ProfileForm
          initialData={initialData}
          onSubmit={async (formData) => {
            await onSubmit(formData);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
