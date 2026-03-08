"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const shortcuts = [
  { key: "H", section: "home", label: "Home" },
  { key: "A", section: "about", label: "About" },
  { key: "S", section: "skills", label: "Skills" },
  { key: "E", section: "experience", label: "Experience" },
  { key: "P", section: "projects", label: "Projects" },
  { key: "D", section: "education", label: "Education" },
  { key: "C", section: "contact", label: "Contact" },
];

export default function KeyboardNav() {
  const [showHint, setShowHint] = useState(false);
  const [lastPressed, setLastPressed] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      // Show/hide keyboard hints with "?"
      if (e.key === "?") {
        setShowHint((prev) => !prev);
        return;
      }

      // Navigate sections
      const key = e.key.toUpperCase();
      const shortcut = shortcuts.find((s) => s.key === key);
      if (shortcut) {
        const el = document.getElementById(shortcut.section);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setLastPressed(shortcut.label);
          setTimeout(() => setLastPressed(""), 1500);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Navigation toast */}
      <AnimatePresence>
        {lastPressed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] rounded-full bg-gray-900/90 border border-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm shadow-lg"
          >
            Navigating to <span className="font-semibold text-indigo-400">{lastPressed}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcuts overlay */}
      <AnimatePresence>
        {showHint && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm"
              onClick={() => setShowHint(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] w-80 rounded-2xl border border-white/10 bg-gray-950/95 p-6 shadow-2xl backdrop-blur-xl"
            >
              <h3 className="mb-4 text-lg font-semibold text-white">Keyboard Shortcuts</h3>
              <div className="space-y-2">
                {shortcuts.map((s) => (
                  <div key={s.key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{s.label}</span>
                    <kbd className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-mono text-indigo-300 ring-1 ring-white/10">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-gray-600">
                Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono">?</kbd> to toggle
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
