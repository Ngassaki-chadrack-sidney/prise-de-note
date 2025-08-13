"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Alert } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);

    // Verifie si les infos sont valide avant de les envoyer dans la requete
    if (!email || !newPassword) {
      toast.error("Veuillez remplir tous les champs");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    // Fetch vers la route pour mettres a jour le mot de passe
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        toast.error("Erreur lors de la réinitialisation du mot de passe");
        setIsError(true);
      } else {
        toast.success("Mot de passe réinitialisé avec succès!");
        setEmail("");
        setNewPassword("");
      }
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation du mot de passe");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb]">
      <div className="relative z-10">
        <Card className="w-full max-w-md mx-4 backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                Mot de passe oublié
              </CardTitle>
            </div>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Entrez votre email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="pl-12"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Entrez votre nouveau mot de passe"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isSubmitting}
                        className="pl-12 pr-12"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isError && (
                    <Alert className="mt-2 p-4" variant="destructive">
                      Une erreur est survenue. Veuillez vérifier vos
                      informations et réessayer.
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Réinitialisation...
                      </>
                    ) : (
                      "Réinitialiser le mot de passe"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center space-y-4 pt-6 p-0">
              <div className="text-center">
                <span className="text-gray-600 text-sm">
                  Vous vous souvenez de votre mot de passe ?{" "}
                </span>
                <Link
                  href="/login"
                  className="text-purple-600 hover:text-purple-800 font-semibold transition-colors text-sm"
                >
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
