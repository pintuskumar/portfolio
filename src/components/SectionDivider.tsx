"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const width = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "100%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} aria-hidden="true" className="relative py-4">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          style={{ width, opacity }}
          className="mx-auto h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        />
      </div>
    </div>
  );
}
