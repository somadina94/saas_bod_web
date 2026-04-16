import { NextResponse } from "next/server";
import { backendInternalUrl } from "@/lib/env.server";

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
    res = await fetch(`${backendInternalUrl}/api/v1/auth/register`, {
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
      user: unknown;
      accessToken: string;
      refreshToken: string;
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
      { status: "fail", message: json.message ?? "Registration failed" },
      { status: res.status },
    );
  }

  const d = json.data;
  if (!d?.accessToken || !d.refreshToken) {
    return NextResponse.json(
      { status: "fail", message: "Invalid response from server" },
      { status: 502 },
    );
  }

  const out = NextResponse.json({
    status: "success",
    data: { user: d.user },
  });

  out.cookies.set("bod_access", d.accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
  });
  out.cookies.set("bod_refresh", d.refreshToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return out;
}
