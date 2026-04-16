"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckIcon } from "@phosphor-icons/react";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { notificationsApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

function MarkAllReadButton() {
  const qc = useQueryClient();
  async function onMark() {
    try {
      await notificationsApi.markAllRead();
      toast.success("All notifications marked read");
      await qc.invalidateQueries({ queryKey: ["notifications"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Update failed");
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
      Mark all read
    </Button>
  );
}

export default function NotificationsPage() {
  return (
    <ResourceListPage
      title="Notifications"
      description="Your personal inbox across the workspace."
      queryKey={["notifications"]}
      endpointPath="/notifications"
      headerActions={<MarkAllReadButton />}
      columns={[
        {
          id: "title",
          header: "Title",
          cell: (r) => String(r.title ?? r.type ?? "—"),
        },
        {
          id: "read",
          header: "Read",
          cell: (r) => (r.readAt ? "Yes" : "No"),
        },
        {
          id: "created",
          header: "Received",
          cell: (r) => formatDate(r.createdAt),
        },
      ]}
    />
  );
}
