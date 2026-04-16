"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DotsThreeOutlineVerticalIcon } from "@phosphor-icons/react";
import { quotationsApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QuotationFormDialog } from "./quotation-form-dialog";

export function QuotationRowActions({ row }: { row: Record<string, unknown> }) {
  const qc = useQueryClient();
  const id = String(row.id ?? row._id ?? "");
  const status = String(row.status ?? "");
  const [editOpen, setEditOpen] = useState(false);

  async function sendQuote() {
    try {
      await quotationsApi.patch(id, { status: "sent" });
      toast.success("Quotation sent");
      await qc.invalidateQueries({ queryKey: ["quotations"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Send failed");
    }
  }

  async function convert() {
    try {
      await quotationsApi.convertToInvoice(id, { dueDays: 14 });
      toast.success("Invoice created from quotation");
      await qc.invalidateQueries({ queryKey: ["quotations"] });
      await qc.invalidateQueries({ queryKey: ["invoices"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Convert failed");
    }
  }

  const canEdit = status === "draft";
  const canSend = status === "draft";
  const canConvert = status !== "converted";

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
        <DropdownMenuContent align="end" className="w-52">
          {canEdit ? (
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              Edit
            </DropdownMenuItem>
          ) : null}
          {canSend ? (
            <DropdownMenuItem onSelect={() => void sendQuote()}>
              Mark as sent
            </DropdownMenuItem>
          ) : null}
          {canConvert ? (
            <DropdownMenuItem onSelect={() => void convert()}>
              Convert to invoice
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <QuotationFormDialog
        mode="edit"
        quotationId={id}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
