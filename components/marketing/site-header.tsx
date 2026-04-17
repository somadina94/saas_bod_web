"use client";

import Link from "next/link";
import { ListIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";
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

const nav = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
] as const;

export function SiteHeader({ className }: { className?: string }) {
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
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none text-[13px] hidden sm:inline-flex"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="rounded-none text-[13px]" asChild>
            <Link href="/setup">Create workspace</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-none md:hidden"
                aria-label="Open menu"
              >
                <ListIcon className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,20rem)] rounded-none p-0">
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Navigate</span>
                  <SheetClose asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-none"
                      aria-label="Close menu"
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
                    href="/login"
                    className="hover:bg-muted rounded-none px-3 py-3 text-sm font-medium"
                  >
                    Sign in
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/setup"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 mx-2 mt-2 rounded-none px-3 py-3 text-center text-sm font-medium"
                  >
                    Create workspace
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
