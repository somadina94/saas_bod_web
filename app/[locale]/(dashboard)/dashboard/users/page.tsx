"use client";

import { useTranslations } from "next-intl";
import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { InviteTeamMemberDialog } from "@/components/molecules/invite-team-member-dialog";
import { TeamMemberRowActions } from "@/components/molecules/team-member-row-actions";
import { useAppSelector } from "@/lib/store/hooks";

export default function UsersPage() {
  const t = useTranslations("dashboard.users");
  const tc = useTranslations("common");
  const user = useAppSelector((s) => s.auth.user);
  const canManage = Boolean(
    user?.isOwner || user?.permissions?.canManageUsers,
  );

  return (
    <ResourceListPage
      title={t("title")}
      description={t("description")}
      queryKey={["users"]}
      endpointPath="/users"
      headerActions={canManage ? <InviteTeamMemberDialog /> : null}
      rowActions={
        canManage && user?.id
          ? (row) => (
              <TeamMemberRowActions row={row} currentUserId={user.id} />
            )
          : undefined
      }
      columns={[
        {
          id: "name",
          header: t("columns.name"),
          cell: (r) =>
            `${String(r.firstName ?? "")} ${String(r.lastName ?? "")}`.trim() ||
            tc("dash"),
        },
        {
          id: "email",
          header: t("columns.email"),
          cell: (r) => String(r.email ?? tc("dash")),
        },
        {
          id: "role",
          header: t("columns.role"),
          cell: (r) => String(r.role ?? tc("dash")),
        },
        {
          id: "status",
          header: t("columns.status"),
          cell: (r) => String(r.status ?? tc("dash")),
        },
      ]}
    />
  );
}
