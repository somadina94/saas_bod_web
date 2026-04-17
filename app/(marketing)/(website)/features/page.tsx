"use client";

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
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";

const modules = [
  {
    title: "Overview & analytics",
    desc: "Company-scoped dashboard with sales, AR, expenses, and stock signals.",
    icon: StorefrontIcon,
  },
  {
    title: "Customers & CRM",
    desc: "Accounts, contacts, and history with permission-aware access.",
    icon: UsersIcon,
  },
  {
    title: "Suppliers",
    desc: "Vendor records tied to purchase orders and receiving.",
    icon: TruckIcon,
  },
  {
    title: "Products & services",
    desc: "Catalog, SKUs, pricing, and optional services alongside physical goods.",
    icon: PackageIcon,
  },
  {
    title: "Inventory",
    desc: "Stock movements, levels, and low-stock awareness.",
    icon: WarehouseIcon,
  },
  {
    title: "Quotations",
    desc: "Create, send, and convert quotes into invoices without re-keying lines.",
    icon: FileTextIcon,
  },
  {
    title: "Invoices",
    desc: "Draft, send, and track invoices with email flows where configured.",
    icon: ReceiptIcon,
  },
  {
    title: "Payments",
    desc: "Record payments against invoices; supports Paystack flows for customer pay.",
    icon: CreditCardIcon,
  },
  {
    title: "Sales",
    desc: "Direct sales with optional inventory deduction for product lines.",
    icon: ShoppingCartIcon,
  },
  {
    title: "Purchase orders",
    desc: "Approve and receive stock against suppliers with audit-friendly trails.",
    icon: ClipboardTextIcon,
  },
  {
    title: "Expenses",
    desc: "Submit, approve, and track operational spend with categories.",
    icon: CurrencyDollarIcon,
  },
  {
    title: "Notifications",
    desc: "In-app alerts for operational events your role is allowed to see.",
    icon: BellIcon,
  },
  {
    title: "Team",
    desc: "Invite staff, assign roles, change status, and remove access safely.",
    icon: UserGearIcon,
  },
  {
    title: "Billing & subscriptions",
    desc: "Workspace subscription to the platform (Paystack checkout where enabled).",
    icon: CoinsIcon,
  },
  {
    title: "Company profile",
    desc: "Legal identity, branding, and workspace-level settings.",
    icon: BuildingsIcon,
  },
  {
    title: "Tenant Paystack",
    desc: "Connect your merchant keys for customer invoice payments and webhooks.",
    icon: KeyIcon,
  },
  {
    title: "System preferences",
    desc: "Administrative options for operators with company-settings permission.",
    icon: GearSixIcon,
  },
  {
    title: "Audit log",
    desc: "Immutable-style trail of sensitive actions for compliance reviews.",
    icon: ScrollIcon,
  },
  {
    title: "Uploads",
    desc: "Files to Backblaze B2—logos, avatars, receipts, and product images.",
    icon: CloudArrowUpIcon,
  },
  {
    title: "Profile & preferences",
    desc: "Personal details, timezone, and notification preferences per user.",
    icon: SlidersIcon,
  },
  {
    title: "Services catalog",
    desc: "Non-stock billable lines such as delivery or installation fees.",
    icon: WrenchIcon,
  },
] as const;

export default function FeaturesPage() {
  return (
    <MarketingPageShell
      title="Features"
      subtitle="A single workspace for distribution, retail services, and field operations—scoped by company, gated by role, and ready for real money flows."
    >
      <p>
        {PLATFORM_DISPLAY_NAME} is designed as a <strong>multi-tenant</strong> system: each workspace is a
        company with its own data. Users belong to one company per session; permissions
        determine which modules appear and which row actions are available.
      </p>
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
      <p className="border-border text-muted-foreground border-t pt-6 text-sm">
        Exact screens depend on your role (owner, admin, manager, sales, inventory,
        accountant, support, viewer). Owners and admins typically see the full surface
        area; other roles inherit curated permissions.
      </p>
    </MarketingPageShell>
  );
}
