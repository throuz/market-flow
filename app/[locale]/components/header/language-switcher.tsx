import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();

  const localeOptions: { label: string; value: string }[] = [
    { label: "English", value: "en-US" },
    { label: "繁體中文", value: "zh-TW" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Globe className="h-4 w-4 mr-2" />
          {localeOptions.find((option) => option.value === locale)?.label ?? ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {localeOptions.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            disabled={locale === value}
            onClick={() => {
              router.push(`/${locale}`);
            }}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
