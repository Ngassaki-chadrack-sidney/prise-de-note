"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { LucideIcon } from "lucide-react";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  variant?: "default" | "floating" | "filled";
  animationType?: "slide" | "fade" | "scale" | "bounce";
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, label, error, icon: Icon, variant = "default", animationType = "slide", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const inputVariants = {
      initial: {
        scale: animationType === "scale" ? 0.95 : 1,
        opacity: animationType === "fade" ? 0.7 : 1,
        x: animationType === "slide" ? -10 : 0,
        y: animationType === "bounce" ? -5 : 0,
      },
      focused: {
        scale: animationType === "scale" ? 1.02 : 1,
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          type: animationType === "bounce" ? "spring" : "tween",
          stiffness: animationType === "bounce" ? 300 : undefined,
          damping: animationType === "bounce" ? 20 : undefined,
          duration: animationType === "bounce" ? undefined : 0.2,
        }
      },
      error: {
        x: [-5, 5, -5, 5, 0],
        transition: {
          duration: 0.4,
          ease: "easeInOut"
        }
      }
    };

    const labelVariants = {
      initial: {
        y: variant === "floating" ? 0 : -20,
        x: variant === "floating" ? 12 : 0,
        scale: 1,
        opacity: variant === "floating" ? 0.7 : 1,
      },
      focused: {
        y: variant === "floating" ? -24 : -20,
        x: variant === "floating" ? 0 : 0,
        scale: variant === "floating" ? 0.85 : 1,
        opacity: 1,
        color: error ? "#ef4444" : "#3b82f6",
        transition: { duration: 0.2, ease: "easeOut" }
      }
    };

    const iconVariants = {
      initial: {
        color: "#9ca3af",
        scale: 1,
      },
      focused: {
        color: error ? "#ef4444" : "#3b82f6",
        scale: 1.1,
        transition: { duration: 0.2 }
      }
    };

    const borderVariants = {
      initial: {
        scaleX: 0,
        opacity: 0,
      },
      focused: {
        scaleX: 1,
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" }
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const shouldLabelFloat = variant === "floating" && (isFocused || hasValue);

    return (
      <div className="relative w-full">
        {/* Label flottant ou fixe */}
        {label && (
          <motion.label
            className={cn(
              "absolute pointer-events-none text-sm font-medium transition-colors",
              variant === "floating" ? "top-3 left-3" : "top-0 left-0 mb-2",
              error ? "text-red-500" : "text-gray-700"
            )}
            variants={labelVariants}
            initial="initial"
            animate={shouldLabelFloat || variant !== "floating" ? "focused" : "initial"}
          >
            {label}
          </motion.label>
        )}

        {/* Container pour l'input et l'icône */}
        <motion.div
          className="relative"
          variants={inputVariants}
          initial="initial"
          animate={isFocused ? "focused" : error ? "error" : "initial"}
        >
          {/* Icône */}
          {Icon && (
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
              variants={iconVariants}
              initial="initial"
              animate={isFocused ? "focused" : "initial"}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          )}

          {/* Input */}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-lg border-2 px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              Icon && "pl-11",
              variant === "filled" && "bg-gray-50 border-gray-200 focus:bg-white",
              variant === "floating" && label && "pt-6 pb-2",
              error 
                ? "border-red-500 focus:border-red-500 bg-red-50/50" 
                : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Bordure animée */}
          <motion.div
            className={cn(
              "absolute bottom-0 left-0 h-0.5 w-full origin-left",
              error ? "bg-red-500" : "bg-blue-500"
            )}
            variants={borderVariants}
            initial="initial"
            animate={isFocused ? "focused" : "initial"}
          />
        </motion.div>

        {/* Message d'erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-sm text-red-500 flex items-center gap-1"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            >
              ⚠️
            </motion.span>
            {error}
          </motion.div>
        )}

        {/* Effet de focus supplémentaire */}
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-blue-300 pointer-events-none"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

// Composant textarea animé
interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: "default" | "floating" | "filled";
}

export const AnimatedTextarea = forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(
  ({ className, label, error, variant = "default", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const shouldLabelFloat = variant === "floating" && (isFocused || hasValue);

    return (
      <div className="relative w-full">
        {label && (
          <motion.label
            className={cn(
              "absolute pointer-events-none text-sm font-medium transition-colors z-10",
              variant === "floating" ? "top-3 left-3" : "top-0 left-0 mb-2",
              error ? "text-red-500" : "text-gray-700"
            )}
            initial={{
              y: variant === "floating" ? 0 : -20,
              x: variant === "floating" ? 12 : 0,
              scale: 1,
            }}
            animate={{
              y: shouldLabelFloat || variant !== "floating" ? -24 : 0,
              x: shouldLabelFloat || variant !== "floating" ? 0 : 12,
              scale: shouldLabelFloat || variant !== "floating" ? 0.85 : 1,
              color: error ? "#ef4444" : isFocused ? "#3b82f6" : "#374151",
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        <motion.div
          className="relative"
          initial={{ scale: 0.98, opacity: 0.9 }}
          animate={{ 
            scale: isFocused ? 1.01 : 1, 
            opacity: 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <textarea
            className={cn(
              "flex min-h-[120px] w-full rounded-lg border-2 px-3 py-3 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              variant === "filled" && "bg-gray-50 border-gray-200 focus:bg-white",
              variant === "floating" && label && "pt-8 pb-3",
              error 
                ? "border-red-500 focus:border-red-500 bg-red-50/50" 
                : "border-gray-200 focus:border-blue-500 bg-white hover:border-gray-300",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          <motion.div
            className={cn(
              "absolute bottom-0 left-0 h-0.5 w-full origin-left",
              error ? "bg-red-500" : "bg-blue-500"
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.div>
        )}
      </div>
    );
  }
);

AnimatedTextarea.displayName = "AnimatedTextarea";
