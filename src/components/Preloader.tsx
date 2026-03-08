"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if already visited
    if (sessionStorage.getItem("preloaded")) {
      setIsLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem("preloaded", "1");
          }, 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-gray-950"
        >
          {/* Animated logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-white">Pintu</span>
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                {" "}Kumar
              </span>
            </motion.h1>
          </motion.div>

          {/* Orbiting dots */}
          <div className="relative w-16 h-16 mb-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  background: i === 0 ? "#818cf8" : i === 1 ? "#a78bfa" : "#6366f1",
                }}
                animate={{
                  x: [0, Math.cos((i * 2 * Math.PI) / 3) * 24, 0],
                  y: [0, Math.sin((i * 2 * Math.PI) / 3) * 24, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-48 h-0.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-xs text-gray-500 tracking-widest uppercase"
          >
            Loading experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
