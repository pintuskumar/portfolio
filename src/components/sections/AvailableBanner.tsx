import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function AvailableBanner() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("banner-dismissed") === "true";
    }
    return false;
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("banner-dismissed", "true");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-[57px] left-0 right-0 z-40 bg-primary/10 border-b border-primary/20 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green"></span>
          </span>
          <span className="text-foreground">Open to opportunities</span>
          <span className="text-muted-foreground hidden sm:inline">—</span>
          <a href="#contact" className="text-primary hover:text-primary/80 transition-colors hidden sm:inline">
            Let's connect →
          </a>
        </div>
        <button onClick={handleDismiss} className="p-1 text-muted-foreground hover:text-foreground transition-colors" aria-label="Dismiss banner">
          <X size={12} />
        </button>
      </div>
    </motion.div>
  );
}
