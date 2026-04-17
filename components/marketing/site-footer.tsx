"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SparkleIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";

export function SiteFooter({ className }: { className?: string }) {
  const t = useTranslations("marketing.footer");
  const th = useTranslations("marketing.header");
  const year = new Date().getFullYear();
  const product = [
    { href: "/features", label: th("features") },
    { href: "/how-it-works", label: th("howItWorks") },
    { href: "/setup", label: th("createWorkspace") },
  ] as const;
  const legal = [
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
  ] as const;

  return (
    <footer
      className={cn(
        "border-border bg-muted/25 text-muted-foreground border-t",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="text-foreground inline-flex items-center gap-2 text-sm font-semibold">
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full shadow-sm">
                <SparkleIcon className="size-4" weight="fill" aria-hidden />
              </span>
              {PLATFORM_DISPLAY_NAME}
            </Link>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              {t("blurb")}
            </p>
          </div>
          <div>
            <h3 className="text-foreground mb-4 text-xs font-semibold uppercase tracking-widest">
              {t("product")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {product.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-foreground mb-4 text-xs font-semibold uppercase tracking-widest">
              {t("legal")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-foreground mb-4 text-xs font-semibold uppercase tracking-widest">
              {t("account")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/login"
                  className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  {th("signIn")}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  {t("dashboard")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs md:flex-row">
          <p>{t("rights", { year, platform: PLATFORM_DISPLAY_NAME })}</p>
          <p className="text-center md:text-right">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
