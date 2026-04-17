"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeLabels, type AppLocale } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleSwitcher({
  className,
  id,
}: {
  className?: string;
  id?: string;
}) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const tc = useTranslations("common");

  return (
    <Select
      value={locale}
      onValueChange={(next) => {
        router.replace(pathname, { locale: next });
      }}
    >
      <SelectTrigger id={id} className={className} aria-label={tc("language")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-none">
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc} className="rounded-none">
            {localeLabels[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
