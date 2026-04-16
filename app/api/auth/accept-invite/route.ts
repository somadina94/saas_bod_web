import { NextResponse } from "next/server";
import { backendInternalUrl } from "@/lib/env.server";

/** Mirrors login: sets httpOnly cookies after staff accepts invitation. */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: "fail", message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  let res: Response;
  try {
    res = await fetch(`${backendInternalUrl}/api/v1/auth/accept-invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
    data?: {
      accessToken: string;
      refreshToken: string;
      expiresIn?: string;
    };
    message?: string;
  };
  try {
    json = rawText ? (JSON.parse(rawText) as typeof json) : {};
  } catch {
    return NextResponse.json(
      { status: "fail", message: "Invalid response from API server" },
      { status: 502 },
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { status: "fail", message: json.message ?? "Could not accept invite" },
      { status: res.status },
    );
  }

  const d = json.data;
  if (!d?.accessToken || !d?.refreshToken) {
    return NextResponse.json(
      { status: "fail", message: "Invalid response from server" },
      { status: 502 },
    );
  }

  const out = NextResponse.json({ status: "success", data: { ok: true } });

  const accessMax = 60 * 60;
  const refreshMax = 60 * 60 * 24 * 7;

  out.cookies.set("bod_access", d.accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: accessMax,
  });
  out.cookies.set("bod_refresh", d.refreshToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: refreshMax,
  });

  return out;
}
