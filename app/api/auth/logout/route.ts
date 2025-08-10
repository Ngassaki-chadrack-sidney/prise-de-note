import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Déconnexion réussie" },
    { status: 200 }
  );

  // Supprimer les cookies
  response.cookies.delete("token", { path: "/" });
  response.cookies.delete("refreshToken", { path: "/" });

  return response;
}
