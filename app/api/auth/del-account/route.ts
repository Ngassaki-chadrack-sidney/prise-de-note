import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

  try {
    const token = resquest.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }
    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: "Token invalide" },
        { status: 401 }
      );
    }
    const email = payload.email;
    if (!email) {
      return NextResponse.json(
        { error: "Adresse mail invalide !" },
        { status: 400 }
      );
    }
    // Recherche de l'email dans la base de donnees
    const isExist = await prisma.user.findUnique({
      where: { email },
    });
    if (!isExist) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé dans la base de données" },
        { status: 404 }
      );
    }
    // Suppression du user dans la base de donnees
    await prisma.user.delete({
      where: { email },
    });
    return NextResponse.json(
      { message: "Utilisateur supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur s'est produite" },
      { status: 500 }
    );
  }
}
