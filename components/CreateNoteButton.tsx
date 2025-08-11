import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface CreateNoteButtonProps {
  onClick: () => void;
  className?: string;
}

export function CreateNoteButton({
  onClick,
  className = "",
}: CreateNoteButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
      variant="outline"
    >
      <PlusIcon className="w-4 h-4" />
      Nouvelle note
    </Button>
  );
}
