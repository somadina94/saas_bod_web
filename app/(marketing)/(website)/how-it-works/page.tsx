"use client";

import Link from "next/link";
import {
  CheckCircleIcon,
  CreditCardIcon,
  EnvelopeSimpleIcon,
  KeyIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PLATFORM_DISPLAY_NAME, QA_DOC_URL } from "@/lib/branding";

const steps = [
  {
    n: "01",
    title: "Create your workspace",
    body: "Register with your company name. You become the owner of a new tenant—data is isolated from every other business on the platform.",
    icon: RocketLaunchIcon,
  },
  {
    n: "02",
    title: "Secure session",
    body: "Authentication uses httpOnly cookies and short-lived access tokens. Your browser never stores long-lived secrets in localStorage for core API calls.",
    icon: ShieldCheckIcon,
  },
  {
    n: "03",
    title: "Invite the team",
    body: "Send email invites from Team. Each member gets a role (admin, manager, sales, inventory, accountant, support, viewer) with default permissions you can refine over time.",
    icon: UsersThreeIcon,
  },
  {
    n: "04",
    title: "Configure money rails",
    body: `For platform billing, complete subscription checkout where enabled. For customer invoice payments, add your Paystack public/secret keys under Company → Payments; configure callback and webhook URLs in Paystack. Production stacks should set ENCRYPTION_KEY (64 hex chars) for tenant secrets. All of this runs inside ${PLATFORM_DISPLAY_NAME}.`,
    icon: CreditCardIcon,
  },
  {
    n: "05",
    title: "Operate daily",
    body: "Load customers, suppliers, and products; run quotes to invoices; record payments and expenses; move stock with inventory movements; use purchase orders for inbound goods.",
    icon: CheckCircleIcon,
  },
  {
    n: "06",
    title: "Stay informed",
    body: "Notifications surface important events. Audit log captures sensitive actions for review. Uploads store files in your configured object storage (e.g. logos and receipts).",
    icon: EnvelopeSimpleIcon,
  },
  {
    n: "07",
    title: "Govern access",
    body: "Change roles, suspend accounts, or remove teammates from the Team screen. Owners cannot be removed without another owner—protecting the last keyholder.",
    icon: KeyIcon,
  },
] as const;

export default function HowItWorksPage() {
  return (
    <MarketingPageShell
      title="How it works"
      subtitle="From first signup to running invoices and inventory—designed for operators who need predictable workflows, not toy demos."
    >
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
        Need a scripted QA pass?{" "}
        <Link
          href={QA_DOC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline underline-offset-4 hover:no-underline"
        >
          View the full QA script on GitHub
        </Link>{" "}
        —role-by-role checks and sample data for {PLATFORM_DISPLAY_NAME}.
      </p>
    </MarketingPageShell>
  );
}
