"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  Moon,
  Sun,
  Search,
  Plus,
  FileText,
  User,
  LogOut,
  Trash2,
  Sparkles,
  BookOpen,
  Edit3,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, scale, easeOut } from "framer-motion";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import NotesEditor, { NoteData } from "@/components/NoteEditor";
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

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [darkMode, setDarkmode] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour créer une note
  async function CreateNote(title: string, content?: string) {
    if (!title.trim()) {
      toast.error("Le titre ne peut pas être vide");
      return;
    }

    try {
      console.log("Création de la note:", { title, content });

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important pour les cookies
        body: JSON.stringify({ title: title.trim(), content: content || "" }),
      });

      const responseData = await response.json();
      console.log("Réponse API:", response.status, responseData);

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expirée, veuillez vous reconnecter");
          logout();
          return;
        }
        toast.error(responseData.error || "Erreur lors de la création");
        return;
      }

      toast.success("Note créée avec succès");
      setNewNote("");
      await GetAllNote(); // Recharger les notes

      // Sélectionner la nouvelle note et passer en mode édition
      if (responseData.id) {
        setSelectedNote(responseData.id);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Erreur CreateNote:", error);
      toast.error("Erreur lors de la création de la note");
    }
  }

  // Fonction pour récupérer toutes les notes
  async function GetAllNote() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/notes", {
        method: "GET",
        credentials: "include", // Important pour les cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expirée, veuillez vous reconnecter");
          logout();
          return;
        }
        toast.error("Erreur lors de la récupération des notes");
        return;
      }

      const data = await response.json();
      console.log("Notes récupérées:", data); // Pour le débogage
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur GetAllNote:", error);
      toast.error("Erreur lors de la récupération des notes");
    } finally {
      setIsLoading(false);
    }
  }

  // Fonction pour supprimer un note
  async function DeleteNote(id: string) {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include", // Important pour les cookies
      });
      if (!response.ok) {
        toast.error("Erreur lors de la suppression");
        return;
      }
      toast.success("Note supprimée avec succès");
      setSelectedNote(null); // Désélectionner la note
      setIsEditing(false); // Sortir du mode édition
      await GetAllNote(); // Recharger les notes
    } catch (error) {
      console.error("Erreur DeleteNote:", error);
      toast.error("Erreur lors de la suppression");
    }
  }

  // Fonction pour sauvegarder une note avec le contenu Editor.js
  const handleSaveNote = async (noteData: NoteData) => {
    try {
      const url = noteData.id ? `/api/notes/${noteData.id}` : "/api/notes";
      const method = noteData.id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: noteData.title,
          content: JSON.stringify(noteData.content), // Convertir le contenu Editor.js en JSON
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expirée, veuillez vous reconnecter");
          logout();
          return;
        }
        const errorData = await response.json();
        toast.error(errorData.error || "Erreur lors de la sauvegarde");
        return;
      }

      const savedNote = await response.json();
      toast.success("Note sauvegardée avec succès");

      // Recharger les notes pour avoir les dernières données
      await GetAllNote();

      // Si c'est une nouvelle note, la sélectionner
      if (!noteData.id && savedNote.id) {
        setSelectedNote(savedNote.id);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde de la note");
    }
  };

  // Fonction pour supprimer une note depuis l'éditeur
  const handleDeleteNoteFromEditor = async (noteId: string) => {
    await DeleteNote(noteId);
  };

  // Fonction pour supprimer un user
  const handleUserDelete = async (email: string) => {
    try {
      const response = fetch("/api/auth/del-account", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(email),
      });
    } catch (error) {}
  };
  // Fonction pour obtenir les données d'une note sélectionnée
  const getSelectedNoteData = (): NoteData | undefined => {
    const note = filteredNotes.find((n) => n.id === selectedNote);
    if (!note) return undefined;

    let parsedContent;
    try {
      // Essayer de parser le contenu JSON s'il existe
      parsedContent = note.content
        ? JSON.parse(note.content)
        : {
            time: Date.now(),
            blocks: [],
            version: "2.28.2",
          };
    } catch (error) {
      // Si le parsing échoue, créer une structure par défaut avec le contenu en tant que paragraphe
      parsedContent = {
        time: Date.now(),
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
      className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SidebarProvider className="w-1/4">
        <motion.div variants={itemVariants}>
          <Sidebar className="border-r-2 border-blue-200 shadow-lg">
            <SidebarHeader className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <motion.div
                className="flex items-center gap-2 mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BookOpen className="w-8 h-8" />
                <div className="text-2xl font-bold tracking-wide">NotesApp</div>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              <motion.div className="relative" variants={itemVariants}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <Input
                  placeholder="Rechercher une note..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 transition-all duration-200 rounded-lg"
                />
              </motion.div>
            </SidebarHeader>

            <SidebarContent className="p-4">
              <div className="flex gap-2 mb-5">
                <Input
                  placeholder="Titre de la note"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newNote.trim()) {
                      CreateNote(newNote);
                    }
                  }}
                  className="border-blue-200 focus-visible:ring-blue-400 rounded-lg"
                />
                <Button
                  variant={"outline"}
                  onClick={() => CreateNote(newNote)}
                  disabled={!newNote}
                  className="border-blue-300 hover:bg-blue-50 rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <motion.h2
                className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"
                variants={itemVariants}
              >
                <FileText className="w-5 h-5" />
                {isLoading
                  ? "Chargement..."
                  : `Mes notes (${filteredNotes.length})`}
              </motion.h2>

              <ScrollArea className="h-[calc(100vh-300px)] pr-2 hidden_scrollBard">
                <AnimatePresence>
                  {filteredNotes.length > 0 ? (
                    filteredNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        variants={noteVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mb-3"
                        whileTap={{ scale: 0.9 }}
                        transition={{ ease: "easeOut", delay: 0.1 }}
                      >
                        <motion.div
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
                            selectedNote === note.id
                              ? "bg-blue-100 border-2 border-blue-400 shadow-md"
                              : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg"
                          }`}
                          onClick={() => setSelectedNote(note.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {note.title}
                            </h3>
                            <Button
                              variant={"outline"}
                              size={"icon"}
                              className="hover:bg-red-400"
                              onClick={() => DeleteNote(note.id)}
                            >
                              {" "}
                              <Trash2 className="hover:text-white" />{" "}
                            </Button>
                          </div>
                          <div className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                            {note.updatedAt
                              ? new Date(note.updatedAt).toLocaleDateString()
                              : "Date inconnue"}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="text-center py-10"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-500">
                            Chargement des notes...
                          </p>
                        </>
                      ) : (
                        <>
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">
                            {search
                              ? "Aucune note trouvée"
                              : "Aucune note disponible"}
                          </p>
                          <Button
                            onClick={() => setNewNote("Nouvelle note")}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                          >
                            Créer une note
                          </Button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </SidebarContent>

            <SidebarFooter className="p-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0 hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 rounded-lg shadow-md"
                    >
                      <User className="w-4 h-4" />
                      {user?.name}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <motion.button
                      onClick={logout}
                      className="w-full flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </motion.button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <motion.button
                          className="w-full flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          whileHover={{ scale: 1.02 }}
                          // whileTap={{ scale: 0.98 }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer le compte
                        </motion.button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Supprimer le compte
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer votre compte ?
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300">
                            Annuler
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={() => handleUserDelete(user?.email || "")}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarFooter>
          </Sidebar>
        </motion.div>
      </SidebarProvider>

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
                  className="absolute -top-16 left-0 z-10 flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la lecture
                </motion.button>
                <NotesEditor
                  initialData={getSelectedNoteData()}
                  onSave={handleSaveNote}
                  onDelete={handleDeleteNoteFromEditor}
                  readOnly={false}
                  placeholder="Commencez à écrire votre note..."
                />
              </div>
            ) : (
              <Card className="w-full bg-white/90 backdrop-blur-sm rounded-xl border border-blue-100 shadow-xl">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {filteredNotes.find((n) => n.id === selectedNote)?.title}
                    </h1>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Edit3 className="w-4 h-4" />
                        Modifier
                      </motion.button>
                      <motion.button
                        onClick={() => DeleteNote(selectedNote)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </motion.button>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-100 shadow-inner">
                    <NotesEditor
                      initialData={getSelectedNoteData()}
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
              <BookOpen className="w-24 h-24 text-blue-300 mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Bienvenue dans votre espace de notes
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-md">
              Sélectionnez une note existante ou créez-en une nouvelle pour
              commencer à écrire.
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
