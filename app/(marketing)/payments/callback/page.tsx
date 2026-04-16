"use client";

import Link from "next/link";
import { useMemo } from "react";
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
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const status = params.get("status");
  const state = useMemo(() => normalizeStatus(status), [status]);

  const title =
    state === "success"
      ? "Payment successful"
      : state === "failed"
        ? "Payment was not completed"
        : "Payment is processing";
  const description =
    state === "success"
      ? "Thanks. Your payment has been received and is being applied to your invoice."
      : state === "failed"
        ? "Your payment did not complete. You can retry using the payment link in your invoice email."
        : "We are confirming your payment. This usually resolves shortly.";
  const badgeVariant =
    state === "success" ? "default" : state === "failed" ? "destructive" : "secondary";

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl items-center p-4 md:p-6">
      <Card className="w-full rounded-none border">
        <CardHeader className="space-y-2">
          <Badge className="w-fit rounded-none" variant={badgeVariant}>
            {state.toUpperCase()}
          </Badge>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">{description}</p>
          {reference ? (
            <p className="text-muted-foreground">
              Reference: <span className="font-medium text-foreground">{reference}</span>
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-none">
              <Link href="/">Go to home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
