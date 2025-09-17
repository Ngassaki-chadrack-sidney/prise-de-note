"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarFooter } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Moon,
  Sun,
  Search,
  Plus,
  FileText,
  User,
  LogOut,
  Trash2,
  BookOpen,
  Edit3,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import NotesEditor from "@/components/NoteEditor";
import { NoteData, getSelectedNoteData, type Note } from "@/lib/utils";
import {
  createNote,
  getAllNotes,
  deleteNote,
  saveNote,
  deleteUser,
} from "@/lib/notes-actions";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTheme } from "next-themes";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);
  // Fonction pour créer une note
  async function CreateNote(title: string, content?: string) {
    const result = await createNote(title, content);

    if (!result.success) {
      if (result.data?.status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter");
        logout();
        return;
      }
      toast.error(result.error || "Erreur lors de la création");
      return;
    }

    toast.success("Note créée avec succès");
    setNewNote("");
    await GetAllNote(); // Recharger les notes

    // Sélectionner la nouvelle note et passer en mode édition
    if (result.data?.id) {
      setSelectedNote(result.data.id);
      setIsEditing(true);
    }
  }

  // Fonction pour récupérer toutes les notes
  async function GetAllNote() {
    try {
      setIsLoading(true);
      const result = await getAllNotes();

      if (!result.success) {
        if (result.error?.includes("Session expirée")) {
          toast.error("Session expirée, veuillez vous reconnecter");
          logout();
          return;
        }
        toast.error(result.error || "Erreur lors de la récupération des notes");
        return;
      }

      setNotes(result.data || []);
    } catch (error) {
      console.error("Erreur GetAllNote:", error);
      toast.error("Erreur lors de la récupération des notes");
    } finally {
      setIsLoading(false);
    }
  }

  // Fonction pour supprimer une note
  async function DeleteNote(id: string) {
    const result = await deleteNote(id);

    if (!result.success) {
      toast.error(result.error || "Erreur lors de la suppression");
      return;
    }

    toast.success("Note supprimée avec succès");
    setSelectedNote(null); // Désélectionner la note
    setIsEditing(false); // Sortir du mode édition
    await GetAllNote(); // Recharger les notes
  }

  // Fonction pour sauvegarder une note avec le contenu Editor.js
  const handleSaveNote = async (noteData: NoteData) => {
    const result = await saveNote(noteData);

    if (!result.success) {
      if (result.data?.status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter");
        logout();
        return;
      }
      toast.error(result.error || "Erreur lors de la sauvegarde");
      return;
    }

    toast.success("Note sauvegardée avec succès");

    // Recharger les notes pour avoir les dernières données
    await GetAllNote();

    // Si c'est une nouvelle note, la sélectionner
    if (!noteData.id && result.data?.id) {
      setSelectedNote(result.data.id);
    }
  };

  // Fonction pour changer le thème
  const handleChangeTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const formatDate = (input?: string | Date): string => {
    if (!input) return "Date inconnue";
    try {
      const date = typeof input === "string" ? new Date(input) : input;
      return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }).format(date);
    } catch {
      return "Date inconnue";
    }
  };

  // Fonction pour supprimer une note depuis l'éditeur
  const handleDeleteNoteFromEditor = async (noteId: string) => {
    await DeleteNote(noteId);
  };

  // Fonction pour supprimer un utilisateur
  const handleUserDelete = async (email: string) => {
    const result = await deleteUser(email);

    if (!result.success) {
      toast.error(result.error || "Erreur lors de la suppression du compte");
      return;
    }

    toast.success("Compte supprimé avec succès");
    logout();
  };
  // Fonction pour obtenir les données d'une note sélectionnée
  const getCurrentNoteData = (): NoteData | undefined => {
    return getSelectedNoteData(filteredNotes, selectedNote);
  };

  useEffect(() => {
    GetAllNote();
  }, []);

  // Filtrer les vraies notes
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      (note.content || "").toLowerCase().includes(search.toLowerCase())
  );

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const noteVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="flex min-h-screen w-full bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="w-120 min-h-screen">
        <div>
          <div className="border-r">
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-8 border-b border-gray-200 pb-4">
                  <Image src="/favicon.ico" alt="Logo" width={80} height={80} />
                  {/* <BookOpen className="w-6 h-6" /> */}
                  <h1 className="text-xl font-semibold tracking-wide">
                    Never forget what you write
                  </h1>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher une note..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="p-4 border-b" />

              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Titre de la note"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newNote.trim()) {
                        CreateNote(newNote);
                      }
                    }}
                    className=""
                  />
                  <Button
                    variant={"default"}
                    onClick={() => CreateNote(newNote)}
                    disabled={!newNote}
                    aria-label="Créer une nouvelle note"
                  >
                    Ajouter la note
                  </Button>
                </div>

                <h2 className="text-base font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {isLoading
                    ? "Chargement..."
                    : `Mes notes (${filteredNotes.length})`}
                </h2>

                <div className="h-[calc(100vh-300px)] pr-2 overflow-y-auto">
                  {filteredNotes.length > 0 ? (
                    <div>
                      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
                        {filteredNotes.map((note) => (
                          <div
                            key={note.id}
                            className={`p-3 rounded-md cursor-pointer transition-colors ${
                              selectedNote === note.id
                                ? "bg-muted"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => setSelectedNote(note.id)}
                          >
                            <div className="flex justify-between items-baseline">
                              <h3 className="font-medium truncate">
                                {note.title}
                              </h3>
                              <Button
                                variant={"ghost"}
                                size={"icon"}
                                className=""
                                onClick={(e) => {
                                  e.stopPropagation();
                                  DeleteNote(note.id);
                                }}
                                aria-label={`Supprimer la note ${note.title}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                              {formatDate(note.updatedAt as unknown as string)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      {isLoading ? (
                        <>
                          <div className="w-8 h-8 border-4 border-primary rounded-full border-t-transparent animate-spin mx-auto mb-3"></div>
                          <p className="text-primary">
                            Chargement des notes...
                          </p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            {search
                              ? "Aucune note trouvée"
                              : "Aucune note disponible"}
                          </p>
                          <Button
                            onClick={() => setNewNote("Nouvelle note")}
                            className="mt-3"
                          >
                            Créer une note
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 mb-8">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      {user?.name}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onSelect={() => logout()}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      handleChangeTheme();
                    }}
                    className="flex items-center gap-2"
                  >
                    {mounted && theme === "dark" ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <span>
                      {mounted && theme === "dark"
                        ? "Mode clair"
                        : "Mode sombre"}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      setDeleteOpen(true);
                    }}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer le compte</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le compte</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer votre compte ? Cette
                      action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleUserDelete(user?.email || "")}
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Zone principale */}
      <motion.div
        className="min-h-screen w-full flex justify-center items-center"
        variants={itemVariants}
      >
        {selectedNote ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl px-4"
          >
            {isEditing ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsEditing(false)}
                  className="absolute -top-16 left-0 z-10 flex items-center gap-2 px-4 py-2 bg-gray-600 text-foreground rounded-lg hover:bg-gray-700 transition-colors shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la lecture
                </motion.button>
                <NotesEditor
                  initialData={getCurrentNoteData()}
                  onSave={handleSaveNote}
                  onDelete={handleDeleteNoteFromEditor}
                  readOnly={false}
                  placeholder="Commencez à écrire votre note..."
                />
              </div>
            ) : (
              <Card className="w-full">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">
                      {filteredNotes.find((n) => n.id === selectedNote)?.title}
                    </h1>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit3 className="w-4 h-4" />
                        Modifier
                      </motion.button>
                      <motion.button
                        onClick={() => DeleteNote(selectedNote as string)}
                        className="flex items-center gap-2 px-3 py-2 bg-destructive text-destructive-foreground rounded-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </motion.button>
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <NotesEditor
                      initialData={getCurrentNoteData()}
                      onSave={handleSaveNote}
                      onDelete={handleDeleteNoteFromEditor}
                      readOnly={true}
                      placeholder="Cette note est vide..."
                    />
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="h-full flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <BookOpen className="w-24 h-24 text-primary mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Bienvenue dans votre espace de notes
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Sélectionnez une note existante ou créez-en une nouvelle pour
              commencer à écrire.
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
