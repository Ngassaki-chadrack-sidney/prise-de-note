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
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserSchema, type LoginUser } from "@/types/types";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // React Hook Form avec validation Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUser>({
    resolver: zodResolver(LoginUserSchema),
  });

  const onSubmit = async (data: LoginUser) => {
    setError("");

    try {
      await login(data.email, data.password);
      toast.success("Connexion réussie !");
      router.push(callbackUrl);
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
        <Card className="w-full max-w-md border">
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <LogIn className="w-8 h-8 mb-2" />
              <CardTitle className="text-2xl font-semibold">
                Connexion
              </CardTitle>
              <CardDescription className="text-center mt-1">
                Connectez-vous à votre compte
              </CardDescription>
            </div>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="password"
                      placeholder="Votre mot de passe"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`pl-12 pr-12 h-10 ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      aria-label="Mot de passe"
                      autoComplete="current-password"
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
                        Connexion...
                      </div>
                    ) : (
                      <span>Se connecter</span>
                    )}
                  </button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center space-y-3 pt-6 p-0">
              <div className="text-center">
                <span className="text-muted-foreground">
                  Pas encore de compte ?{" "}
                </span>
                <Link href="/sign-in" className="text-primary font-medium">
                  Créer un compte
                </Link>
              </div>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
