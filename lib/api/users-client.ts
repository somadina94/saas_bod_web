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
