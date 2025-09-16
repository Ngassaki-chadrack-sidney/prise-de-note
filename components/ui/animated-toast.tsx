"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface AnimatedToastProps {
  type: ToastType;
  title?: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

export function AnimatedToast({
  type,
  title,
  message,
  isVisible,
  onClose,
  duration = 5000,
  position = "top-right",
}: AnimatedToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: {
      bg: "bg-emerald-50 border-emerald-200",
      icon: "text-emerald-500",
      title: "text-emerald-800",
      message: "text-emerald-700",
      progress: "bg-emerald-500",
    },
    error: {
      bg: "bg-red-50 border-red-200",
      icon: "text-red-500",
      title: "text-red-800",
      message: "text-red-700",
      progress: "bg-red-500",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-500",
      title: "text-yellow-800",
      message: "text-yellow-700",
      progress: "bg-yellow-500",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      icon: "text-blue-500",
      title: "text-blue-800",
      message: "text-blue-700",
      progress: "bg-blue-500",
    },
  };

  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  const slideDirection = position.includes("right")
    ? 300
    : position.includes("left")
    ? -300
    : 0;
  const slideY = position.includes("top")
    ? -100
    : position.includes("bottom")
    ? 100
    : 0;

  const Icon = icons[type];
  const colorScheme = colors[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed z-50 max-w-sm w-full shadow-lg rounded-lg border p-4",
            colorScheme.bg,
            positions[position]
          )}
          initial={{
            opacity: 0,
            x: slideDirection,
            y: slideY,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            x: slideDirection,
            y: slideY,
            scale: 0.8,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          layout
        >
          <div className="flex items-start gap-3">
            <motion.div
              initial={{ rotate: 0, scale: 0 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", colorScheme.icon)} />
            </motion.div>

            <div className="flex-1 min-w-0">
              {title && (
                <motion.h4
                  className={cn("text-sm font-semibold", colorScheme.title)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {title}
                </motion.h4>
              )}
              <motion.p
                className={cn("text-sm", colorScheme.message, title && "mt-1")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {message}
              </motion.p>
            </div>

            <motion.button
              onClick={onClose}
              className="flex-shrink-0 text-white-400 hover:text-white-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Barre de progression */}
          {duration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 rounded-b-lg"
              style={{
                background: `linear-gradient(to right, ${colorScheme.progress} 0%, ${colorScheme.progress} 100%)`,
              }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook pour gérer les toasts
export function useAnimatedToast() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: ToastType;
      title?: string;
      message: string;
      isVisible: boolean;
    }>
  >([]);

  const showToast = (type: ToastType, message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [
      ...prev,
      { id, type, title, message, isVisible: true },
    ]);
  };

  const hideToast = (id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    );

    // Supprimer le toast après l'animation de sortie
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };

  const ToastContainer = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <AnimatedToast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );

  return {
    success: (message: string, title?: string) =>
      showToast("success", message, title),
    error: (message: string, title?: string) =>
      showToast("error", message, title),
    warning: (message: string, title?: string) =>
      showToast("warning", message, title),
    info: (message: string, title?: string) =>
      showToast("info", message, title),
    ToastContainer,
  };
}
