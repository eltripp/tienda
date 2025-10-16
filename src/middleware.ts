import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // Protect /api/account routes
  if (request.nextUrl.pathname.startsWith("/api/account")) {
    if (!token) {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Protect /account routes (UI)
  if (request.nextUrl.pathname.startsWith("/account")) {
    if (!token) {
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      const signInUrl = new URL(`/auth/sign-in?callbackUrl=${callbackUrl}`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/api/account/:path*"],
};