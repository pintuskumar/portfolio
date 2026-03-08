"use client";

import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Github, Linkedin, Mail, ChevronDown, ExternalLink, FileDown } from "lucide-react";
import MagneticButton from "./MagneticButton";
import VoiceIntro from "./VoiceIntro";
import CurrentlyWorkingOn from "./CurrentlyWorkingOn";
import VisitorCounter from "./VisitorCounter";
import { socialLinks as socialData } from "../data/portfolio-data";

const ParticleField = lazy(() => import("./ParticleField"));

const name = "Pintu Kumar";
const roles = ["Full Stack Software Developer", "Backend Developer", "Frontend Architect", "Cloud Enthusiast"];
const tagline = "Building scalable web applications with modern technologies";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Linkedin,
  Mail,
};

const socialLinks = socialData.map((link) => ({
  icon: iconMap[link.icon] || Mail,
  href: link.url,
  label: link.name,
}));

function TypingEffect({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(word.slice(0, currentText.length + 1));
          if (currentText.length + 1 === word.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setCurrentText(word.slice(0, currentText.length - 1));
          if (currentText.length === 0) {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );
    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="inline-flex items-center">
      <span>{currentText}</span>
      <motion.span
        className="ml-0.5 inline-block w-[3px] h-[1.1em] bg-indigo-400"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: [0, 0, 1, 1] }}
      />
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.3 },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 12 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"
    >
      {/* 3D Particle field background */}
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      {/* Background gradient orbs with parallax */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ y: backgroundY }}>
        <div className="breathing-orb absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="breathing-orb-slow absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="breathing-orb-fast absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content with parallax */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 pt-20 md:pt-24 text-center"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Avatar */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6"
        >
          <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
              <Image
                src="/photo.jpg"
                alt="Pintu Kumar"
                width={112}
                height={112}
                priority
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <span className="absolute bottom-1 right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </span>
          </div>
        </motion.div>

        {/* Greeting badge */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-sm text-indigo-300 font-medium tracking-wide">
            Available for opportunities
          </span>
        </motion.div>

        {/* Animated name */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4 perspective-[1000px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {name.split("").map((letter, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              className={`inline-block ${
                letter === " "
                  ? "w-4 sm:w-6"
                  : "bg-gradient-to-b from-white via-white to-indigo-200 bg-clip-text text-transparent"
              }`}
              whileHover={{ scale: 1.2, color: "#818cf8", transition: { duration: 0.2 } }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Typing role */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0.8}
          className="text-xl sm:text-2xl md:text-3xl font-semibold text-indigo-400 mb-6 h-10"
        >
          <TypingEffect words={roles} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1.0}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {tagline}
        </motion.p>

        {/* CTA Buttons with magnetic effect */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1.2}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <MagneticButton as="a" href="#projects" className="group relative inline-flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-indigo-600 text-white font-semibold text-base sm:text-lg overflow-hidden transition-shadow hover:shadow-lg hover:shadow-indigo-500/25">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              View Projects
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </MagneticButton>

          <MagneticButton
            as="a"
            href="/PintuKumarCV.pdf"
            onClick={() => {
              fetch("/api/resume/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "download" }),
              }).catch(() => {});
            }}
            className="group inline-flex items-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl border border-slate-600 text-slate-300 font-semibold text-base sm:text-lg hover:border-indigo-500/50 hover:text-white hover:bg-indigo-500/10 transition-all duration-300"
          >
            <FileDown className="w-5 h-5 group-hover:animate-bounce" />
            Download Resume
          </MagneticButton>

          <VoiceIntro />
        </motion.div>

        {/* Social Links */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1.5}
          className="flex items-center justify-center gap-5"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <MagneticButton
              key={label}
              as="a"
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              strength={0.4}
              className="group relative p-3 rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
            >
              <Icon className="w-5 h-5" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {label}
              </span>
            </MagneticButton>
          ))}
        </motion.div>

        {/* Currently Working On */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1.8}
          className="mt-12 max-w-lg mx-auto"
        >
          <CurrentlyWorkingOn />
        </motion.div>

        {/* Visitor counter */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={2.0}
          className="mt-6 flex justify-center"
        >
          <VisitorCounter />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className="text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-slate-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
