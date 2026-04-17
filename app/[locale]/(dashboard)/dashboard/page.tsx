"use client";

import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { DashboardOverview } from "@/lib/api/types";
import { formatMoney, greetingForHour } from "@/lib/format";
import { useAppSelector } from "@/lib/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PermissionDenied } from "@/components/molecules/permission-denied";
import { Badge } from "@/components/ui/badge";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardHomePage() {
  const t = useTranslations("dashboard.overview");
  const te = useTranslations("errors");
  const user = useAppSelector((s) => s.auth.user);
  const q = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: () => apiFetch<DashboardOverview>("/dashboard/overview"),
  });

  if (q.error instanceof ApiError && q.error.status === 403) {
    return (
      <div className="p-4 md:p-6">
        <PermissionDenied message={te("dashboardMetricsDenied")} />
      </div>
    );
  }

  const d = q.data;
  const chartData = d
    ? [
        { name: t("chartSales"), value: d.monthlySalesTotal },
        { name: t("chartOutstanding"), value: d.outstandingInvoices },
        { name: t("chartExpenses"), value: d.expensesThisMonth },
      ]
    : [];

  function greeting() {
    const g = greetingForHour();
    if (g.startsWith("Good morning")) return t("greetingMorning");
    if (g.startsWith("Good afternoon")) return t("greetingAfternoon");
    return t("greetingEvening");
  }

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6">
      <div className="space-y-2">
        <Badge variant="secondary" className="rounded-none text-[10px] uppercase">
          {t("badge")}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {greeting()}, {user?.firstName ?? t("there")}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          {t("subhead")}
        </p>
      </div>

      {q.isLoading ? (
        <div className="text-muted-foreground text-sm">{t("loading")}</div>
      ) : d ? (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {[
              {
                label: t("kpiSales"),
                value: formatMoney(d.monthlySalesTotal, d.currency),
                hint: t("kpiSalesHint"),
              },
              {
                label: t("kpiOutstanding"),
                value: formatMoney(d.outstandingInvoices, d.currency),
                hint: t("kpiOutstandingHint"),
              },
              {
                label: t("kpiCustomers"),
                value: String(d.customerCount),
                hint: t("kpiCustomersHint"),
              },
              {
                label: t("kpiLowStock"),
                value: String(d.lowStockCount),
                hint: t("kpiLowStockHint"),
              },
            ].map((c) => (
              <motion.div key={c.label} variants={item}>
                <Card className="overflow-hidden rounded-none border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      {c.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-2xl font-semibold tabular-nums">
                      {c.value}
                    </p>
                    <p className="text-muted-foreground text-xs">{c.hint}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="border-border min-w-0 shrink-0 lg:col-span-3 rounded-none">
              <CardHeader>
                <CardTitle className="text-base">{t("chartTitle")}</CardTitle>
                <p className="text-muted-foreground text-xs">
                  {t("chartSubtitle")}
                </p>
              </CardHeader>
              <CardContent className="min-w-0 pl-0">
                <div className="h-[288px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height={288} minWidth={0} minHeight={220}>
                    <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.35 }}
                        contentStyle={{
                          borderRadius: 0,
                          border: "1px solid hsl(var(--border))",
                          background: "hsl(var(--card))",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="var(--primary)"
                        radius={[2, 2, 0, 0]}
                        name={t("chartAmount")}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border min-w-0 lg:col-span-2 rounded-none">
              <CardHeader>
                <CardTitle className="text-base">{t("networkTitle")}</CardTitle>
                <p className="text-muted-foreground text-xs">
                  {t("networkSubtitle")}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{t("suppliers")}</span>
                  <span className="font-medium tabular-nums">
                    {d.supplierCount}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{t("expensesMonth")}</span>
                  <span className="font-medium tabular-nums">
                    {formatMoney(d.expensesThisMonth, d.currency)}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t("networkTip")}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
