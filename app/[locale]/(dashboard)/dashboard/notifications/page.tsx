"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckIcon } from "@phosphor-icons/react";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { notificationsApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

function MarkAllReadButton() {
  const t = useTranslations("dashboard.notifications");
  const qc = useQueryClient();
  async function onMark() {
    try {
      await notificationsApi.markAllRead();
      toast.success(t("markAllReadToast"));
      await qc.invalidateQueries({ queryKey: ["notifications"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : t("updateFailed"));
    }
  }
  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-none gap-2"
      onClick={() => void onMark()}
    >
      <CheckIcon className="size-4" />
      {t("markAllRead")}
    </Button>
  );
}

export default function NotificationsPage() {
  const t = useTranslations("dashboard.notifications");
  const tc = useTranslations("common");

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["notifications"]}
      endpointPath="/notifications"
      headerActions={<MarkAllReadButton />}
      columns={[
        {
          id: "title",
          header: t("columns.title"),
          cell: (r) => String(r.title ?? r.type ?? tc("dash")),
        },
        {
          id: "read",
          header: t("columns.read"),
          cell: (r) => (r.readAt ? tc("yes") : tc("no")),
        },
        {
          id: "created",
          header: t("columns.received"),
          cell: (r) => formatDate(r.createdAt),
        },
      ]}
    />
  );
}
