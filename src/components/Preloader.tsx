"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip preloader if already visited this session
    if (sessionStorage.getItem("preloaded")) {
      setIsLoading(false);
      return;
    }

    // Use faster loading — complete when DOM is ready, max 800ms
    const dismiss = () => {
      setIsLoading(false);
      sessionStorage.setItem("preloaded", "1");
    };

    // Wait for main content to be ready, but cap at 800ms
    const timeout = setTimeout(dismiss, 800);

    if (document.readyState === "complete") {
      clearTimeout(timeout);
      // Small delay for smooth transition
      setTimeout(dismiss, 200);
    } else {
      window.addEventListener("load", () => {
        clearTimeout(timeout);
        setTimeout(dismiss, 200);
      }, { once: true });
    }

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-gray-950"
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white">Pintu</span>
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {" "}Kumar
            </span>
          </motion.h1>

          {/* Simple spinner */}
          <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
