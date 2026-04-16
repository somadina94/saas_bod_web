"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DotsThreeOutlineVerticalIcon } from "@phosphor-icons/react";
import { purchaseOrdersApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PurchaseOrderRowActions({ row }: { row: Record<string, unknown> }) {
  const qc = useQueryClient();
  const id = String(row.id ?? row._id ?? "");
  const status = String(row.status ?? "");

  async function approve() {
    try {
      await purchaseOrdersApi.approve(id);
      toast.success("PO approved");
      await qc.invalidateQueries({ queryKey: ["purchase-orders"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Approve failed");
    }
  }

  async function receiveFull() {
    try {
      const po = await purchaseOrdersApi.get(id);
      const rawItems = po.items as Array<Record<string, unknown>> | undefined;
      if (!rawItems?.length) {
        toast.error("No lines on PO");
        return;
      }
      const lines = rawItems.map((line, idx) => {
        const ord = Number(line.quantityOrdered ?? 0);
        const rec = Number(line.quantityReceived ?? 0);
        return { lineIndex: idx, quantity: Math.max(0, ord - rec) };
      }).filter((l) => l.quantity > 0);
      if (lines.length === 0) {
        toast.error("Nothing left to receive");
        return;
      }
      await purchaseOrdersApi.receive(id, { lines });
      toast.success("Goods received");
      await qc.invalidateQueries({ queryKey: ["purchase-orders"] });
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Receive failed");
    }
  }

  const canApprove = status === "draft" || status === "pending_approval";
  const canReceive =
    status === "approved" ||
    status === "partially_received";

  if (!canApprove && !canReceive) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-none"
          aria-label="Row actions"
        >
          <DotsThreeOutlineVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canApprove ? (
          <DropdownMenuItem onSelect={() => void approve()}>
            Approve
          </DropdownMenuItem>
        ) : null}
        {canReceive ? (
          <DropdownMenuItem onSelect={() => void receiveFull()}>
            Receive remaining
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
