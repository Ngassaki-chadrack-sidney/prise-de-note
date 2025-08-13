import { z } from 'zod';

// Schéma pour User
export const UserSchema = z.object({
  id: z.string().cuid().optional(),
  email: z.string().email('Email invalide'),
  name: z.string().min(1, 'Le nom est requis').optional().nullable(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  avatar: z.string().url('URL invalide pour l\'avatar').optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schéma pour la création d'un utilisateur (sans id, createdAt, updatedAt)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schéma pour la mise à jour d'un utilisateur (tous les champs optionnels sauf password qui peut être omis)
export const UpdateUserSchema = UserSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schéma pour l'authentification (login)
export const LoginUserSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

// Schéma pour l'inscription avec confirmation de mot de passe
export const SignUpUserSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Schéma pour Note
export const NoteSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  content: z.any(), // JSON content from Editor.js - peut être plus spécifique selon vos besoins
  userId: z.string().cuid('ID utilisateur invalide'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schéma pour la création d'une note
export const CreateNoteSchema = NoteSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schéma pour la mise à jour d'une note
export const UpdateNoteSchema = NoteSchema.partial().omit({
  id: true,
  userId: true, // On ne permet généralement pas de changer le propriétaire
  createdAt: true,
  updatedAt: true,
});

// Types TypeScript dérivés des schémas
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type SignUpUser = z.infer<typeof SignUpUserSchema>;

export type Note = z.infer<typeof NoteSchema>;
export type CreateNote = z.infer<typeof CreateNoteSchema>;
export type UpdateNote = z.infer<typeof UpdateNoteSchema>;

// Schéma plus spécifique pour le contenu Editor.js (optionnel)
export const EditorJSContentSchema = z.object({
  time: z.number().optional(),
  blocks: z.array(z.object({
    id: z.string().optional(),
    type: z.string(),
    data: z.any(),
  })),
  version: z.string().optional(),
});

// Schéma Note avec validation spécifique du contenu Editor.js
export const NoteWithEditorJSSchema = NoteSchema.extend({
  content: EditorJSContentSchema,
});

export type NoteWithEditorJS = z.infer<typeof NoteWithEditorJSSchema>;