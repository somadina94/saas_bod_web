"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DotsThreeOutlineVerticalIcon } from "@phosphor-icons/react";
import { salesApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SaleRowActions({ row }: { row: Record<string, unknown> }) {
  const qc = useQueryClient();
  const id = String(row.id ?? row._id ?? "");
  const status = String(row.status ?? "");
  const [completeOpen, setCompleteOpen] = useState(false);
  const [deduct, setDeduct] = useState(true);

  async function complete() {
    try {
      await salesApi.complete(id, deduct);
      toast.success("Sale completed");
      await qc.invalidateQueries({ queryKey: ["sales"] });
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      await qc.invalidateQueries({ queryKey: ["products"] });
      setCompleteOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Complete failed");
    }
  }

  if (status !== "draft") {
    return (
      <span className="text-muted-foreground text-xs">—</span>
    );
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
          <DropdownMenuItem onSelect={() => setCompleteOpen(true)}>
            Complete sale
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="rounded-none sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete sale</DialogTitle>
            <DialogDescription>
              Finalizes the sale and optionally deducts product stock.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-2">
            <Checkbox
              id="deduct"
              checked={deduct}
              onCheckedChange={(v) => setDeduct(v === true)}
            />
            <Label htmlFor="deduct" className="text-sm font-normal">
              Deduct inventory for product lines
            </Label>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => setCompleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-none"
              onClick={() => void complete()}
            >
              Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
