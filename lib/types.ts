import { email, z } from "zod";

export interface Note {
  id: string;
  title: string;
  content: {
    time: number;
    blocks: Array<{
      id: string;
      type: string;
      data: any;
    }>;
    version: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  content: {
    time?: number;
    blocks?: Array<{
      id: string;
      type: string;
      data: any;
    }>;
    version?: string;
  };
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

const userFormSchema = z.object({
  name: z.string("Vous devez entrer un mon."),
  email: z.string().email("Vous devez entrer une adresse valide."),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 carateres."),
});
