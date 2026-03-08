"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { Briefcase, Calendar, ChevronRight, MapPin, Building2 } from "lucide-react";
import { experiences } from "../data/portfolio-data";
import type { Experience as ExperienceType } from "../types/portfolio";

function formatDate(dateStr: string): string {
  if (dateStr === "Present") return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = end === "Present" ? new Date() : new Date(end);
  const months = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`;
}

function TimelineCard({
  exp,
  index,
  isLeft,
}: {
  exp: ExperienceType;
  index: number;
  isLeft: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const isPresent = exp.endDate === "Present";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 20 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : {}
      }
      transition={{
        type: "spring",
        stiffness: 50,
        damping: 15,
        delay: 0.1,
      }}
      className="relative"
    >
      {/* Duration badge — positioned on timeline side */}
      <div
        className={`hidden md:flex absolute top-6 items-center gap-2 ${
          isLeft
            ? "right-0 translate-x-[calc(100%+2.5rem)] flex-row"
            : "left-0 -translate-x-[calc(100%+2.5rem)] flex-row-reverse"
        }`}
      >
        <div className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400 whitespace-nowrap">
          {getDuration(exp.startDate, exp.endDate)}
        </div>
      </div>

      {/* Card */}
      <div
        className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 hover:-translate-y-1 ${
          isPresent
            ? "border-purple-500/30 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-purple-950/40 shadow-lg shadow-purple-500/5"
            : "border-gray-800 bg-gray-900/70 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5"
        }`}
      >
        {/* Active indicator bar */}
        {isPresent && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 animate-gradient-text" />
        )}

        <div className="p-5 sm:p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                  isPresent
                    ? "bg-gradient-to-br from-purple-500/30 to-cyan-500/20 ring-1 ring-purple-500/30"
                    : "bg-purple-500/10 ring-1 ring-white/10"
                }`}
              >
                <Building2 className={`h-5 w-5 ${isPresent ? "text-purple-300" : "text-purple-400"}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {exp.company}
                </h3>
                {exp.location && (
                  <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {exp.location}
                  </p>
                )}
              </div>
            </div>
            {isPresent && (
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                <span className="text-[10px] font-medium text-green-400 uppercase tracking-wider">
                  Current
                </span>
              </span>
            )}
          </div>

          {/* Role + Date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
              <Briefcase className="h-3 w-3" />
              {exp.role}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
            </span>
            <span className="md:hidden inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">
              {getDuration(exp.startDate, exp.endDate)}
            </span>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed text-gray-400">
            {exp.description}
          </p>

          {/* Achievements with stagger animation */}
          <ul className="mb-5 space-y-2">
            {exp.achievements.map((achievement, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-300"
              >
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <span>{achievement}</span>
              </motion.li>
            ))}
          </ul>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5">
            {exp.technologies.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="rounded-full border border-gray-700 bg-gray-800/60 px-2.5 py-0.5 text-[10px] font-medium text-gray-300 transition-colors duration-200 hover:border-cyan-500/50 hover:text-cyan-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Hover gradient overlay */}
        <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
        </div>
      </div>
    </motion.div>
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
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800/50 md:left-1/2 md:-translate-x-1/2">
            {/* Animated fill */}
            <motion.div
              className="w-full origin-top rounded-full bg-gradient-to-b from-purple-500 via-cyan-400 to-purple-500"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline start marker */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="absolute left-4 -top-3 -translate-x-1/2 md:left-1/2 z-20"
          >
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </motion.div>

          <div className="relative space-y-12 md:space-y-16 pt-6">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={exp.id}
                  className="relative flex items-start md:items-center"
                >
                  {/* Glowing dot marker */}
                  <div className="absolute left-4 z-20 -translate-x-1/2 md:left-1/2">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="relative flex h-5 w-5"
                    >
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-40 ${
                          exp.endDate === "Present"
                            ? "animate-ping bg-green-400"
                            : "animate-ping bg-purple-400"
                        }`}
                      />
                      <span
                        className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 bg-gray-950 ${
                          exp.endDate === "Present"
                            ? "border-green-400"
                            : "border-purple-400"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            exp.endDate === "Present"
                              ? "bg-green-400"
                              : "bg-purple-400"
                          }`}
                        />
                      </span>
                    </motion.span>
                  </div>

                  {/* Connector line from dot to card (desktop only) */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className={`hidden md:block absolute top-7 h-px w-8 bg-gradient-to-r ${
                      isLeft
                        ? "right-1/2 mr-2.5 origin-right from-transparent to-purple-500/40"
                        : "left-1/2 ml-2.5 origin-left from-purple-500/40 to-transparent"
                    }`}
                  />

                  {/* Mobile: single column */}
                  <div className="ml-10 w-full md:hidden">
                    <TimelineCard exp={exp} index={index} isLeft={false} />
                  </div>

                  {/* Desktop: two-column alternating */}
                  <div className="hidden md:block md:w-1/2 md:pr-12">
                    {isLeft && <TimelineCard exp={exp} index={index} isLeft={isLeft} />}
                  </div>
                  <div className="hidden md:block md:w-1/2 md:pl-12">
                    {!isLeft && <TimelineCard exp={exp} index={index} isLeft={isLeft} />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline end marker */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="absolute left-4 -bottom-3 -translate-x-1/2 md:left-1/2 z-20"
          >
            <div className="h-4 w-4 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-gray-600" />
            </div>
          </motion.div>
        </div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 flex flex-wrap justify-center gap-8 sm:gap-12"
        >
          {[
            { label: "Years Experience", value: "3+" },
            { label: "Companies", value: String(experiences.length) },
            { label: "Technologies", value: `${new Set(experiences.flatMap((e) => e.technologies)).size}+` },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <motion.p
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              >
                {stat.value}
              </motion.p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
