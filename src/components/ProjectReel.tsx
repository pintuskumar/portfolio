"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, FolderOpen, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { projects } from "../data/portfolio-data";

function ReelCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <div className="group relative flex h-[400px] w-[320px] sm:w-[380px] shrink-0 flex-col rounded-2xl border border-white/10 bg-gray-900/80 p-6 backdrop-blur-sm transition-all duration-500 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 snap-center">
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < maxScroll - 10);
    setScrollProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth < 640 ? 340 : 400;
    const amount = direction === "left" ? -cardWidth : cardWidth;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Enable horizontal scroll with mouse wheel on desktop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Only intercept vertical scroll when hovering over the reel
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
        const atEnd = el.scrollLeft >= maxScroll - 1 && e.deltaY > 0;

        // Let page scroll normally if at the edges
        if (atStart || atEnd) return;

        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section id="projects" className="relative bg-gray-950 overflow-hidden py-20 sm:py-24">
      <div className="max-w-7xl mx-auto">
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
              <p className="mt-2 text-gray-400 text-sm sm:text-base flex items-center gap-2">
                <span className="hidden sm:inline">Scroll sideways to explore</span>
                <span className="sm:hidden">Swipe to explore</span>
                <ArrowRight className="h-3 w-3" />
              </p>
            </div>

            {/* Progress + arrows */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  animate={{ scaleX: scrollProgress }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable container */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            data-lenis-prevent
            className="flex gap-5 sm:gap-6 overflow-x-auto px-6 sm:px-12 pb-4 snap-x snap-mandatory scrollbar-none"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            {projects.map((project, i) => (
              <ReelCard key={project.id} project={project} index={i} />
            ))}

            {/* End card */}
            <div className="flex h-[400px] w-[280px] sm:w-[300px] shrink-0 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-6 snap-center">
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
          </div>

          {/* Mobile navigation arrows */}
          <div className="sm:hidden flex justify-center gap-2 mt-4 px-6">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white disabled:opacity-30 cursor-pointer"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white disabled:opacity-30 cursor-pointer"
              aria-label="Next project"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {projects.map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/20" />
          ))}
        </div>
      </div>
    </section>
  );
}
