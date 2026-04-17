"use client";

import { ListIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";
import { LocaleSwitcher } from "@/components/i18n/locale-switcher";
import { useAppSelector } from "@/lib/store/hooks";

export function SiteHeader({ className }: { className?: string }) {
  const t = useTranslations("marketing.header");
  const tc = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const authCtaHref = user ? "/dashboard" : "/login";
  const authCtaLabel = user ? tc("dashboard") : t("signIn");
  const nav = [
    { href: "/features", label: t("features") },
    { href: "/how-it-works", label: t("howItWorks") },
  ] as const;

  return (
    <header
      className={cn(
        "border-border/60 bg-background/75 supports-backdrop-filter:bg-background/55 sticky top-0 z-50 border-b backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-none shadow-sm ring-1 ring-primary/20">
            <SparkleIcon className="size-5" weight="fill" aria-hidden />
          </span>
          <span className="max-w-[11rem] truncate text-base tracking-tight sm:max-w-none">
            {PLATFORM_DISPLAY_NAME}
          </span>
        </Link>

        <nav className="text-muted-foreground hidden items-center gap-1 font-medium md:flex">
          {nav.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className="rounded-none text-[13px]"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher
            className="h-8 w-[min(100%,9.5rem)] rounded-none text-xs hidden sm:inline-flex"
            id="site-locale"
          />
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none text-[13px] hidden sm:inline-flex"
            asChild
          >
            <Link href={authCtaHref}>{authCtaLabel}</Link>
          </Button>
          <Button size="sm" className="rounded-none text-[13px]" asChild>
            <Link href="/setup">{t("createWorkspace")}</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-none md:hidden"
                aria-label={tc("openMenu")}
              >
                <ListIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)] rounded-none p-0">
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle className="sr-only">{tc("menuTitle")}</SheetTitle>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{tc("navigate")}</span>
                  <SheetClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-none"
                      aria-label={tc("closeMenu")}
                    >
                      <XIcon className="size-5" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>
              <nav className="flex flex-col p-2">
                {nav.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="hover:bg-muted rounded-none px-3 py-3 text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href={authCtaHref}
                    className="hover:bg-muted rounded-none px-3 py-3 text-sm font-medium"
                  >
                    {authCtaLabel}
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/setup"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 mx-2 mt-2 rounded-none px-3 py-3 text-center text-sm font-medium"
                  >
                    {t("createWorkspace")}
                  </Link>
                </SheetClose>
                <div className="px-3 py-3">
                  <LocaleSwitcher className="w-full rounded-none text-xs" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
