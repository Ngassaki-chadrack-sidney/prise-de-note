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
    try {
      const notes = await prisma.note.findMany({
        where: { userId },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      });
      return NextResponse.json(notes);
    } catch (dbError) {
      console.error("Erreur base de données:", dbError);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des notes" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des notes:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    // Validation des données
    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Titre est requis" }, { status: 400 });
    }

    // Vérification de l'authentification
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

    // Création de la note
    try {
      let jsonContent;
      try {
        jsonContent = content ? JSON.parse(content) : {};
      } catch {
        return NextResponse.json(
          { error: "Format de contenu invalide" },
          { status: 400 }
        );
      }

      const note = await prisma.note.create({
        data: {
          title: title.trim(),
          content: jsonContent,
          userId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      });

      return NextResponse.json(note, { status: 201 });
    } catch (error) {
      console.error("Erreur lors de la création de la note:", error);
      return NextResponse.json(
        { error: "Erreur interne du serveur" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
