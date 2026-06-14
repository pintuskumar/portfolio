import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "Loading modules...", delay: 0, progress: 25 },
  { text: "Initializing portfolio...", delay: 150, progress: 55 },
  { text: "Ready.", delay: 350, progress: 100 },
];

export function LoadingScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (sessionStorage.getItem("boot-done")) return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("boot-done", "true");
      return false;
    }
    return true;
  });
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach(({ text, delay, progress: p }) => {
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, text]);
          setProgress(p);
        }, delay)
      );
    });

    timers.push(
      setTimeout(() => {
        sessionStorage.setItem("boot-done", "true");
        setVisible(false);
      }, 600)
    );
    return () => timers.forEach(clearTimeout);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[300] bg-background flex items-center justify-center"
        >
          <div className="font-mono text-xs text-muted-foreground space-y-1 max-w-sm w-full px-8">
            {lines.map((line, i) => (
              <div key={i} className="flex items-center gap-2 animate-fade-in">
                <span className="text-terminal-green">❯</span>
                <span className={line === "Ready." ? "text-terminal-green font-bold" : ""}>{line}</span>
              </div>
            ))}
            {lines.length < BOOT_LINES.length && (
              <div className="flex items-center gap-2">
                <span className="text-terminal-green">❯</span>
                <span className="animate-blink text-primary">█</span>
              </div>
            )}

            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">loading</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
