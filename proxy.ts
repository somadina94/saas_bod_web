import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function pathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && (locales as readonly string[]).includes(first)) {
    return "/" + segments.slice(1).join("/");
  }
  return pathname === "" ? "/" : pathname;
}

export function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const pathname = request.nextUrl.pathname;
  const normalized = pathWithoutLocale(pathname);
  const isDashboard =
    normalized === "/dashboard" || normalized.startsWith("/dashboard/");

  if (isDashboard) {
    const token = request.cookies.get("bod_access")?.value;
    if (!token) {
      const login = new URL("/login", request.url);
      login.searchParams.set("from", pathname + request.nextUrl.search);
      return NextResponse.redirect(login);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: [
    "/",
    "/(ar|de|en|es|fr|it|nl|pl)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
