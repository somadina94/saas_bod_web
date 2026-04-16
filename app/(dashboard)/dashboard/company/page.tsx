"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BuildingsIcon } from "@phosphor-icons/react";
import { apiFetch } from "@/lib/api/client";
import { CompanyEditForm } from "@/components/molecules/company-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyPage() {
  const q = useQuery({
    queryKey: ["company"],
    queryFn: () => apiFetch<Record<string, unknown>>("/company"),
  });

  if (q.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Skeleton className="h-40 w-full max-w-xl" />
      </div>
    );
  }

  const c = q.data;
  if (!c) {
    return (
      <div className="text-muted-foreground p-4 text-sm md:p-6">
        Company profile not found.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Company</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Legal entity and operating defaults shared across your workspace.
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
            <CardTitle className="text-lg">{String(c.name ?? "—")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">Industry</span>
              <span>{String(c.industry ?? "—")}</span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-medium">{String(c.currency ?? "—")}</span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">Email</span>
              <span>{String(c.email ?? "—")}</span>
            </div>
            <div className="flex justify-between gap-4 border-b pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span>{String(c.phone ?? "—")}</span>
            </div>
            {typeof c.taxRate === "number" ? (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Default tax rate</span>
                <span>{c.taxRate}%</span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>
      <CompanyEditForm initial={c} />
    </div>
  );
}
