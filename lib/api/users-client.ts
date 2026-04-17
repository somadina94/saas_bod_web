"use client";

import { apiFetch } from "./client";

export type StaffRole =
  | "admin"
  | "manager"
  | "sales"
  | "inventory"
  | "accountant"
  | "support"
  | "viewer";

/** Staff account status (not `deleted`; removal uses DELETE). */
export type TeamMemberStatus = "active" | "invited" | "suspended" | "disabled";

export type CreateStaffPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role: StaffRole;
  department?: string;
  jobTitle?: string;
};

export type CreateStaffResult = {
  user: Record<string, unknown>;
};

export async function createStaffUser(
  body: CreateStaffPayload,
): Promise<CreateStaffResult> {
  return apiFetch<CreateStaffResult>("/users", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function patchUserRole(
  userId: string,
  body: { role: StaffRole },
): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>(`/users/${encodeURIComponent(userId)}/role`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function patchUserStatus(
  userId: string,
  body: { status: TeamMemberStatus },
): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>(`/users/${encodeURIComponent(userId)}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function removeTeamMember(userId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}
