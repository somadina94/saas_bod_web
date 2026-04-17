"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PLATFORM_DISPLAY_NAME } from "@/lib/branding";
import { toast } from "sonner";
import { billingApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatMoney } from "@/lib/format";

export default function BillingPage() {
  const q = useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: () => billingApi.getSubscription(),
  });
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);

  async function pay(interval: "monthly" | "yearly") {
    try {
      setLoading(interval);
      const res = await billingApi.checkout({ interval });
      window.location.href = res.authorizationUrl;
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  const sub = q.data?.subscription as Record<string, unknown> | null | undefined;
  const pricing = q.data?.pricing;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Platform subscription for {PLATFORM_DISPLAY_NAME} is charged via Paystack using the
          operator keys in server environment variables — not your tenant Paystack
          keys.
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="max-w-lg rounded-none border">
          <CardHeader>
            <CardTitle className="text-base">Current plan</CardTitle>
            <CardDescription>
              {sub
                ? `Status: ${String(sub.status ?? "—")}${
                    sub.currentPeriodEnd
                      ? ` · Renews ${new Date(String(sub.currentPeriodEnd)).toLocaleDateString()}`
                      : ""
                  }`
                : "No subscription record yet."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pricing ? (
              <p className="text-muted-foreground text-sm">
                Standard:{" "}
                <span className="text-foreground font-medium">
                  {formatMoney(pricing.monthlyNgn, pricing.currency)} / month
                </span>{" "}
                or{" "}
                <span className="text-foreground font-medium">
                  {formatMoney(pricing.yearlyNgn, pricing.currency)} / year
                </span>
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-none"
                disabled={loading !== null}
                onClick={() => void pay("monthly")}
              >
                {loading === "monthly" ? "Redirecting…" : "Pay monthly"}
              </Button>
              <Button
                variant="secondary"
                className="rounded-none"
                disabled={loading !== null}
                onClick={() => void pay("yearly")}
              >
                {loading === "yearly" ? "Redirecting…" : "Pay yearly"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
