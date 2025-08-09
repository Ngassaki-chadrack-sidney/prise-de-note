import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePassword } from "@/lib/password";
import { signToken, signRefreshToken } from "@/lib/jwt";
import { toast } from "sonner";
import { success } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "Mot de passe trop faible",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 409 }
      );
    }

    // Créer l'utilisateur
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Générer les tokens
    const token = await signToken({ userId: user.id, email: user.email });
    const refreshToken = await signRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Créer la réponse avec cookies
    const response = NextResponse.json(
      {
        message: "Utilisateur créé avec succès",
        user,
      },
      { status: 201 }
    );

    // Définir les cookies sécurisés
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 jours
    });

    return response;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
