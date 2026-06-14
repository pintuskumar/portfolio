import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function TerminalLine({ command, output, delay, isLast }: { command: string; output: string; delay: number; isLast?: boolean }) {
  const [showCmd, setShowCmd] = useState(false);
  const [typedCmd, setTypedCmd] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCmd(true), delay);
    return () => clearTimeout(t1);
  }, [delay]);

  useEffect(() => {
    if (!showCmd) return;
    let i = 0;
    let last = performance.now();
    const stepMs = 60;

    const tick = (now: number) => {
      if (now - last >= stepMs) {
        last = now;
        i++;
        setTypedCmd(command.slice(0, i));
        if (i >= command.length) {
          setTimeout(() => setShowOutput(true), 300);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [showCmd, command]);

  return (
    <div className="font-mono text-sm">
      {showCmd && (
        <div className="flex items-center gap-2">
          <span className="text-terminal-green">❯</span>
          <span className="text-foreground">{typedCmd}</span>
          {!showOutput && <span className="animate-blink text-primary">█</span>}
        </div>
      )}
      {showOutput && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-5 text-muted-foreground">
          {output}
        </motion.div>
      )}
      {isLast && showOutput && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-terminal-green">❯</span>
          <span className="animate-blink text-terminal-green">█</span>
        </div>
      )}
    </div>
  );
}
