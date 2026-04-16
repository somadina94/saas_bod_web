"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { formatDate } from "@/lib/format";

export default function AuditLogsPage() {
  return (
    <ResourceListPage
      title="Audit log"
      description="Immutable trail of sensitive actions."
      queryKey={["audit-logs"]}
      endpointPath="/audit-logs"
      columns={[
        {
          id: "action",
          header: "Action",
          cell: (r) => String(r.action ?? "—"),
        },
        {
          id: "entity",
          header: "Entity",
          cell: (r) => String(r.entityType ?? "—"),
        },
        {
          id: "actor",
          header: "Actor",
          cell: (r) => String(r.actorId ?? "—"),
        },
        {
          id: "when",
          header: "When",
          cell: (r) => formatDate(r.createdAt),
        },
      ]}
    />
  );
}
