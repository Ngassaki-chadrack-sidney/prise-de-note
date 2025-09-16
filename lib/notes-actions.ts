"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { toast } from "sonner";
import { NoteData, Note } from "./utils";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

function getAuthHeaders(): HeadersInit {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  const headers: HeadersInit = {
    Accept: "application/json",
  };
  if (cookieHeader) {
    headers["Cookie"] = cookieHeader;
  }
  return headers;
}

async function parseJsonSafe(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `Réponse non JSON (${response.status})${
        text?.startsWith("<!DOCTYPE") ? " - probable redirection HTML" : ""
      }`
    );
  }
  return response.json();
}

// Fonction pour créer une note
export async function createNote(
  title: string,
  content?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!title.trim()) {
    return { success: false, error: "Le titre ne peut pas être vide" };
  }

  try {
    console.log("Création de la note:", { title, content });

    const response = await fetch(`${getBaseUrl()}/api/notes`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        title: title.trim(),
        content: content
          ? JSON.stringify({
              blocks: [{ type: "paragraph", data: { text: content } }],
            })
          : JSON.stringify({ blocks: [] }),
      }),
    });

    const responseData = await parseJsonSafe(response);
    console.log("Réponse API:", response.status, responseData);

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || "Erreur lors de la création",
        data: { status: response.status },
      };
    }

    revalidatePath("/");
    return { success: true, data: responseData };
  } catch (error) {
    console.error("Erreur CreateNote:", error);
    return { success: false, error: "Erreur lors de la création de la note" };
  }
}

// Fonction pour récupérer toutes les notes
export async function getAllNotes(): Promise<{
  success: boolean;
  data?: Note[];
  error?: string;
}> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/notes`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        error:
          response.status === 401
            ? "Session expirée, veuillez vous reconnecter"
            : "Erreur lors de la récupération des notes",
        data: undefined,
      };
    }

    const data = await parseJsonSafe(response);
    console.log("Notes récupérées:", data);

    revalidatePath("/");
    return { success: true, data: Array.isArray(data) ? data : [] };
  } catch (error) {
    console.error("Erreur GetAllNote:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des notes",
    };
  }
}

// Fonction pour supprimer une note
export async function deleteNote(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/notes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, error: "Erreur lors de la suppression" };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erreur DeleteNote:", error);
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

// Fonction pour sauvegarder une note avec le contenu Editor.js
export async function saveNote(
  noteData: NoteData
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const url = noteData.id
      ? `${getBaseUrl()}/api/notes/${noteData.id}`
      : `${getBaseUrl()}/api/notes`;
    const method = noteData.id ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        title: noteData.title,
        content: JSON.stringify(noteData.content),
      }),
    });

    if (!response.ok) {
      const errorData = await parseJsonSafe(response).catch(() => ({
        error: "Erreur",
      }));
      return {
        success: false,
        error: errorData.error || "Erreur lors de la sauvegarde",
        data: { status: response.status },
      };
    }

    const savedNote = await parseJsonSafe(response);
    revalidatePath("/");
    return { success: true, data: savedNote };
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    return { success: false, error: "Erreur lors de la sauvegarde de la note" };
  }
}

// Fonction pour supprimer un utilisateur
export async function deleteUser(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/auth/del-account`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Erreur lors de la suppression du compte",
      };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return { success: false, error: "Erreur lors de la suppression du compte" };
  }
}
