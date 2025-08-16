import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { email } = body;

  // Verifier le users conmcete
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await verifyToken(token);

    if (!response)
      return NextResponse.json(
        { error: "Une erreur est survenue lors de la vérification du token" },
        { status: 401 }
      );
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }

  // Verifiier que le user existe dans la base de donnees
  try {
    const response = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!response)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }

  try {
    const response = await prisma.user.delete({
      where: {
        email: email,
      },
    });

    if (!response)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
