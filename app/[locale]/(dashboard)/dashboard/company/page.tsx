"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BuildingsIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api/client";
import { CompanyEditForm } from "@/components/molecules/company-edit-form";
import { PaystackSettingsCard } from "@/components/molecules/paystack-settings-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyPage() {
  const t = useTranslations("dashboard.company");
  const tc = useTranslations("common");
  const q = useQuery({
    queryKey: ["company"],
    queryFn: () => apiFetch<Record<string, unknown>>("/company"),
  });

  if (q.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <p className="text-muted-foreground mb-2 text-sm">{t("loading")}</p>
        <Skeleton className="h-40 w-full max-w-xl" />
      </div>
    );
  }

  const c = q.data;
  if (!c) {
    return (
      <div className="text-muted-foreground p-4 text-sm md:p-6">{t("notFound")}</div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          {t("description")}
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="max-w-xl rounded-none border">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <BuildingsIcon className="text-primary size-7" aria-hidden />
            <CardTitle className="text-lg">{String(c.name ?? tc("dash"))}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">{t("industry")}</span>
              <span>{String(c.industry ?? tc("dash"))}</span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">{t("currency")}</span>
              <span className="font-medium">{String(c.currency ?? tc("dash"))}</span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">{t("email")}</span>
              <span>{String(c.email ?? tc("dash"))}</span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">{t("phone")}</span>
              <span>{String(c.phone ?? tc("dash"))}</span>
            </div>
            {typeof c.taxRate === "number" ? (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">{t("taxRate")}</span>
                <span>{c.taxRate}%</span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>
      <CompanyEditForm initial={c} />
      <PaystackSettingsCard initial={c} />
    </div>
  );
}
