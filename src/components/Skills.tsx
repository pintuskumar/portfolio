"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Code2, Server, Cloud, Wrench, Layers } from "lucide-react";
import { skills } from "../data/portfolio-data";
import { categoryGradients, categoryAccentText, categoryRing, categoryGlow } from "../lib/skill-colors";
import { gsap } from "../lib/gsap-init";
import { lazy, Suspense, Component, type ReactNode } from "react";

const SkillGlobe = lazy(() => import("./SkillGlobe"));

class GlobeErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

type Category = "All" | "Frontend" | "Backend" | "DevOps" | "Tools";

const categories: { label: Category; icon: React.ReactNode }[] = [
  { label: "All", icon: <Layers className="h-4 w-4" /> },
  { label: "Frontend", icon: <Code2 className="h-4 w-4" /> },
  { label: "Backend", icon: <Server className="h-4 w-4" /> },
  { label: "DevOps", icon: <Cloud className="h-4 w-4" /> },
  { label: "Tools", icon: <Wrench className="h-4 w-4" /> },
];


function SkillCard({
  skill,
  index,
}: {
  skill: { name: string; level: number; category: string };
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const progressRef = useRef<HTMLDivElement>(null);

  const gradient = categoryGradients[skill.category] ?? "from-gray-500 to-gray-400";
  const accent = categoryAccentText[skill.category] ?? "text-gray-400";
  const ring = categoryRing[skill.category] ?? "ring-gray-500/30";
  const glow = categoryGlow[skill.category] ?? "shadow-gray-500/20";

  useEffect(() => {
    if (!isInView || !progressRef.current) return;

    gsap.fromTo(
      progressRef.current,
      { width: "0%" },
      {
        width: `${skill.level}%`,
        duration: 1.2,
        delay: index * 0.08,
        ease: "power3.out",
      }
    );
  }, [isInView, skill.level, index]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative rounded-2xl bg-white/5 p-5 ring-1 ${ring} backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:ring-2 hover:shadow-lg ${glow}`}
    >
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{skill.name}</h3>
          <span className={`text-xs font-bold ${accent}`}>{skill.level}%</span>
        </div>

        {/* Progress bar track */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            ref={progressRef}
            style={{ width: 0 }}
            className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-sm`}
          />
        </div>

        {/* Category badge */}
        <div className="mt-3">
          <span className={`inline-block rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${accent}`}>
            {skill.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const filteredSkills = useMemo(
    () =>
      activeCategory === "All"
        ? skills
        : skills.filter((s) => s.category === activeCategory),
    [activeCategory]
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden bg-gray-950 py-24 sm:py-32"
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-purple-500/5 blur-3xl" />
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
            Skills &amp; Expertise
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
            Technologies and tools I work with to bring ideas to life.
          </p>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.label)}
              className="relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              {activeCategory === cat.label && (
                <motion.span
                  layoutId="activeSkillTab"
                  className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/20"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className={activeCategory === cat.label ? "text-white" : "text-gray-500"}>
                  {cat.icon}
                </span>
                <span className={activeCategory === cat.label ? "text-white" : "text-gray-400 hover:text-gray-300"}>
                  {cat.label}
                </span>
              </span>
            </button>
          ))}
        </motion.div>

        {/* 3D Skill Globe */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <GlobeErrorBoundary>
            <Suspense fallback={<div className="h-[280px] sm:h-[350px] md:h-[400px] flex items-center justify-center text-gray-500 text-sm">Loading 3D visualization...</div>}>
              <SkillGlobe />
            </Suspense>
          </GlobeErrorBoundary>
          <p className="text-center text-xs text-gray-600 mt-2">Drag to rotate the globe</p>
        </motion.div>

        {/* Skills grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredSkills.map((skill, i) => (
              <SkillCard key={skill.name} skill={skill} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
