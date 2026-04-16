"use client";

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
  const user = useAppSelector((s) => s.auth.user);
  const q = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: () => apiFetch<DashboardOverview>("/dashboard/overview"),
  });

  if (q.error instanceof ApiError && q.error.status === 403) {
    return (
      <div className="p-4 md:p-6">
        <PermissionDenied message="You do not have access to the company dashboard metrics." />
      </div>
    );
  }

  const d = q.data;
  const chartData = d
    ? [
        { name: "Sales (MTD)", value: d.monthlySalesTotal },
        { name: "Outstanding", value: d.outstandingInvoices },
        { name: "Expenses", value: d.expensesThisMonth },
      ]
    : [];

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 md:p-6">
      <div className="space-y-2">
        <Badge variant="secondary" className="rounded-none text-[10px] uppercase">
          Your workspace
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {greetingForHour()}, {user?.firstName ?? "there"}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
          This overview is scoped to your company. Use the sidebar to jump into
          CRM, inventory, billing, and more—everything stays permission-aware.
        </p>
      </div>

      {q.isLoading ? (
        <div className="text-muted-foreground text-sm">Loading overview…</div>
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
                label: "Sales (month)",
                value: formatMoney(d.monthlySalesTotal, d.currency),
                hint: "Completed sales this month",
              },
              {
                label: "Outstanding invoices",
                value: formatMoney(d.outstandingInvoices, d.currency),
                hint: "Balance still due",
              },
              {
                label: "Customers",
                value: String(d.customerCount),
                hint: "Active records",
              },
              {
                label: "Low stock SKUs",
                value: String(d.lowStockCount),
                hint: "At or below reorder",
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
            <Card className="border-border min-w-0 lg:col-span-3 rounded-none">
              <CardHeader>
                <CardTitle className="text-base">Cash &amp; liability pulse</CardTitle>
                <p className="text-muted-foreground text-xs">
                  Compare monthly sales, outstanding AR, and paid expenses.
                </p>
              </CardHeader>
              <CardContent className="h-72 min-h-72 min-w-0 pl-0">
                <div className="h-full min-h-72 min-w-0">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={0}
                    minHeight={220}
                  >
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
                        name="Amount"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border min-w-0 lg:col-span-2 rounded-none">
              <CardHeader>
                <CardTitle className="text-base">Network</CardTitle>
                <p className="text-muted-foreground text-xs">
                  Quick relationship counts.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Suppliers</span>
                  <span className="font-medium tabular-nums">
                    {d.supplierCount}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Expenses (month)</span>
                  <span className="font-medium tabular-nums">
                    {formatMoney(d.expensesThisMonth, d.currency)}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Tip: pin modules you use daily—the sidebar collapses to icons on
                  smaller screens for focus.
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
