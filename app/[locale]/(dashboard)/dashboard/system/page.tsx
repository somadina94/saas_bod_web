"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GearSixIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { ApiError, apiFetch } from "@/lib/api/client";
import { PermissionDenied } from "@/components/molecules/permission-denied";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SystemPage() {
  const t = useTranslations("dashboard.system");
  const te = useTranslations("errors");
  const q = useQuery({
    queryKey: ["system", "settings"],
    queryFn: () => apiFetch<Record<string, unknown>>("/system"),
  });

  if (q.error instanceof ApiError && q.error.status === 403) {
    return (
      <div className="p-4 md:p-6">
        <PermissionDenied message={te("systemSettingsDenied")} />
      </div>
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
      {q.isLoading ? (
        <Skeleton className="h-64 w-full max-w-3xl" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="max-w-3xl rounded-none border">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <GearSixIcon className="size-6" aria-hidden />
              <CardTitle className="text-base">{t("rawSettings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted/40 max-h-[28rem] overflow-auto rounded-none border p-4 text-xs leading-relaxed wrap-break-word whitespace-pre-wrap">
                {JSON.stringify(q.data ?? {}, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
