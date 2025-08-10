import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }
    const userId = payload.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { title, content } = body;

    // Validation des données
    if (!title || !content) {
        return NextResponse.json(
            { error: "Titre et contenu requis" },
            { status: 400 }
        );
    }

    // Création de la note
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    let payload;
    try {
        payload = await verifyToken(token);
    } catch {
        return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }
    const userId = payload.userId;
    if (!userId) {
        return NextResponse.json(
            { error: "Utilisateur non trouvé" },
            { status: 404 }
        );
    }
    const note = await prisma.note.create({
        data: {
            title,
            content,
            userId,
        },
    });
    return NextResponse.json({ note }, { status: 201 });
}