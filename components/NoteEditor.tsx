import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon, Loader2 } from "lucide-react";

interface Note {
  id?: string;
  title: string;
  content: any;
}

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Note) => Promise<void>;
}

export function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [editor, setEditor] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let EditorJS;
    if (typeof window !== "undefined") {
      // Import EditorJS uniquement côté client
      EditorJS = require("@editorjs/editorjs").default;

      if (!editor) {
        const editorInstance = new EditorJS({
          holder: "editorjs",
          placeholder: "Commencez à écrire votre note...",
          data: note?.content,
          tools: {
            header: require("@editorjs/header"),
            list: require("@editorjs/list"),
            image: require("@editorjs/image"),
          },
        });
        setEditor(editorInstance);
      }
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  const handleSave = async () => {
    if (!editor) return;

    setIsSaving(true);
    try {
      const content = await editor.save();
      await onSave({
        id: note?.id,
        title,
        content,
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-4 h-full flex flex-col gap-4">
      <Input
        placeholder="Titre de la note..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-xl font-bold"
      />
      <div id="editorjs" className="prose max-w-none flex-1" />
      <Button onClick={handleSave} disabled={isSaving} className="self-end">
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <SaveIcon className="h-4 w-4 mr-2" />
        )}
        Sauvegarder
      </Button>
    </Card>
  );
}
