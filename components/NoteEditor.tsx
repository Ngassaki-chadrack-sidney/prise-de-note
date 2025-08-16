"use client";

import React, { useEffect, useRef, useState } from "react";
import { OutputData } from "@editorjs/editorjs";

// Types pour les données de la note
export interface NoteData {
  id?: string;
  title: string;
  content: OutputData;
  createdAt?: Date;
  updatedAt?: Date;
}

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
        const SimpleImage = (await import("@editorjs/simple-image")).default;

        if (editorRef.current) {
          editorRef.current.destroy();
        }

        editorRef.current = new EditorJS({
          holder: "editorjs",
          readOnly: readOnly,
          placeholder: placeholder,
          data: initialData?.content || {
            time: Date.now(),
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
            image: {
              class: SimpleImage,
              inlineToolbar: true,
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* En-tête avec titre et actions */}
      <div className="mb-6 border-b pb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la note..."
          disabled={readOnly}
          className="w-full text-2xl font-bold border-none outline-none bg-transparent placeholder-gray-400 disabled:text-gray-600"
        />

        {/* Barre d'actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            {!readOnly && onSave && (
              <button
                onClick={handleSave}
                disabled={isSaving || !editorReady}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Sauvegarder
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleExport}
              disabled={!editorReady}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exporter
            </button>

            {!readOnly && onDelete && initialData?.id && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Suppression...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Supprimer
                  </>
                )}
              </button>
            )}
          </div>

          {/* Indicateur de dernière sauvegarde */}
          {lastSaved && (
            <div className="text-sm text-gray-500">
              Sauvegardé à {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Zone d'édition */}
      <div className="prose max-w-none">
        <div
          id="editorjs"
          className="min-h-[400px] focus:outline-none"
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        />
      </div>

      {/* Indicateur de statut en bas */}
      <div className="mt-6 pt-4 border-t text-sm text-gray-500 flex justify-between">
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
