import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  // Admin sayfaları ve admin API'leri koru
  const isAdminPage = pathname.startsWith("/admin");
  const isProtectedApi =
    pathname.startsWith("/api/blog") ||
    pathname.startsWith("/api/settings") ||
    pathname.startsWith("/api/messages") ||
    pathname.startsWith("/api/upload");

  if (isAdminPage || isProtectedApi) {
    if (token !== "authenticated") {
      // API isteği ise 401 döndür, sayfa isteği ise login'e yönlendir
      if (isProtectedApi) {
        return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/blog/:path*",
    "/api/settings/:path*",
    "/api/messages/:path*",
    "/api/upload/:path*",
  ],
};
