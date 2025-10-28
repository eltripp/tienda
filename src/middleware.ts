import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Logging para depuración
  console.log("Middleware: Pathname:", request.nextUrl.pathname);
  console.log("Middleware: Cookies:", request.cookies.getAll());
  
  // Usar getToken para verificar la sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  
  console.log("Middleware: Token:", token);
  
  // Proteger rutas de API
  if (request.nextUrl.pathname.startsWith("/api/account")) {
    if (!token) {
      console.log("Middleware: No autorizado para API");
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  
  // Proteger rutas de UI
  if (request.nextUrl.pathname.startsWith("/account")) {
    if (!token) {
      console.log("Middleware: Redirigiendo a login");
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