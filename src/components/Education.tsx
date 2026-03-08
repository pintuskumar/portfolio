"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Award, ExternalLink, ChevronRight, Trophy } from "lucide-react";
import { education, verifiedCertificateLinks, achievements } from "../data/portfolio-data";

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 16,
        duration: 0.8,
      },
    },
  };

  const certVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 60,
        damping: 16,
        delay: 0.3 + i * 0.15,
      },
    }),
  };

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative min-h-screen bg-gray-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-0 h-96 w-96 translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />
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
            Learning &amp; Growth
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Education &amp;{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Certifications
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            My academic foundation and verified professional certifications.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-10 lg:grid-cols-2"
        >
          {/* Left column - Education */}
          <div>
            <motion.h3
              variants={cardVariants}
              className="mb-6 flex items-center gap-2 text-xl font-semibold text-white"
            >
              <GraduationCap className="h-6 w-6 text-purple-400" />
              Education
            </motion.h3>

            {education.map((edu) => (
              <motion.div
                key={edu.id}
                variants={cardVariants}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/30 via-gray-800 to-cyan-500/30"
              >
                <div className="relative rounded-2xl bg-gray-900/90 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                  {/* Icon badge */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
                    <GraduationCap className="h-6 w-6 text-purple-400" />
                  </div>

                  {/* School name */}
                  <h4 className="mb-1 text-xl font-semibold text-white">
                    {edu.school}
                  </h4>

                  {/* Degree */}
                  <p className="mb-1 text-base text-gray-300">
                    {edu.degree} in {edu.field}
                  </p>

                  {/* Duration */}
                  <p className="mb-4 text-sm text-gray-500">{edu.duration}</p>

                  {/* Achievements */}
                  <ul className="space-y-2">
                    {edu.achievements?.map((achievement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Hover gradient overlay */}
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right column - Certifications */}
          <div>
            <motion.h3
              variants={cardVariants}
              className="mb-6 flex items-center gap-2 text-xl font-semibold text-white"
            >
              <Award className="h-6 w-6 text-cyan-400" />
              Certifications
            </motion.h3>

            <div className="space-y-4">
              {verifiedCertificateLinks.map((cert, index) => (
                <motion.a
                  key={cert.name}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={index}
                  variants={certVariants}
                  className="group relative block rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-gray-800 to-purple-500/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative flex items-center gap-4 rounded-2xl bg-gray-900/90 p-5 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
                    {/* Icon badge */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20 transition-colors duration-300 group-hover:bg-cyan-500/20">
                      <Award className="h-5 w-5 text-cyan-400" />
                    </div>

                    {/* Certificate info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-semibold text-white transition-colors duration-200 group-hover:text-cyan-300">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-gray-400">{cert.provider}</p>
                    </div>

                    {/* External link icon */}
                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-500 transition-colors duration-200 group-hover:text-cyan-400" />

                    {/* Hover gradient overlay */}
                    <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Achievements */}
            {achievements.length > 0 && (
              <>
                <motion.h3
                  variants={cardVariants}
                  className="mt-8 mb-4 flex items-center gap-2 text-xl font-semibold text-white"
                >
                  <Trophy className="h-6 w-6 text-amber-400" />
                  Achievements
                </motion.h3>

                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={certVariants}
                      className="flex items-start gap-3 rounded-xl border border-amber-500/10 bg-amber-500/5 p-4"
                    >
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <p className="text-sm text-gray-300">{achievement}</p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
