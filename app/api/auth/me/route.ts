import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 });
    }

    // Vérifier le token
    const payload = await verifyToken(token);

    // Récupérer les données utilisateur
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return NextResponse.json({ error: "Token invalide" }, { status: 401 });
  }
}
