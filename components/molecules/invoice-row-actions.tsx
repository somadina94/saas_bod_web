"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DotsThreeOutlineVerticalIcon } from "@phosphor-icons/react";
import { invoicesApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceFormDialog } from "./invoice-form-dialog";

export function InvoiceRowActions({ row }: { row: Record<string, unknown> }) {
  const qc = useQueryClient();
  const id = String(row.id ?? row._id ?? "");
  const status = String(row.status ?? "");
  const [editOpen, setEditOpen] = useState(false);

  async function sendInv() {
    try {
      await invoicesApi.send(id);
      toast.success("Invoice sent");
      await qc.invalidateQueries({ queryKey: ["invoices"] });
      await qc.invalidateQueries({ queryKey: ["customers"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Send failed");
    }
  }

  const isDraft = status === "draft";

  if (!isDraft) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  return (
    <>
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
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            Edit draft
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => void sendInv()}>
            Send invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InvoiceFormDialog
        mode="edit"
        invoiceId={id}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
