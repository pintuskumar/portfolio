"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github, FolderOpen, Eye } from "lucide-react";
import { projects } from "../data/portfolio-data";
import { useViewCounts } from "../hooks/useViewCounts";

function ProjectCard({
  project,
  index,
  views,
}: {
  project: (typeof projects)[number];
  index: number;
  views: number | null;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateY(${mousePos.x * 0.5}deg) rotateX(${-mousePos.y * 0.5}deg)`
          : "perspective(1000px) rotateY(0deg) rotateX(0deg)",
        transition: isHovered ? "none" : "transform 0.5s ease",
      }}
      className="group relative rounded-2xl"
    >
      {/* Spotlight effect following cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${(mousePos.x / 20 + 0.5) * 100}% ${(mousePos.y / 20 + 0.5) * 100}%, rgba(99, 102, 241, 0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Gradient accent border */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-cyan-500/30 opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Card content */}
      <div className="relative flex h-full flex-col rounded-2xl bg-gray-900/90 p-6 backdrop-blur-sm transition-colors duration-300 group-hover:bg-gray-900/95">
        {/* Project number + views */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          <span className="text-5xl font-black text-white/[0.03] select-none">
            {String(index + 1).padStart(2, "0")}
          </span>
          {views !== null && (
            <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
              <Eye className="h-3 w-3" />
              {views}
            </span>
          )}
        </div>

        {/* Hover gradient overlay */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Icon + Title */}
        <div className="relative z-10 mb-3 flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10"
          >
            <FolderOpen className="h-5 w-5 text-blue-400" />
          </motion.div>
          <h3 className="text-lg font-bold leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              {project.title}
            </span>
          </h3>
        </div>

        {/* Description */}
        <p className="relative z-10 mb-5 flex-1 text-sm leading-relaxed text-gray-400">
          {project.description}
        </p>

        {/* Technology tags */}
        <div className="relative z-10 mb-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-300 ring-1 ring-white/10 transition-all duration-200 hover:bg-white/10 hover:text-white hover:ring-white/20 hover:scale-105"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="relative z-10 flex items-center gap-3">
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40 hover:brightness-110"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </motion.a>
          )}
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:text-white hover:ring-white/20"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const viewCounts = useViewCounts(projects.map((p) => p.id));

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-950 py-24 sm:py-32"
    >
      {/* Background decorative blurs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-0 h-[600px] w-[600px] translate-x-1/2 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
            A selection of projects that showcase my skills in building
            full-stack, production-ready applications.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} views={viewCounts[project.id] ?? null} />
          ))}
        </div>
      </div>
    </section>
  );
}
