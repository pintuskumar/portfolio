"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { Briefcase, Calendar, ChevronRight, MapPin } from "lucide-react";
import { experiences } from "../data/portfolio-data";
import type { Experience as ExperienceType } from "../types/portfolio";

function formatDate(dateStr: string): string {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function ExperienceCard({ exp }: { exp: ExperienceType }) {
  return (
    <div className="group relative rounded-2xl border border-gray-800 bg-gray-900/70 p-4 sm:p-6 shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/40 hover:shadow-purple-500/10 hover:shadow-2xl">
      {/* Top meta row */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
          <Briefcase className="h-3.5 w-3.5" />
          {exp.role}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(exp.startDate)} &ndash; {formatDate(exp.endDate)}
        </span>
      </div>

      {/* Company name + location */}
      <h3 className="mb-1 text-xl font-semibold text-white">
        {exp.company}
      </h3>
      {exp.location && (
        <p className="mb-2 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          {exp.location}
        </p>
      )}

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-gray-400">
        {exp.description}
      </p>

      {/* Achievements */}
      <ul className="mb-5 space-y-2">
        {exp.achievements.map((achievement, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-gray-300"
          >
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>

      {/* Technology badges */}
      <div className="flex flex-wrap gap-2">
        {exp.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1 text-xs text-gray-300 transition-colors duration-200 hover:border-cyan-500/50 hover:text-cyan-300"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Decorative corner gradient visible on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
      </div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 20%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = (direction: "left" | "right") => ({
    hidden: {
      opacity: 0,
      x: direction === "left" ? -80 : 80,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 16,
        duration: 0.8,
      },
    },
  });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen bg-gray-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-400">
            Career Journey
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Professional{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            A timeline of my professional growth and the impactful products I
            have helped build.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical center line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="w-full origin-top bg-gradient-to-b from-purple-500 via-cyan-400 to-purple-500"
              style={{ height: lineHeight }}
            />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative space-y-12 md:space-y-16"
          >
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={exp.id}
                  variants={cardVariants(isLeft ? "left" : "right")}
                  className="relative flex items-start md:items-center"
                >
                  {/* Glowing dot marker */}
                  <div className="absolute left-4 z-20 -translate-x-1/2 md:left-1/2">
                    <span className="relative flex h-5 w-5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-40" />
                      <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-purple-400 bg-gray-950">
                        <span className="h-2 w-2 rounded-full bg-purple-400" />
                      </span>
                    </span>
                  </div>

                  {/* Mobile: single column, card on right of timeline */}
                  <div className="ml-10 w-full md:hidden">
                    <ExperienceCard exp={exp} />
                  </div>

                  {/* Desktop: two-column alternating */}
                  {/* Left column */}
                  <div className="hidden md:block md:w-1/2 md:pr-12">
                    {isLeft && <ExperienceCard exp={exp} />}
                  </div>

                  {/* Right column */}
                  <div className="hidden md:block md:w-1/2 md:pl-12">
                    {!isLeft && <ExperienceCard exp={exp} />}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
