import { useMemo } from "react";

/**
 * Lightweight CSS-driven Matrix rain. No framer-motion runtime cost —
 * each column is a single absolutely-positioned div animated via @keyframes.
 */
export function MatrixRain({ active }: { active: boolean }) {
  const columns = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.round((i / 18) * 100 + Math.random() * 4),
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 1.2,
      chars: Array.from({ length: 8 + Math.floor(Math.random() * 10) })
        .map(() => String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96)))
        .join("\n"),
    }));
  }, []);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden animate-fade-in">
      {columns.map((c) => (
        <div
          key={c.id}
          className="absolute font-mono text-terminal-green text-xs whitespace-pre matrix-column"
          style={{
            left: `${c.left}%`,
            top: 0,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          {c.chars}
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
        <div className="bg-card/90 backdrop-blur-sm border border-terminal-green/50 rounded-lg px-8 py-4 text-center">
          <p className="font-mono text-terminal-green text-lg mb-1">↑↑↓↓←→←→BA</p>
          <p className="font-mono text-xs text-muted-foreground">You found the easter egg! 🎉</p>
        </div>
      </div>
    </div>
  );
}
