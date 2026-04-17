"use client";

import { AppleLogoIcon, GooglePlayLogoIcon } from "@phosphor-icons/react";
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
  const base =
    variant === "dark"
      ? "border-border bg-foreground text-background hover:bg-foreground/90 border-2"
      : "border-foreground/20 bg-background/80 text-foreground hover:bg-background border-2 backdrop-blur-sm";

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href="#"
        onClick={noopLink}
        aria-label="Download on the App Store (coming soon)"
        className={cn(
          "inline-flex min-w-[10rem] items-center gap-3 rounded-none px-4 py-2.5 text-left shadow-sm transition",
          base,
        )}
      >
        <AppleLogoIcon className="size-8 shrink-0" weight="fill" aria-hidden />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-medium opacity-90">Download on the</span>
          <span className="text-sm font-semibold tracking-tight">App Store</span>
        </span>
      </a>
      <a
        href="#"
        onClick={noopLink}
        aria-label="Get it on Google Play (coming soon)"
        className={cn(
          "inline-flex min-w-[10rem] items-center gap-3 rounded-none px-4 py-2.5 text-left shadow-sm transition",
          base,
        )}
      >
        <GooglePlayLogoIcon className="size-8 shrink-0" weight="fill" aria-hidden />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] font-medium opacity-90">Get it on</span>
          <span className="text-sm font-semibold tracking-tight">Google Play</span>
        </span>
      </a>
    </div>
  );
}
