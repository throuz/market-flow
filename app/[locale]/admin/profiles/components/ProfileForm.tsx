"use client";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import { Label } from "@/components/ui/label";
import useAppRoles from "@/hooks/useAppRoles";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/SubmitButton";

interface ProfileFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialData: Database["public"]["Tables"]["profiles"]["Row"];
}

export default function ProfileForm({
  onSubmit,
  initialData,
}: ProfileFormProps) {
  const t = useTranslations();
  const { appRoleOptions } = useAppRoles();

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">{t("Profile Role")}</Label>
        <Select name="role" defaultValue={initialData.role} required>
          <SelectTrigger id="role">
            <SelectValue placeholder={t("Select profile role")} />
          </SelectTrigger>
          <SelectContent>
            {appRoleOptions.map(({ label, value }) => {
              if (value === "admin") {
                return null;
              }
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <SubmitButton className="w-full">{t("Save")}</SubmitButton>
    </form>
  );
}
