"use client";

import Link from "next/link";
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
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const status = (params.get("status") ?? "").toLowerCase();
  const ok = ["success", "successful"].includes(status);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl items-center p-4 md:p-6">
      <Card className="w-full rounded-none border">
        <CardHeader className="space-y-2">
          <Badge className="w-fit rounded-none" variant={ok ? "default" : "secondary"}>
            {ok ? "SUCCESS" : "PENDING"}
          </Badge>
          <CardTitle>
            {ok ? "Subscription payment received" : "Processing subscription"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">
            {ok
              ? "Thank you. Your workspace subscription will update shortly after Paystack confirms the charge."
              : "If you completed payment, confirmation may take a moment."}
          </p>
          {reference ? (
            <p className="text-muted-foreground">
              Reference:{" "}
              <span className="font-medium text-foreground">{reference}</span>
            </p>
          ) : null}
          <Button asChild className="rounded-none">
            <Link href="/dashboard/billing">Back to billing</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
