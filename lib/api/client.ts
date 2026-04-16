"use client";

import { publicApiBase } from "@/lib/env";
import { refreshSession } from "./refresh";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function buildHeaders(init?: RequestInit): HeadersInit {
  const fromInit = (init?.headers as Record<string, string>) ?? {};
  if (
    init?.body &&
    typeof FormData !== "undefined" &&
    init.body instanceof FormData
  ) {
    return { ...fromInit };
  }
  if (init?.body != null && init.body !== "") {
    return { "Content-Type": "application/json", ...fromInit };
  }
  return { ...fromInit };
}

async function parseJson<T>(res: Response): Promise<T | Record<string, unknown>> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as T;
  } catch {
    return {};
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  didRefresh = false,
): Promise<T> {
  const url = path.startsWith("http") ? path : `${publicApiBase}${path}`;
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: buildHeaders(init),
  });

  const json = (await parseJson(res)) as
    | { status: string; data?: T; message?: string }
    | Record<string, unknown>;

  if (res.status === 401 && !didRefresh) {
    const ok = await refreshSession();
    if (ok) {
      return apiFetch<T>(path, init, true);
    }
  }

  if (!res.ok) {
    const msg =
      typeof json === "object" && json && "message" in json
        ? String((json as { message: string }).message)
        : res.statusText;
    throw new ApiError(msg, res.status);
  }

  if (
    typeof json === "object" &&
    json &&
    "status" in json &&
    json.status === "success" &&
    "data" in json
  ) {
    return (json as { data: T }).data;
  }

  return json as T;
}

export async function apiFetchRaw(path: string, init?: RequestInit) {
  const url = path.startsWith("http") ? path : `${publicApiBase}${path}`;
  return fetch(url, { ...init, credentials: "include" });
}
