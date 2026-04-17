"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { InviteTeamMemberDialog } from "@/components/molecules/invite-team-member-dialog";
import { TeamMemberRowActions } from "@/components/molecules/team-member-row-actions";
import { useAppSelector } from "@/lib/store/hooks";

export default function UsersPage() {
  const user = useAppSelector((s) => s.auth.user);
  const canManage = Boolean(
    user?.isOwner || user?.permissions?.canManageUsers,
  );

  return (
    <ResourceListPage
      title="Team"
      description="Invite colleagues, assign roles, and manage access. Owners and people with user-management permission can invite teammates, change roles and status, or remove access."
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
          header: "Name",
          cell: (r) =>
            `${String(r.firstName ?? "")} ${String(r.lastName ?? "")}`.trim() ||
            "—",
        },
        {
          id: "email",
          header: "Email",
          cell: (r) => String(r.email ?? "—"),
        },
        {
          id: "role",
          header: "Role",
          cell: (r) => String(r.role ?? "—"),
        },
        {
          id: "status",
          header: "Status",
          cell: (r) => String(r.status ?? "—"),
        },
      ]}
    />
  );
}
