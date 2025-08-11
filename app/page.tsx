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
  BookOpen
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [darkMode, setDarkmode] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const { user, logout } = useAuth();

  // Données d'exemple pour les notes
  const sampleNotes = [
    { id: '1', title: 'Idées pour le projet', content: 'Développer une application de prise de notes...', updatedAt: new Date() },
    { id: '2', title: 'Liste de courses', content: 'Lait, pain, pommes, café...', updatedAt: new Date() },
    { id: '3', title: 'Réunion équipe', content: 'Points à discuter: budget, planning, ressources...', updatedAt: new Date() },
  ];

  const filteredNotes = sampleNotes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const noteVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <SidebarProvider>
        <motion.div variants={itemVariants}>
          <Sidebar className="border-r-2 border-gradient-to-b from-blue-200 to-purple-200">
            <SidebarHeader className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <motion.div 
                className="flex items-center gap-2 mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BookOpen className="w-8 h-8" />
                <div className="text-2xl font-bold tracking-wide">NotesApp</div>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
              <motion.div 
                className="relative"
                variants={itemVariants}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <Input
                  placeholder="Rechercher une note..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 transition-all duration-200"
                />
              </motion.div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <motion.div variants={itemVariants} className="mb-4">
                <motion.button
                  onClick={() => setIsCreatingNote(!isCreatingNote)}
                  className="w-full flex items-center gap-2 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5" />
                  Nouvelle note
                </motion.button>
              </motion.div>
              
              <motion.h2 
                className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"
                variants={itemVariants}
              >
                <FileText className="w-5 h-5" />
                Mes notes ({filteredNotes.length})
              </motion.h2>
              
              <ScrollArea className="h-[calc(100vh-300px)]">
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
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedNote === note.id 
                              ? 'bg-blue-100 border-2 border-blue-300' 
                              : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedNote(note.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <h3 className="font-medium text-gray-800 truncate">{note.title}</h3>
                          <p className="text-sm text-gray-600 truncate mt-1">{note.content}</p>
                          <div className="text-xs text-gray-400 mt-2">
                            {note.updatedAt.toLocaleDateString()}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="text-center py-8"
                    >
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        {search ? 'Aucune note trouvée' : 'Aucune note disponible'}
                      </p>
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
                      className="w-full flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
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
                        <><Sun className="w-4 h-4" /> Mode clair</>
                      ) : (
                        <><Moon className="w-4 h-4" /> Mode sombre</>
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
        className="flex-1 p-6"
        variants={itemVariants}
      >
        {selectedNote ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full p-6 shadow-xl bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  {filteredNotes.find(n => n.id === selectedNote)?.title}
                </h1>
                <motion.button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Modifier
                </motion.button>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {filteredNotes.find(n => n.id === selectedNote)?.content}
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
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BookOpen className="w-24 h-24 text-blue-300 mb-6" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Bienvenue dans votre espace de notes
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-md">
              Sélectionnez une note existante ou créez-en une nouvelle pour commencer à écrire.
            </p>
            <motion.button
              onClick={() => setIsCreatingNote(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Créer ma première note
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
