import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { backendInternalUrl } from "@/lib/env.server";

export const dynamic = "force-dynamic";

async function forward(
  req: NextRequest,
  method: string,
  pathSegments: string[],
) {
  const path = pathSegments.join("/");
  const search = req.nextUrl.search;
  const cookieStore = await cookies();
  const token = cookieStore.get("bod_access")?.value;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const l = key.toLowerCase();
    if (["host", "connection"].includes(l)) return;
    headers.set(key, value);
  });
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const backendUrl = `${backendInternalUrl}/api/v1/${path}${search}`;

  const init: RequestInit & { duplex?: "half" } = {
    method,
    headers,
  };

  if (!["GET", "HEAD"].includes(method)) {
    init.body = req.body;
    init.duplex = "half";
  }

  const res = await fetch(backendUrl, init);
  const buf = await res.arrayBuffer();
  const out = new NextResponse(buf, { status: res.status });
  res.headers.forEach((value, key) => {
    const kl = key.toLowerCase();
    if (kl === "transfer-encoding") return;
    out.headers.set(key, value);
  });
  return out;
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, "GET", path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, "POST", path);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, "PUT", path);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, "PATCH", path);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, "DELETE", path);
}
