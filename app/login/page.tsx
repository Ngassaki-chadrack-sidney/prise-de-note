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
import { Eye, EyeOff, Loader2, Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
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
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb]">
      <div className="relative z-10">
        <Card className="w-full max-w-md mx-4 backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Connexion
              </CardTitle>
              <CardDescription className="text-center mt-2 text-gray-600">
                Bienvenue ! Connectez-vous à votre compte
              </CardDescription>
            </div>
            
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      {...register("email")}
                      className={`pl-12 h-12 border-2 focus:border-purple-500 transition-all duration-200 ${
                        errors.email ? "border-red-500 focus:border-red-500" : ""
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
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      placeholder="Votre mot de passe"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`pl-12 pr-12 h-12 border-2 focus:border-purple-500 transition-all duration-200 ${
                        errors.password ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      aria-label="Mot de passe"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Connexion en cours...
                      </div>
                    ) : (
                      <span>Se connecter</span>
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col items-center space-y-4 pt-6 p-0">
              <div className="text-center">
                <span className="text-gray-600">Pas encore de compte ? </span>
                <Link href="/sign-in" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                  Créer un compte
                </Link>
              </div>
              
              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
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
