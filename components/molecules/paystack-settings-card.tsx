"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
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

function CopyRow({
  label,
  value,
  copiedLabel,
}: {
  label: string;
  value: string;
  copiedLabel: string;
}) {
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
            toast.success(copiedLabel);
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
  const t = useTranslations("dashboard.paystack");
  const tc = useTranslations("common");
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
      toast.success(t("saved"));
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : t("saveFailed"));
    }
  }

  async function testConnection() {
    try {
      const result = await companyApi.testPaystack();
      if (result.ok) {
        toast.success(t("validOk"));
      } else {
        toast.error(t("validBad"));
      }
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : t("testFailed"));
    }
  }

  return (
    <Card className="max-w-xl rounded-none border">
      <CardHeader>
        <CardTitle className="text-base">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {callbackUrl ? (
          <CopyRow
            label={t("callbackUrl")}
            value={callbackUrl}
            copiedLabel={tc("copied")}
          />
        ) : null}
        {webhookUrl ? (
          <CopyRow
            label={t("webhookUrl")}
            value={webhookUrl}
            copiedLabel={tc("copied")}
          />
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="pk">{t("publicKey")}</Label>
          <Input
            id="pk"
            className="font-mono text-xs"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder={t("pkPlaceholder")}
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sk">{t("secretKey")}</Label>
          <Input
            id="sk"
            type="password"
            className="font-mono text-xs"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={
              configured ? t("skPlaceholderConfigured") : t("skPlaceholderNew")
            }
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="rounded-none" onClick={() => void saveKeys()}>
            {t("saveKeys")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-none"
            onClick={() => void testConnection()}
          >
            {t("testConnection")}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">{t("footNote")}</p>
      </CardContent>
    </Card>
  );
}
