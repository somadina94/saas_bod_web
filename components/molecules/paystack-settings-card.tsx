"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CopyIcon } from "@phosphor-icons/react";
import { companyApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CopyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="flex gap-2">
        <Input readOnly className="font-mono text-xs" value={value} />
        <Button
          type="button"
          variant="outline"
          className="shrink-0 rounded-none"
          onClick={() => {
            void navigator.clipboard.writeText(value);
            toast.success("Copied");
          }}
        >
          <CopyIcon className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

export function PaystackSettingsCard({
  initial,
}: {
  initial: Record<string, unknown>;
}) {
  const qc = useQueryClient();
  const [publicKey, setPublicKey] = useState(
    String(initial.paystackPublicKey ?? ""),
  );
  const [secretKey, setSecretKey] = useState("");
  const configured = Boolean(initial.paystackSecretConfigured);

  const callbackUrl = String(initial.tenantInvoiceCallbackUrl ?? "");
  const webhookUrl = String(initial.tenantPaystackWebhookUrl ?? "");

  async function saveKeys() {
    try {
      await companyApi.patch({
        paystackPublicKey: publicKey.trim() || undefined,
        ...(secretKey.trim() ? { paystackSecretKey: secretKey.trim() } : {}),
      });
      setSecretKey("");
      await qc.invalidateQueries({ queryKey: ["company"] });
      toast.success("Payment settings saved");
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Save failed");
    }
  }

  async function testConnection() {
    try {
      await companyApi.testPaystack();
      toast.success("Paystack credentials are valid");
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Test failed");
    }
  }

  return (
    <Card className="max-w-xl rounded-none border">
      <CardHeader>
        <CardTitle className="text-base">Payments / Paystack</CardTitle>
        <CardDescription>
          Customer invoice payments use your Paystack merchant account. Paste the
          callback and webhook URLs in Paystack Dashboard → Settings → API /
          Webhooks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {callbackUrl ? <CopyRow label="Callback URL" value={callbackUrl} /> : null}
        {webhookUrl ? <CopyRow label="Webhook URL" value={webhookUrl} /> : null}
        <div className="space-y-2">
          <Label htmlFor="pk">Public key</Label>
          <Input
            id="pk"
            className="font-mono text-xs"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="pk_live_… or pk_test_…"
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sk">Secret key</Label>
          <Input
            id="sk"
            type="password"
            className="font-mono text-xs"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={configured ? "•••• configured — enter to rotate" : "sk_live_…"}
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="rounded-none" onClick={() => void saveKeys()}>
            Save keys
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-none"
            onClick={() => void testConnection()}
          >
            Test connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
