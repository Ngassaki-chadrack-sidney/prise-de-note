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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpUserSchema, type SignUpUser } from "@/types/types";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
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
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb]">
      <div className="relative z-10">
        <Card className="w-full max-w-lg mx-4 backdrop-blur-md bg-white/95 shadow-2xl border-0 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Inscription
              </CardTitle>
              <CardDescription className="text-center mt-2 text-gray-600">
                Créez votre compte et commencez votre aventure
              </CardDescription>
            </div>
            
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nom d'utilisateur</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register("name")}
                      className={`pl-12 h-12 border-2 focus:border-purple-500 transition-all duration-200 hover:border-gray-400 ${
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
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      {...register("email")}
                      className={`pl-12 h-12 border-2 focus:border-purple-500 transition-all duration-200 hover:border-gray-400 ${
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
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-500" />
                    <Input
                      id="password"
                      placeholder="Minimum 8 caractères"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`pl-12 pr-12 h-12 border-2 focus:border-purple-500 transition-all duration-200 hover:border-gray-400 ${
                        errors.password ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      aria-label="Mot de passe"
                      autoComplete="new-password"
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmer le mot de passe</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-purple-500" />
                    <Input
                      id="confirmPassword"
                      placeholder="Répétez votre mot de passe"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={`pl-12 pr-12 h-12 border-2 focus:border-purple-500 transition-all duration-200 hover:border-gray-400 ${
                        errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      aria-label="Confirmer le mot de passe"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Création du compte...
                      </div>
                    ) : (
                      <span>Créer mon compte</span>
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col items-center space-y-4 pt-6 p-0">
              <div className="text-center">
                <span className="text-gray-600">Vous avez déjà un compte ? </span>
                <Link href="/login" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                  Se connecter
                </Link>
              </div>
              
              <div className="text-center text-xs text-gray-500 max-w-sm">
                En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </div>
            </CardFooter>
          </div>
        </Card>
      </div>
    </div>
  );
}
