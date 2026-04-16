"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DotsThreeOutlineVerticalIcon } from "@phosphor-icons/react";
import { expensesApi } from "@/lib/api/entities";
import { ApiError } from "@/lib/api/client";
import { useAppSelector } from "@/lib/store/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ExpenseRowActions({ row }: { row: Record<string, unknown> }) {
  const qc = useQueryClient();
  const id = String(row.id ?? row._id ?? "");
  const status = String(row.status ?? "");
  const canApprove = useAppSelector(
    (s) =>
      s.auth.user?.isOwner ||
      s.auth.user?.permissions?.canApproveExpenses === true,
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  async function submitForApproval() {
    try {
      await expensesApi.patch(id, { status: "pending" });
      toast.success("Submitted for approval");
      await qc.invalidateQueries({ queryKey: ["expenses"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Update failed");
    }
  }

  async function approve() {
    try {
      await expensesApi.approve(id);
      toast.success("Expense approved");
      await qc.invalidateQueries({ queryKey: ["expenses"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Approve failed");
    }
  }

  async function reject() {
    try {
      await expensesApi.reject(id, reason || "Rejected");
      toast.success("Expense rejected");
      await qc.invalidateQueries({ queryKey: ["expenses"] });
      setRejectOpen(false);
      setReason("");
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : "Reject failed");
    }
  }

  const showSubmit = status === "draft";
  const showApproveReject = status === "pending" && canApprove;

  if (!showSubmit && !showApproveReject) {
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
        <DropdownMenuContent align="end" className="w-52">
          {showSubmit ? (
            <DropdownMenuItem onSelect={() => void submitForApproval()}>
              Submit for approval
            </DropdownMenuItem>
          ) : null}
          {showApproveReject ? (
            <>
              <DropdownMenuItem onSelect={() => void approve()}>
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setRejectOpen(true)}>
                Reject…
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="rounded-none sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject expense</DialogTitle>
            <DialogDescription>
              Provide a short reason for the submitter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="rej">Reason</Label>
            <Input
              id="rej"
              className="rounded-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => setRejectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-none"
              onClick={() => void reject()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
