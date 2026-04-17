"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { formatDate } from "@/lib/format";

export default function AuditLogsPage() {
  const t = useTranslations("dashboard.auditLogs");
  const tc = useTranslations("common");

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["audit-logs"]}
      endpointPath="/audit-logs"
      columns={[
        {
          id: "action",
          header: t("columns.action"),
          cell: (r) => String(r.action ?? tc("dash")),
        },
        {
          id: "entity",
          header: t("columns.entity"),
          cell: (r) => String(r.entityType ?? tc("dash")),
        },
        {
          id: "actor",
          header: t("columns.actor"),
          cell: (r) => String(r.actorId ?? tc("dash")),
        },
        {
          id: "when",
          header: t("columns.when"),
          cell: (r) => formatDate(r.createdAt),
        },
      ]}
    />
  );
}
