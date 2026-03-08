"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const CODE_LINES = [
  { text: "const ", color: "#c586c0" },
  { text: "developer", color: "#4fc1ff" },
  { text: " = {", color: "#d4d4d4" },
  { text: "", color: "" }, // newline
  { text: "  name: ", color: "#9cdcfe" },
  { text: '"Pintu Kumar"', color: "#ce9178" },
  { text: ",", color: "#d4d4d4" },
  { text: "", color: "" },
  { text: "  role: ", color: "#9cdcfe" },
  { text: '"Full Stack Developer"', color: "#ce9178" },
  { text: ",", color: "#d4d4d4" },
  { text: "", color: "" },
  { text: "  skills: ", color: "#9cdcfe" },
  { text: "[", color: "#d4d4d4" },
  { text: '"React"', color: "#ce9178" },
  { text: ", ", color: "#d4d4d4" },
  { text: '"Node.js"', color: "#ce9178" },
  { text: ", ", color: "#d4d4d4" },
  { text: '"TypeScript"', color: "#ce9178" },
  { text: "]", color: "#d4d4d4" },
  { text: ",", color: "#d4d4d4" },
  { text: "", color: "" },
  { text: "  passion: ", color: "#9cdcfe" },
  { text: '"Building scalable web apps"', color: "#ce9178" },
  { text: ",", color: "#d4d4d4" },
  { text: "", color: "" },
  { text: "  ", color: "" },
  { text: "available: ", color: "#9cdcfe" },
  { text: "true", color: "#569cd6" },
  { text: ",", color: "#d4d4d4" },
  { text: "", color: "" },
  { text: "};", color: "#d4d4d4" },
];

export default function CodeSnippet() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [visibleTokens, setVisibleTokens] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleTokens(i);
      if (i >= CODE_LINES.length) clearInterval(interval);
    }, 60);

    return () => clearInterval(interval);
  }, [isInView]);

  // Build lines from tokens
  const lines: { tokens: typeof CODE_LINES }[] = [];
  let currentLine: typeof CODE_LINES = [];
  const visibleCode = CODE_LINES.slice(0, visibleTokens);

  visibleCode.forEach((token) => {
    if (token.text === "" && token.color === "") {
      lines.push({ tokens: currentLine });
      currentLine = [];
    } else {
      currentLine.push(token);
    }
  });
  if (currentLine.length > 0) lines.push({ tokens: currentLine });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* VS Code style window */}
      <div className="rounded-xl border border-white/10 bg-[#1e1e1e] overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#252526] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 text-xs text-gray-500 font-mono">developer.ts</span>
        </div>

        {/* Code area */}
        <div className="p-4 font-mono text-sm leading-6 min-h-[200px]">
          {lines.map((line, li) => (
            <div key={li} className="flex">
              <span className="w-8 shrink-0 text-right pr-4 text-gray-600 select-none text-xs">
                {li + 1}
              </span>
              <span>
                {line.tokens.map((token, ti) => (
                  <span key={ti} style={{ color: token.color }}>
                    {token.text}
                  </span>
                ))}
              </span>
            </div>
          ))}

          {/* Blinking cursor */}
          {visibleTokens < CODE_LINES.length && (
            <span className="inline-block w-[2px] h-[14px] bg-white/80 animate-pulse ml-8" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
