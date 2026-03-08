"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, ExternalLink } from "lucide-react";

const currentWork = {
  title: "Secure Access Tech - Enterprise Security Platform",
  description:
    "Building scalable microservices and cloud-ready web applications for security-driven enterprise products with OAuth 2.0 and JWT authentication.",
  technologies: ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
  status: "In Progress",
};

export default function CurrentlyWorkingOn() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-6"
    >
      {/* Animated gradient border glow */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent,rgba(99,102,241,0.15),transparent,rgba(139,92,246,0.15),transparent)]"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Currently Working On
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="text-[10px] font-medium text-green-400">
              {currentWork.status}
            </span>
          </span>
        </div>

        {/* Title */}
        <h4 className="mb-2 text-base font-semibold text-white">
          {currentWork.title}
        </h4>

        {/* Description */}
        <p className="mb-3 text-sm text-gray-400 leading-relaxed">
          {currentWork.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {currentWork.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-300 ring-1 ring-indigo-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
