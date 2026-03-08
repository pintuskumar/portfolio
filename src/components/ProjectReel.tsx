"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github, FolderOpen, ArrowRight } from "lucide-react";
import { projects } from "../data/portfolio-data";

function ReelCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <div className="group relative flex h-[400px] w-[340px] sm:w-[400px] shrink-0 flex-col rounded-2xl border border-white/10 bg-gray-900/80 p-6 backdrop-blur-sm transition-all duration-500 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Project number */}
      <div className="absolute top-4 right-5 text-6xl font-black text-white/[0.03] select-none">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        <FolderOpen className="h-6 w-6 text-indigo-400" />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-bold text-white">
        {project.title}
      </h3>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-3">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-gray-400 ring-1 ring-white/10"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-gray-500 ring-1 ring-white/10">
            +{project.technologies.length - 4}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-indigo-500"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white"
          >
            <Github className="h-3.5 w-3.5" />
            Code
          </a>
        )}
      </div>
    </div>
  );
}

export default function ProjectReel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map vertical scroll to horizontal movement
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(projects.length - 1) * 25}%`]
  );

  return (
    <section id="projects" className="relative bg-gray-950">
      {/* Pinned scroll container - height determines scroll length */}
      <div ref={containerRef} style={{ height: `${projects.length * 80}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          {/* Header */}
          <div className="mb-8 px-6 sm:px-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Featured{" "}
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Projects
                  </span>
                </h2>
                <p className="mt-2 text-gray-400 text-sm sm:text-base">
                  Scroll to explore my work
                </p>
              </div>

              {/* Scroll progress */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                  />
                </div>
                <motion.span className="text-xs text-gray-500 font-mono tabular-nums">
                  <ArrowRight className="h-3 w-3 inline" />
                </motion.span>
              </div>
            </div>
          </div>

          {/* Horizontal scroll reel */}
          <motion.div
            style={{ x }}
            className="flex gap-6 px-6 sm:px-12"
          >
            {projects.map((project, i) => (
              <ReelCard key={project.id} project={project} index={i} />
            ))}

            {/* End card */}
            <div className="flex h-[400px] w-[300px] shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6">
              <p className="mb-3 text-lg font-semibold text-gray-400">
                Want to see more?
              </p>
              <a
                href="https://github.com/pintu544"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white"
              >
                <Github className="h-4 w-4" />
                View GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
