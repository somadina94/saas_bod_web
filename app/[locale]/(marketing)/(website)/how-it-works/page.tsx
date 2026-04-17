"use client";

import type { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  CheckCircleIcon,
  CreditCardIcon,
  EnvelopeSimpleIcon,
  KeyIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PLATFORM_DISPLAY_NAME, QA_DOC_URL } from "@/lib/branding";

const STEP_ICONS = [
  RocketLaunchIcon,
  ShieldCheckIcon,
  UsersThreeIcon,
  CreditCardIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  KeyIcon,
] as const satisfies ReadonlyArray<ComponentType<IconProps>>;

export default function HowItWorksPage() {
  const t = useTranslations("howItWorks");
  const raw = t.raw("steps") as { n: string; title: string; body: string }[];
  const steps = raw.map((s, i) => ({
    ...s,
    body: s.body.replaceAll("{platform}", PLATFORM_DISPLAY_NAME),
    icon: STEP_ICONS[i] ?? RocketLaunchIcon,
  }));

  return (
    <MarketingPageShell title={t("title")} subtitle={t("subtitle")}>
      <ol className="space-y-0">
        {steps.map((s) => (
          <li
            key={s.n}
            className="border-border relative flex gap-5 border-l pl-8 pb-12 last:pb-0 md:gap-8 md:pl-10"
          >
            <span
              className="bg-background border-border text-primary absolute -left-3 top-0 flex size-6 items-center justify-center rounded-full border text-[10px] font-bold md:-left-3.5 md:size-7"
              aria-hidden
            >
              {s.n}
            </span>
            <div className="bg-primary/10 text-primary ring-primary/15 flex size-12 shrink-0 items-center justify-center rounded-none ring-1">
              <s.icon className="size-6" aria-hidden />
            </div>
            <div className="min-w-0 space-y-2 pt-0.5">
              <h2 className="text-foreground text-lg font-semibold tracking-tight">
                {s.title}
              </h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="border-border text-muted-foreground border-t pt-8 text-sm">
        {t("qaLead")}{" "}
        <Link
          href={QA_DOC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline underline-offset-4 hover:no-underline"
        >
          {t("qaLink")}
        </Link>{" "}
        {t("qaTail", { platform: PLATFORM_DISPLAY_NAME })}
      </p>
    </MarketingPageShell>
  );
}
