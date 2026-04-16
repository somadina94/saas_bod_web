"use client";

import { normalizeUser } from "./normalize";
import type { User } from "./types";
import { ApiError, apiFetch } from "./client";

export async function loginRequest(body: {
  email: string;
  password: string;
}): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const json = (await res.json()) as {
    status?: string;
    data?: { user: Record<string, unknown> };
    message?: string;
  };
  if (!res.ok) {
    throw new ApiError(json.message ?? "Login failed", res.status);
  }
  const raw = json.data?.user;
  if (!raw || typeof raw !== "object") {
    throw new ApiError("Invalid login response", 502);
  }
  return normalizeUser(raw as Record<string, unknown>);
}

export async function registerBootstrapRequest(body: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  industry?: string;
  currency?: string;
}): Promise<User> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const json = (await res.json()) as {
    status?: string;
    data?: { user: Record<string, unknown> };
    message?: string;
  };
  if (!res.ok) {
    throw new ApiError(json.message ?? "Registration failed", res.status);
  }
  const raw = json.data?.user;
  if (!raw || typeof raw !== "object") {
    throw new ApiError("Invalid registration response", 502);
  }
  return normalizeUser(raw as Record<string, unknown>);
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchCurrentUser(): Promise<User> {
  const raw = await apiFetch<Record<string, unknown>>("/auth/me");
  return normalizeUser(raw);
}

export async function acceptInviteRequest(body: {
  email: string;
  token: string;
  newPassword: string;
}): Promise<void> {
  const res = await fetch("/api/auth/accept-invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const json = (await res.json()) as {
    status?: string;
    message?: string;
  };
  if (!res.ok) {
    throw new ApiError(json.message ?? "Could not accept invitation", res.status);
  }
}
