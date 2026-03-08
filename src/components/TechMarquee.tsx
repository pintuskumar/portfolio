"use client";

import { motion } from "framer-motion";

const TECH_STACK = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "Node.js", color: "#339933" },
  { name: "Express", color: "#ffffff" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Tailwind CSS", color: "#06B6D4" },
  { name: "Docker", color: "#2496ED" },
  { name: "AWS", color: "#FF9900" },
  { name: "Redis", color: "#DC382D" },
  { name: "Socket.io", color: "#ffffff" },
  { name: "Redux", color: "#764ABC" },
  { name: "Git", color: "#F05032" },
  { name: "Material UI", color: "#007FFF" },
  { name: "SQL", color: "#4479A1" },
  { name: "Postman", color: "#FF6C37" },
];

// Duplicate for seamless loop
const ITEMS = [...TECH_STACK, ...TECH_STACK];

function MarqueeRow({ direction = "left", speed = 30 }: { direction?: "left" | "right"; speed?: number }) {
  const duration = ITEMS.length * (100 / speed);

  return (
    <div className="flex overflow-hidden">
      <motion.div
        className="flex shrink-0 gap-4 py-2"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            duration,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {ITEMS.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="group flex shrink-0 items-center gap-2.5 rounded-full border border-white/5 bg-white/[0.02] px-5 py-2.5 transition-all duration-300 hover:border-white/20 hover:bg-white/5"
          >
            {/* Color dot */}
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125"
              style={{ backgroundColor: tech.color }}
            />
            <span className="whitespace-nowrap text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-white">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function TechMarquee() {
  return (
    <section className="relative overflow-hidden bg-gray-950 py-10 sm:py-14">
      {/* Gradient fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-gray-950 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-gray-950 to-transparent" />

      <div className="space-y-3">
        <MarqueeRow direction="left" speed={25} />
        <MarqueeRow direction="right" speed={20} />
      </div>
    </section>
  );
}
