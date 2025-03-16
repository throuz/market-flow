"use client";

import { useTranslations } from "next-intl";

import { Database } from "@/database.types";
import useAppRoles from "@/hooks/useAppRoles";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProfileFormDialog from "./ProfileFormDialog";

interface ProfileCardProps {
  profile: Database["public"]["Tables"]["profiles"]["Row"];
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}

export default function ProfileCard({ profile, onUpdate }: ProfileCardProps) {
  const t = useTranslations();
  const { appRoleMap } = useAppRoles();

  return (
    <Card key={profile.id}>
      <CardHeader>
        <CardTitle>{profile.email}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-sm text-gray-500">{t("Profile Role")}</p>
          <p className="font-medium">{appRoleMap[profile.role]}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-4">
        <ProfileFormDialog
          initialData={profile}
          onSubmit={(formData) => onUpdate(profile.id, formData)}
        />
      </CardFooter>
    </Card>
  );
}
