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
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

export default function SignUpPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setIsLoading(true);

    try {
      await register(email, password, name);
      toast.success("Inscription réussie ! Bienvenue !");
      router.push("/");
    } catch (error: any) {
      toast.error("Erreur : " + error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center relative overflow-hidden">
      {/* Arrière-plan animé avec des formes géométriques */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500" />
      
      {/* Formes décoratives flottantes */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-lg transform rotate-45"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute bottom-32 left-40 w-20 h-20 bg-white/10 rounded-full"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-lg"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 0.5 }}
      />
      
      {/* Particules flottantes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
          animate={{
            y: [Math.random() * 100, Math.random() * -100],
            x: [Math.random() * 50, Math.random() * -50],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <Card className="w-full max-w-lg mx-4 backdrop-blur-md bg-white/95 shadow-2xl border-0 overflow-hidden">
          <motion.div variants={itemVariants} className="p-8">
            <div className="flex flex-col items-center mb-8">
              <motion.div
                className="w-18 h-18 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <UserPlus className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Inscription
              </CardTitle>
              <CardDescription className="text-center mt-2 text-gray-600">
                Créez votre compte et commencez votre aventure
              </CardDescription>
            </div>
            
            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nom d'utilisateur</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      placeholder="John Doe"
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-12 h-12 border-2 focus:border-emerald-500 transition-all duration-200 hover:border-gray-400"
                      aria-label="Nom d'utilisateur"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="votre.email@exemple.com"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-12 border-2 focus:border-emerald-500 transition-all duration-200 hover:border-gray-400"
                      aria-label="Email"
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                    <Input
                      id="password"
                      placeholder="Minimum 6 caractères"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 h-12 border-2 focus:border-emerald-500 transition-all duration-200 hover:border-gray-400"
                      aria-label="Mot de passe"
                      autoComplete="new-password"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmer le mot de passe</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-500" />
                    <Input
                      id="confirmPassword"
                      placeholder="Répétez votre mot de passe"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 h-12 border-2 focus:border-emerald-500 transition-all duration-200 hover:border-gray-400"
                      aria-label="Confirmer le mot de passe"
                      autoComplete="new-password"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </motion.div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-600 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    whileHover={{ scale: isLoading ? 1 : 1.02, boxShadow: "0 15px 30px rgba(16, 185, 129, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    {isLoading ? (
                      <motion.div 
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Création du compte...
                      </motion.div>
                    ) : (
                      <span className="relative z-10">Créer mon compte</span>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col items-center space-y-4 pt-6 p-0">
              <motion.div
                variants={itemVariants}
                className="text-center"
              >
                <span className="text-gray-600">Vous avez déjà un compte ? </span>
                <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors">
                  Se connecter
                </Link>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="text-center text-xs text-gray-500 max-w-sm"
              >
                En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </motion.div>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
