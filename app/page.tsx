"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [darkMode, setDarkmode] = useState<boolean>(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="text-2xl">Takes notes</div>
            <div>
              <Input
                placeholder="Rechercher un note"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shadow-lg border-0"
              />
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <h2 className="text-lg">Listes de notes disponible</h2>
            <ScrollArea>
              <p>Ici on va mettre tous les notes disponibles.</p>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant={"outline"} className="w-full flex">
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button
                    variant={"destructive"}
                    className="w-full"
                    onClick={logout}
                  >
                    se deconnecter
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertDialogAction>
                    <AlertDialogTrigger>
                      <Button variant={"destructive"} className="w-full">
                        Supprimer mon compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Voulez-vous vraiment supprimer votre compte?
                      </AlertDialogTitle>
                      <AlertDialogContent>
                        <AlertDialogDescription>
                          Cette action est irrervible voulez-vous vraiment
                          continuer
                        </AlertDialogDescription>
                      </AlertDialogContent>
                      <AlertDialogFooter>
                        <AlertDialogAction>
                          <Button
                            variant={"destructive"}
                            onClick={async () => {
                              const response = await fetch(
                                "/api/auth/del-account",
                                {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(user?.email),
                                }
                              );

                              const data = response.json();

                              if (!data.ok) {
                                throw new Error(
                                  "Impossible de supprimer le user"
                                );
                              }
                            }}
                          >
                            oui
                          </Button>
                        </AlertDialogAction>
                        <AlertDialogCancel>non</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogHeader>
                  </AlertDialogAction>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant={"ghost"} className="w-full">
                    Ajouter une note
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button variant={"ghost"}>
                    {darkMode ? (
                      <div className="flex justify-baseline items-baseline gap-2 w-full">
                        Passer en mode sombre <Moon />{" "}
                      </div>
                    ) : (
                      <div className="flex justify-baseline items-baseline gap-2 w-full">
                        Passer en mode claire <Sun />{" "}
                      </div>
                    )}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>

      <div></div>
    </div>
  );
}
