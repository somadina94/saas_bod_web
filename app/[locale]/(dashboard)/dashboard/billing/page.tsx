"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("dashboard.billing");
  const tc = useTranslations("common");
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
      toast.error(e instanceof ApiError ? e.message : t("checkoutFailed"));
    } finally {
      setLoading(null);
    }
  }

  const sub = q.data?.subscription as Record<string, unknown> | null | undefined;
  const pricing = q.data?.pricing;

  const planDescription = sub
    ? `${t("statusPrefix")} ${String(sub.status ?? tc("dash"))}${
        sub.currentPeriodEnd
          ? ` ${t("renews", {
              date: new Date(String(sub.currentPeriodEnd)).toLocaleDateString(),
            })}`
          : ""
      }`
    : t("noSub");

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          {t("description", { platform: PLATFORM_DISPLAY_NAME })}
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="max-w-lg rounded-none border">
          <CardHeader>
            <CardTitle className="text-base">{t("currentPlan")}</CardTitle>
            <CardDescription>{planDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pricing ? (
              <p className="text-muted-foreground text-sm">
                {t("pricingLine")}{" "}
                <span className="text-foreground font-medium">
                  {formatMoney(pricing.monthlyNgn, pricing.currency)} {t("perMonth")}
                </span>{" "}
                {t("or")}{" "}
                <span className="text-foreground font-medium">
                  {formatMoney(pricing.yearlyNgn, pricing.currency)} {t("perYear")}
                </span>
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-none"
                disabled={loading !== null}
                onClick={() => void pay("monthly")}
              >
                {loading === "monthly" ? t("redirecting") : t("payMonthly")}
              </Button>
              <Button
                variant="secondary"
                className="rounded-none"
                disabled={loading !== null}
                onClick={() => void pay("yearly")}
              >
                {loading === "yearly" ? t("redirecting") : t("payYearly")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
