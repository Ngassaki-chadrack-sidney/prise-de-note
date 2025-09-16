import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Type definition for Editor.js output data
interface OutputData {
  time: number;
  blocks: Array<{
    id: string;
    type: string;
    data: any;
  }>;
  version: string;
}

export interface NoteData {
  id?: string;
  title: string;
  content: OutputData;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fonction utilitaire pour obtenir les données d'une note sélectionnée
export function getSelectedNoteData(notes: Note[], selectedNoteId: string | null): NoteData | undefined {
  if (!selectedNoteId) return undefined;
  
  const note = notes.find((n) => n.id === selectedNoteId);
  if (!note) return undefined;

  let parsedContent;
  try {
    parsedContent = note.content
      ? JSON.parse(note.content)
      : {
          time: 1640995200000, // Timestamp fixe pour éviter les problèmes d'hydratation
          blocks: [],
          version: "2.28.2",
        };
  } catch (error) {
    parsedContent = {
      time: 1640995200000, // Timestamp fixe pour éviter les problèmes d'hydratation
      blocks: note.content
        ? [
            {
              id: "paragraph",
              type: "paragraph",
              data: {
                text: note.content,
              },
            },
          ]
        : [],
      version: "2.28.2",
    };
  }

  return {
    id: note.id,
    title: note.title,
    content: parsedContent,
    createdAt: note.createdAt ? new Date(note.createdAt) : undefined,
    updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
  };
}
