"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Mail, Lock, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpUserSchema, type SignUpUser } from "@/types/types";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { register: registerUser } = useAuth();

  // React Hook Form avec validation Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpUser>({
    resolver: zodResolver(SignUpUserSchema),
  });

  const onSubmit = async (data: SignUpUser) => {
    setError("");

    try {
      await registerUser(data.email, data.password, data.name);
      toast.success("Inscription réussie ! Bienvenue !");
      router.push("/");
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block relative">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/login.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-xl bg-background border-none shadow-none gap-6">
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <UserPlus className="w-8 h-8 mb-2" />
              <CardTitle className="text-2xl font-semibold">
                Inscription
              </CardTitle>
              <CardDescription className="text-center mt-1">
                Créez votre compte
              </CardDescription>
            </div>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nom d'utilisateur
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                      className={`pl-12 h-10 ${
                        errors.name ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      aria-label="Nom d'utilisateur"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Adresse email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      {...register("email")}
                      className={`pl-12 h-10 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      aria-label="Email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="password"
                      placeholder="Minimum 8 caractères"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`pl-12 pr-12 h-10 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      aria-label="Mot de passe"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      placeholder="Répétez votre mot de passe"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={`pl-12 pr-12 h-10 ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      aria-label="Confirmer le mot de passe"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={
                        showConfirmPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-10 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Création du compte...
                      </div>
                    ) : (
                      <span>Créer mon compte</span>
                    )}
                  </button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center space-y-3 pt-6 p-0">
              <div className="text-center">
                <span className="text-muted-foreground">
                  Vous avez déjà un compte ?{" "}
                </span>
                <Link href="/login" className="text-primary font-medium">
                  Se connecter
                </Link>
              </div>

              <div className="text-center text-xs text-muted-foreground max-w-sm">
                En créant un compte, vous acceptez nos conditions d'utilisation
                et notre politique de confidentialité.
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
