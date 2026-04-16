import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendInternalUrl } from "@/lib/env.server";

export async function POST() {
  const jar = await cookies();
  const access = jar.get("bod_access")?.value;

  if (access) {
    await fetch(`${backendInternalUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    }).catch(() => {});
  }

  const res = NextResponse.json({ status: "success", data: { ok: true } });
  res.cookies.set("bod_access", "", { path: "/", maxAge: 0 });
  res.cookies.set("bod_refresh", "", { path: "/", maxAge: 0 });
  return res;
}
