import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendInternalUrl } from "@/lib/env.server";

export async function POST() {
  const jar = await cookies();
  const refresh = jar.get("bod_refresh")?.value;
  if (!refresh) {
    return NextResponse.json(
      { status: "fail", message: "No refresh token" },
      { status: 401 },
    );
  }

  let res: Response;
  try {
    res = await fetch(`${backendInternalUrl}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
  } catch {
    return NextResponse.json(
      {
        status: "fail",
        message:
          "Cannot reach the API server. Start the backend (see BACKEND_INTERNAL_URL).",
      },
      { status: 502 },
    );
  }

  const rawText = await res.text();
  let json: {
    status?: string;
    data?: { accessToken: string; refreshToken?: string };
    message?: string;
  };
  try {
    json = rawText ? (JSON.parse(rawText) as typeof json) : {};
  } catch {
    const out = NextResponse.json(
      { status: "fail", message: "Invalid response from API server" },
      { status: 502 },
    );
    out.cookies.set("bod_access", "", { path: "/", maxAge: 0 });
    out.cookies.set("bod_refresh", "", { path: "/", maxAge: 0 });
    return out;
  }

  if (!res.ok || !json.data?.accessToken) {
    const out = NextResponse.json(
      { status: "fail", message: json.message ?? "Refresh failed" },
      { status: res.status },
    );
    out.cookies.set("bod_access", "", { path: "/", maxAge: 0 });
    out.cookies.set("bod_refresh", "", { path: "/", maxAge: 0 });
    return out;
  }

  const out = NextResponse.json({ status: "success", data: { ok: true } });
  out.cookies.set("bod_access", json.data.accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
  });
  if (json.data.refreshToken) {
    out.cookies.set("bod_refresh", json.data.refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return out;
}
