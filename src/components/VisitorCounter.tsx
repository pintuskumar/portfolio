"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Register this visitor
    fetch("/api/visitors", { method: "POST" }).catch(() => {});

    // Poll active visitors every 30s
    const fetchCount = () => {
      fetch("/api/visitors")
        .then((r) => r.json())
        .then((data) => setCount(data.active || 0))
        .catch(() => {});
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);

    // Unregister on page leave
    const handleLeave = () => {
      navigator.sendBeacon("/api/visitors?action=leave");
    };
    window.addEventListener("beforeunload", handleLeave);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleLeave);
      handleLeave();
    };
  }, []);

  if (count === null || count < 1) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <Users className="h-3 w-3 text-gray-400" />
        <span className="text-xs text-gray-400">
          <span className="text-white font-medium">{count}</span>{" "}
          {count === 1 ? "person" : "people"} viewing
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
