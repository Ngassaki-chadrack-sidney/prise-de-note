import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Routes qui nécessitent une authentification
const protectedRoutes: string[] = ["/"];

// Routes publiques (même si connecté)
const publicRoutes = ["/login", "/sign-in"];

// Routes d'authentification (redirection si déjà connecté)
const authRoutes = ["/login", "/sign-in"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Vérifier si l'utilisateur est authentifié
  let isAuthenticated = false;
  if (token) {
    try {
      await verifyToken(token);
      isAuthenticated = true;
    } catch (error) {
      // Token invalide, supprimer le cookie et retourner la réponse
      const response = NextResponse.next();
      response.cookies.delete("token");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // Redirection si tentative d'accès à une route protégée sans authentification
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !isAuthenticated
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirection si tentative d'accès aux pages d'auth en étant déjà connecté
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Matcher pour toutes les routes sauf :
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
