"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BillingCallbackPage() {
  const t = useTranslations("dashboard.billing.callback");
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const status = (params.get("status") ?? "").toLowerCase();
  const ok = ["success", "successful"].includes(status);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl items-center p-4 md:p-6">
      <Card className="w-full rounded-none border">
        <CardHeader className="space-y-2">
          <Badge className="w-fit rounded-none" variant={ok ? "default" : "secondary"}>
            {ok ? t("badgeSuccess") : t("badgePending")}
          </Badge>
          <CardTitle>
            {ok ? t("titleSuccess") : t("titlePending")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            {ok ? t("bodySuccess") : t("bodyPending")}
          </p>
          {reference ? (
            <p className="text-muted-foreground">
              {t("referenceLine", { reference })}
            </p>
          ) : null}
          <Button asChild className="rounded-none">
            <Link href="/dashboard/billing">{t("backToBilling")}</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
