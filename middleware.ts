import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const isAuthRoute = req.nextUrl.pathname.startsWith("/login");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api/");

  // Laisser passer les routes API pour éviter les redirections HTML
  if (isApiRoute) {
    return NextResponse.next();
  }

  // Si pas de token et pas sur /login => redirection vers /login
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si token présent
  if (token) {
    const payload = await verifyToken(token);
    if (!payload) {
      // Token invalide -> supprimer les cookies et redirection vers login
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      res.cookies.delete("refreshToken");
      return res;
    }

    // Si l'utilisateur est sur /login alors qu'il est déjà connecté -> rediriger vers /
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"], // Routes protégées (exclut /api)
};
