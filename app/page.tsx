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
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [darkMode, setDarkmode] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const NoteRef = useRef<HTMLInputElement>(null);

  // Fonction pour créer une note
  async function CreateNote(title: string, content?: string) {
    if (!title.trim()) {
      toast.error("Le titre ne peut pas être vide");
      return;
    }

    try {
      console.log("Création de la note:", { title, content }); // Pour le débogage

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important pour les cookies
        body: JSON.stringify({ title: title.trim(), content: content || "" }),
      });

      const responseData = await response.json();
      console.log("Réponse API:", response.status, responseData); // Pour le débogage

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
      await GetAllNote(); // Recharger les notes
    } catch (error) {
      console.error("Erreur DeleteNote:", error);
      toast.error("Erreur lors de la suppression");
    }
  }

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

              <ScrollArea className="h-[calc(100vh-300px)] pr-2">
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
                          <p className="text-sm text-gray-600 truncate mt-2">
                            {note.content || "Aucun contenu"}
                          </p>
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
                    <motion.button
                      className="w-full flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer le compte
                    </motion.button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <motion.button
                      onClick={() => setDarkmode(!darkMode)}
                      className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {darkMode ? (
                        <>
                          <Sun className="w-4 h-4" /> Mode clair
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4" /> Mode sombre
                        </>
                      )}
                    </motion.button>
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
          >
            <Card className="h-full w-[800px] flex flex-col p-8 shadow-xl bg-white/90 backdrop-blur-sm rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {filteredNotes.find((n) => n.id === selectedNote)?.title}
                </h1>
                <div className="flex gap-2">
                  <motion.button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Modifier
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Supprimer
                  </motion.button>
                </div>
              </div>
              <div className="prose max-w-none mt-6 bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-inner">
                <p className="text-gray-700 leading-relaxed">
                  {filteredNotes.find((n) => n.id === selectedNote)?.content ||
                    "Aucun contenu disponible pour cette note."}
                </p>
              </div>
            </Card>
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
