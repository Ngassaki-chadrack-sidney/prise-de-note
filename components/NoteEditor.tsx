"use client";

import React, { useEffect, useRef, useState } from "react";
import { NoteData } from "../lib/utils";
import { FileDown, Save, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

// Props du composant
interface NotesEditorProps {
  initialData?: NoteData;
  onSave?: (noteData: NoteData) => Promise<void>;
  onDelete?: (noteId: string) => Promise<void>;
  readOnly?: boolean;
  placeholder?: string;
}

const NotesEditor: React.FC<NotesEditorProps> = ({
  initialData,
  onSave,
  onDelete,
  readOnly = false,
  placeholder = "Commencez à écrire votre note...",
}) => {
  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  // Initialisation d'Editor.js
  useEffect(() => {
    const initEditor = async () => {
      if (typeof window !== "undefined") {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;

        if (editorRef.current) {
          editorRef.current.destroy();
        }

        editorRef.current = new EditorJS({
          holder: "editorjs",
          readOnly: readOnly,
          placeholder: placeholder,
          data: initialData?.content || {
            time: 1640995200000, // Timestamp fixe pour éviter les problèmes d'hydratation
            blocks: [],
            version: "2.28.2",
          },
          tools: {
            header: {
              class: Header,
              config: {
                placeholder: "Titre de section...",
                levels: [2, 3, 4],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: "Citation...",
                captionPlaceholder: "Auteur...",
              },
            },
            delimiter: Delimiter,
            inlineCode: {
              class: InlineCode,
              shortcut: "CMD+SHIFT+M",
            },
          },
          onChange: () => {
            // Auto-save pourrait être ajouté ici
          },
          onReady: () => {
            setEditorReady(true);
          },
        });
      }
    };

    initEditor();

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
    };
  }, [initialData, readOnly, placeholder]);

  // Fonction pour sauvegarder la note
  const handleSave = async () => {
    if (!editorRef.current || !onSave) return;

    try {
      setIsSaving(true);
      const outputData = await editorRef.current.save();

      const noteData: NoteData = {
        ...initialData,
        title: title || "Note sans titre",
        content: outputData,
        updatedAt: new Date(),
      };

      await onSave(noteData);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde de la note");
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour supprimer la note
  const handleDelete = async () => {
    if (!initialData?.id || !onDelete) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette note ?")) {
      try {
        setIsDeleting(true);
        await onDelete(initialData.id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de la note");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Fonction pour exporter en JSON
  const handleExport = async () => {
    if (!editorRef.current) return;

    try {
      const outputData = await editorRef.current.save();
      const noteData = {
        title,
        content: outputData,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(noteData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "note"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background">
      {/* En-tête avec titre et actions */}
      <div className="mb-6 border-b pb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la note..."
          disabled={readOnly}
          className="w-full text-2xl font-bold border-none outline-none bg-transparent placeholder-gray-400 disabled:text-white-600"
        />

        {/* Barre d'actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            {!readOnly && onSave && (
              <Button
                onClick={handleSave}
                disabled={isSaving || !editorReady}
                variant={"default"}
                className="flex items-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            )}

            <Button
              onClick={handleExport}
              disabled={!editorReady}
              variant={"default"}
              className="flex items-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Exporter
            </Button>

            {!readOnly && onDelete && initialData?.id && (
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                variant={"destructive"}
                className="flex items-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                    Suppression...
                  </>
                ) : (
                  <div className="flex gap-2 justify-center items-center text-foreground">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </div>
                )}
              </Button>
            )}
          </div>

          {/* Indicateur de dernière sauvegarde */}
          {lastSaved && (
            <div className="text-sm text-white-500">
              Sauvegardé à {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Zone d'édition */}
      <div className="prose max-w-none">
        <div
          id="editorjs"
          className="min-h-[540px] focus:outline-none"
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        />
      </div>

      {/* Indicateur de statut en bas */}
      <div className="mt-6 pt-4 border-t text-sm text-white-500 flex justify-between">
        <div>{readOnly ? "Mode lecture seule" : "Mode édition"}</div>
        <div>
          {initialData?.createdAt && (
            <span>
              Créé le {new Date(initialData.createdAt).toLocaleDateString()}
            </span>
          )}
          {initialData?.updatedAt && (
            <span className="ml-4">
              Modifié le {new Date(initialData.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesEditor;
