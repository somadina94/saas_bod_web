"use client";

import { ResourceListPage } from "@/components/molecules/resource-list-page";
import { InviteTeamMemberDialog } from "@/components/molecules/invite-team-member-dialog";
import { useAppSelector } from "@/lib/store/hooks";

export default function UsersPage() {
  const canManage = useAppSelector(
    (s) => s.auth.user?.isOwner || s.auth.user?.permissions?.canManageUsers,
  );

  return (
    <ResourceListPage
      title="Team"
      description="Invite colleagues, assign roles, and manage access. Only people with user-management permission see invite actions."
      queryKey={["users"]}
      endpointPath="/users"
      headerActions={canManage ? <InviteTeamMemberDialog /> : null}
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
