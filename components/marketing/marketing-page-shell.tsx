import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MarketingPageShell({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "from-background via-background to-muted/20 bg-gradient-to-b",
        className,
      )}
    >
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <header className="mb-12 space-y-3 text-center md:text-left">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              {subtitle}
            </p>
          ) : null}
        </header>
        <div className="text-muted-foreground space-y-6 text-[15px] leading-relaxed [&_code]:bg-muted [&_code]:text-foreground [&_code]:rounded-none [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-medium [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </div>
  );
}
