import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * One-time wordmark intro on first load.
 * Centered serif "PK" draws itself with a hairline gold stroke,
 * then the overlay fades. Skipped for reduced-motion users.
 */
export function WordmarkIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    if (sessionStorage.getItem("pk_intro_played")) return;
    sessionStorage.setItem("pk_intro_played", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-background pointer-events-none"
          aria-hidden
        >
          <svg
            viewBox="0 0 220 140"
            className="w-44 md:w-56 h-auto"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* P */}
            <motion.path
              d="M 20 30 L 20 110 M 20 30 L 55 30 Q 80 30 80 50 Q 80 70 55 70 L 20 70"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary)/0.4))" }}
            />
            {/* K */}
            <motion.path
              d="M 130 30 L 130 110 M 130 70 L 170 30 M 130 70 L 170 110"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary)/0.4))" }}
            />
            {/* hairline rule */}
            <motion.line
              x1="20" y1="128" x2="200" y2="128"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
              strokeWidth="0.6"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WordmarkIntro;
