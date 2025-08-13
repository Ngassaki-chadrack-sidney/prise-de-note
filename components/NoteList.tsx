import { ScrollArea } from "@/components/ui/scroll-area";
import { Note } from "@/lib/types";

interface NoteListProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (note: Note) => void;
}

export function NoteList({
  notes,
  selectedNoteId,
  onNoteSelect,
}: NoteListProps) {
  return (
    <ScrollArea className="w-full p-1">
      <div className="space-y-2 p-2">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-3 rounded-lg cursor-pointer hover:bg-accent ${
              selectedNoteId === note.id ? "bg-accent" : ""
            }`}
            onClick={() => onNoteSelect(note)}
          >
            <h3 className="font-medium truncate">
              {note.title || "Sans titre"}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-center text-muted-foreground p-4">
            Aucune note disponible
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
