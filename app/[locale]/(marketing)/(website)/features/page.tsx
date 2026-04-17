"use client";

import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import {
  BellIcon,
  BuildingsIcon,
  ClipboardTextIcon,
  CloudArrowUpIcon,
  CoinsIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  FileTextIcon,
  GearSixIcon,
  KeyIcon,
  PackageIcon,
  ReceiptIcon,
  ScrollIcon,
  ShoppingCartIcon,
  SlidersIcon,
  StorefrontIcon,
  TruckIcon,
  UserGearIcon,
  UsersIcon,
  WarehouseIcon,
  WrenchIcon,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";

const MODULE_ICONS = [
  StorefrontIcon,
  UsersIcon,
  TruckIcon,
  PackageIcon,
  WarehouseIcon,
  FileTextIcon,
  ReceiptIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  ClipboardTextIcon,
  CurrencyDollarIcon,
  BellIcon,
  UserGearIcon,
  CoinsIcon,
  BuildingsIcon,
  KeyIcon,
  GearSixIcon,
  ScrollIcon,
  CloudArrowUpIcon,
  SlidersIcon,
  WrenchIcon,
] as const satisfies ReadonlyArray<ComponentType<IconProps>>;

type ModuleRow = {
  title: string;
  desc: string;
  icon: (typeof MODULE_ICONS)[number];
};

export default function FeaturesPage() {
  const t = useTranslations("features");
  const rawModules = t.raw("modules") as { title: string; desc: string }[];
  const modules: ModuleRow[] = rawModules.map((m, i) => ({
    ...m,
    icon: MODULE_ICONS[i] ?? StorefrontIcon,
  }));

  return (
    <MarketingPageShell title={t("title")} subtitle={t("subtitle")}>
      <div className="[&_strong]:text-foreground">
        {t.rich("intro", {
          platform: PLATFORM_DISPLAY_NAME,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {modules.map((m) => (
          <div
            key={m.title}
            className="border-border bg-card/50 hover:border-primary/25 group rounded-none border p-5 transition-colors"
          >
            <div className="flex gap-4">
              <span className="bg-primary/10 text-primary ring-primary/15 flex size-11 shrink-0 items-center justify-center rounded-none ring-1">
                <m.icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 space-y-1.5">
                <h2 className="text-foreground mt-0 text-base font-semibold">{m.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="border-border text-muted-foreground border-t pt-6 text-sm">{t("footnote")}</p>
    </MarketingPageShell>
  );
}
