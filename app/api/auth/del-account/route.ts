import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  // Vérifier l'authentification
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let userPayload;
  try {
    userPayload = await verifyToken(token);
  } catch (error) {
    return NextResponse.json(
      { error: "Token invalide" },
      { status: 401 }
    );
  }

  // Supprimer le compte de l'utilisateur authentifié
  try {
    await prisma.user.delete({
      where: {
        email: userPayload.email,
      },
    });

    // Créer la réponse avec suppression du cookie
    const response = NextResponse.json(
      { message: "Compte supprimé avec succès" },
      { status: 200 }
    );

    // Supprimer le cookie d'authentification
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire immédiatement
    });

    return response;
  } catch (error: any) {
    // Gestion spécifique des erreurs Prisma
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    console.error("Erreur lors de la suppression du compte:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
