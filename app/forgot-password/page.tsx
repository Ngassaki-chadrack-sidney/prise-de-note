"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, EyeOff, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

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

    if (!email || !newPassword) {
      toast.error("Veuillez remplir tous les champs");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

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

        window.location.href = "/login";
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
    <div className="min-h-screen min-w-screen flex overflow-hidden">
      <div className="h-screen w-1/2">
        <video
          src="./login.mp4"
          className="inset-0 w-full h-full object-cover"
        ></video>
      </div>

      <div className="flex w-1/2 items-center justify-center p-6">
        <Card className="w-full bg-background max-w-xl border-none shadow-none">
          <div className="p-6">
            <div className="flex flex-col items-center mb-6 gap-6">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-foreground" />
              </div>
              <CardTitle className="text-3xl font-bold text-center">
                Mot de passe oublié
              </CardTitle>
            </div>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-4 w-xl">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-400" />
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
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre nouveau mot de passe"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="pl-12 pr-12"
                      minLength={6}
                      required
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
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center space-y-4 pt-6 p-0">
              <div className="text-center">
                <span className="text-white-600 text-sm">
                  Vous vous souvenez de votre mot de passe ?{" "}
                </span>
                <Link href="/login" className="font-semibold text-sm">
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
