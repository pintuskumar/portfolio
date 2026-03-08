"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Briefcase, Code2, Rocket, Users } from "lucide-react";
import "../lib/gsap-init";
import TextReveal from "./TextReveal";
import CodeSnippet from "./CodeSnippet";

const stats = [
  { icon: Briefcase, value: 3, suffix: "+", label: "Years Experience" },
  { icon: Rocket, value: 10, suffix: "+", label: "Projects Delivered" },
  { icon: Users, value: 10, suffix: "K+", label: "Users Served" },
  { icon: Code2, value: 4, suffix: "", label: "Companies" },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current || !spanRef.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      if (spanRef.current) {
        spanRef.current.textContent = `${Math.floor(eased * value)}${suffix}`;
      }
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, value, suffix]);

  return (
    <span ref={spanRef}>
      0{suffix}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* Parallax gradient background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]" />
        <div className="breathing-orb absolute top-1/4 left-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="breathing-orb-slow absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-3xl" />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-16"
        >
          {/* Section heading */}
          <motion.div variants={itemVariants} className="text-center">
            <span className="mb-4 inline-block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-sm font-semibold uppercase tracking-widest text-transparent">
              About Me
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl neon-glow">
              Turning Ideas Into{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent neon-glow-purple">
                Digital Reality
              </span>
            </h2>
          </motion.div>

          {/* Introduction paragraph with text reveal */}
          <TextReveal
            as="p"
            className="max-w-3xl text-center text-lg leading-relaxed text-zinc-400 sm:text-xl"
            stagger={0.03}
          >
            I&apos;m Pintu Kumar, a passionate Full Stack Developer with 3+ years of experience specializing in React, Node.js, and cloud technologies. With experience across healthcare, logistics, e-commerce, and security domains, I build performant, scalable applications that solve real-world problems.
          </TextReveal>

          {/* Animated code snippet */}
          <motion.div variants={itemVariants} className="w-full">
            <CodeSnippet />
          </motion.div>

          {/* Stats grid with animated counters */}
          <motion.div
            variants={containerVariants}
            className="grid w-full grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:grid-cols-4"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { type: "spring" as const, stiffness: 300 } }}
                  className="group relative rounded-2xl p-px"
                >
                  {/* Gradient border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Card content */}
                  <div className="relative flex flex-col items-center gap-3 rounded-2xl bg-zinc-900/90 px-3 py-6 backdrop-blur-sm transition-colors duration-300 group-hover:bg-zinc-900/70 sm:px-6 sm:py-10 glass-card neon-box-glow">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500/20 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
                    </span>
                    <span className="text-sm font-medium text-zinc-400 sm:text-base">
                      {stat.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
