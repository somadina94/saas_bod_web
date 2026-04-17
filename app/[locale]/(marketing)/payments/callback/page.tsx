"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PaymentUiState = "success" | "failed" | "pending";

const normalizeStatus = (raw: string | null): PaymentUiState => {
  const v = (raw ?? "").toLowerCase().trim();
  if (["success", "successful", "completed", "paid"].includes(v)) {
    return "success";
  }
  if (["failed", "abandoned", "cancelled", "error"].includes(v)) {
    return "failed";
  }
  return "pending";
};

export default function PaymentCallbackPage() {
  const t = useTranslations("callbacks.payment");
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const status = params.get("status");
  const state = useMemo(() => normalizeStatus(status), [status]);

  const title =
    state === "success"
      ? t("successTitle")
      : state === "failed"
        ? t("failedTitle")
        : t("pendingTitle");
  const description =
    state === "success"
      ? t("successDesc")
      : state === "failed"
        ? t("failedDesc")
        : t("pendingDesc");
  const badgeLabel =
    state === "success"
      ? t("successBadge")
      : state === "failed"
        ? t("failedBadge")
        : t("pendingBadge");
  const badgeVariant =
    state === "success" ? "default" : state === "failed" ? "destructive" : "secondary";

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl items-center p-4 md:p-6">
      <Card className="w-full rounded-none border">
        <CardHeader className="space-y-2">
          <Badge className="w-fit rounded-none" variant={badgeVariant}>
            {badgeLabel}
          </Badge>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">{description}</p>
          {reference ? (
            <p className="text-muted-foreground">
              {t("referenceLine", { reference })}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-none">
              <Link href="/">{t("home")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
