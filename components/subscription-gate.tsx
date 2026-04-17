"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/lib/api/entities";
import { Button } from "@/components/ui/button";

const EXCLUDED = [
  "/dashboard/billing",
  "/dashboard/billing/callback",
  "/dashboard/company",
  "/dashboard/settings",
];

function subscriptionActive(sub: Record<string, unknown> | null | undefined) {
  if (!sub) return false;
  const st = String(sub.status ?? "");
  const end = sub.currentPeriodEnd
    ? new Date(String(sub.currentPeriodEnd))
    : null;
  const grace = sub.gracePeriodEndsAt
    ? new Date(String(sub.gracePeriodEndsAt))
    : null;
  const now = new Date();
  if ((st === "trialing" || st === "active") && end && end > now) return true;
  if (st === "past_due" && grace && grace > now) return true;
  return false;
}

export function SubscriptionGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const excluded = EXCLUDED.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const q = useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: () => billingApi.getSubscription(),
    enabled: !excluded,
  });

  if (excluded) return <>{children}</>;

  if (q.isLoading) {
    return <div className="flex flex-1 flex-col">{children}</div>;
  }

  const ok = subscriptionActive(
    (q.data?.subscription as Record<string, unknown>) ?? null,
  );

  if (ok) {
    return <div className="flex flex-1 flex-col">{children}</div>;
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="bg-muted/50 border-b px-4 py-3 text-sm">
        <p className="text-muted-foreground">
          Your {PLATFORM_DISPLAY_NAME} workspace subscription is not active. Open billing to pay and
          restore access to CRM, inventory, and billing tools.
        </p>
        <Button asChild className="mt-2 rounded-none" size="sm">
          <Link href="/dashboard/billing">Go to billing</Link>
        </Button>
      </div>
      <div className="pointer-events-none opacity-40">{children}</div>
    </div>
  );
}
