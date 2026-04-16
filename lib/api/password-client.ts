"use client";

import { apiFetch } from "./client";

export type ForgotPasswordResult = {
  message: string;
  /** Present in development when email send fails or for local testing. */
  resetUrl?: string;
};

export async function requestPasswordReset(
  email: string,
): Promise<ForgotPasswordResult> {
  return apiFetch<ForgotPasswordResult>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordWithToken(params: {
  email: string;
  token: string;
  password: string;
}): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
