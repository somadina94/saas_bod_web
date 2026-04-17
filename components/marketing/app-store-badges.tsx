"use client";

import { AppleLogoIcon, GooglePlayLogoIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function noopLink(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
}

export function AppStoreBadges({
  className,
  variant = "dark",
}: {
  className?: string;
  /** `dark` matches typical store badges; `light` for light hero backgrounds. */
  variant?: "dark" | "light";
}) {
  const t = useTranslations("home");
  const base =
    variant === "dark"
      ? "border-border bg-foreground text-background hover:bg-foreground/90 border-2"
      : "border-foreground/20 bg-background/80 text-foreground hover:bg-background border-2 backdrop-blur-sm";

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href="#"
        onClick={noopLink}
        aria-label={t("appStoreAria")}
        className={cn(
          "inline-flex min-w-[10rem] items-center gap-3 rounded-none px-4 py-2.5 text-left shadow-sm transition",
          base,
        )}
      >
        <AppleLogoIcon className="size-8 shrink-0" weight="fill" aria-hidden />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-medium opacity-90">{t("appStoreOverline")}</span>
          <span className="text-sm font-semibold tracking-tight">{t("appStoreLabel")}</span>
        </span>
      </a>
      <a
        href="#"
        onClick={noopLink}
        aria-label={t("playAria")}
        className={cn(
          "inline-flex min-w-[10rem] items-center gap-3 rounded-none px-4 py-2.5 text-left shadow-sm transition",
          base,
        )}
      >
        <GooglePlayLogoIcon className="size-8 shrink-0" weight="fill" aria-hidden />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-medium opacity-90">{t("playOverline")}</span>
          <span className="text-sm font-semibold tracking-tight">{t("playLabel")}</span>
        </span>
      </a>
    </div>
  );
}
