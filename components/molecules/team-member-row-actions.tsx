"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DotsThreeOutlineVerticalIcon } from "@phosphor-icons/react";
import {
  patchUserRole,
  patchUserStatus,
  removeTeamMember,
  type StaffRole,
} from "@/lib/api/users-client";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ROLES: { value: StaffRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "sales", label: "Sales" },
  { value: "inventory", label: "Inventory" },
  { value: "accountant", label: "Accountant" },
  { value: "support", label: "Support" },
  { value: "viewer", label: "Viewer" },
];

/** Status values managers can assign (invite lifecycle may still show `invited`). */
const STATUS_OPTIONS = [
  { value: "active" as const, label: "Active" },
  { value: "suspended" as const, label: "Suspended" },
  { value: "disabled" as const, label: "Disabled" },
];

export function TeamMemberRowActions({
  row,
  currentUserId,
}: {
  row: Record<string, unknown>;
  currentUserId: string;
}) {
  const qc = useQueryClient();
  const tc = useTranslations("common");
  const t = useTranslations("dashboard.users");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [busy, setBusy] = useState(false);

  const id = String(row.id ?? row._id ?? "");
  const isOwner = Boolean(row.isOwner);
  const isSelf = id === currentUserId && currentUserId.length > 0;
  const currentRole = String(row.role ?? "");
  const currentStatus = String(row.status ?? "");

  async function setRole(role: StaffRole) {
    if (role === currentRole) return;
    setBusy(true);
    try {
      await patchUserRole(id, { role });
      toast.success(t("roleUpdated"));
      await qc.invalidateQueries({ queryKey: ["users"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : t("roleUpdateFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(
    status: (typeof STATUS_OPTIONS)[number]["value"],
  ) {
    if (status === currentStatus) return;
    setBusy(true);
    try {
      await patchUserStatus(id, { status });
      toast.success(t("statusUpdated"));
      await qc.invalidateQueries({ queryKey: ["users"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : t("statusUpdateFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await removeTeamMember(id);
      toast.success(t("teammateRemoved"));
      await qc.invalidateQueries({ queryKey: ["users"] });
    } catch (e: unknown) {
      toast.error(e instanceof ApiError ? e.message : t("removeFailed"));
    } finally {
      setBusy(false);
      setConfirmRemove(false);
    }
  }

  if (isOwner) {
    return (
      <span className="text-muted-foreground pr-2 text-xs" title={t("owner")}>
        {t("owner")}
      </span>
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
            disabled={busy}
            aria-label={t("memberActions")}
          >
            <DotsThreeOutlineVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="rounded-none">
              {t("setRole")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="rounded-none">
              {ROLES.map((r) => (
                <DropdownMenuItem
                  key={r.value}
                  className="rounded-none"
                  disabled={r.value === currentRole}
                  onSelect={() => void setRole(r.value)}
                >
                  {r.label}
                  {r.value === currentRole ? ` · ${tc("current")}` : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="rounded-none">
              {t("setStatus")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="rounded-none">
              {STATUS_OPTIONS.map((s) => (
                <DropdownMenuItem
                  key={s.value}
                  className="rounded-none"
                  disabled={s.value === currentStatus}
                  onSelect={() => void setStatus(s.value)}
                >
                  {s.label}
                  {s.value === currentStatus ? ` · ${tc("current")}` : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive rounded-none"
            disabled={isSelf}
            title={isSelf ? t("selfRemoveHint") : undefined}
            onSelect={() => setConfirmRemove(true)}
          >
            {t("removeFromTeam")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmRemoveTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmRemoveDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none" disabled={busy}>
              {tc("actionCancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={busy}
              onClick={() => void remove()}
            >
              {tc("actionRemove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
