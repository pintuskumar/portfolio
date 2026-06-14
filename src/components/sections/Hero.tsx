import { useRef } from "react";
import { Linkedin, Github, Download } from "lucide-react";
import { motion, useInView as useMotionInView, useScroll, useSpring, useTransform } from "framer-motion";
import { HERO_COMMANDS, PROFILE } from "@/data/portfolio";
import { useParallax } from "@/hooks/useParallax";
import { TerminalLine } from "./TerminalLine";
import { useCountUp } from "@/hooks/useCountUp";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

function SocialProofBar() {
  const ref = useRef(null);
  const isInView = useMotionInView(ref, { once: true, margin: "-40px" });
  const contributions = useCountUp(120, isInView, 1200);
  const certifications = useCountUp(4, isInView, 800);
  const projects = useCountUp(PROFILE.projects, isInView, 1000);

  return (
    <div
      ref={ref}
      className="mt-6 flex items-center gap-3 font-mono text-[10px] text-muted-foreground/60 flex-wrap animate-fade-in tabular"
      style={{ animationDelay: "1.2s", animationFillMode: "both" }}
    >
      <span className="flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-terminal-green" />
        <span className="text-foreground/70">{contributions}+</span> contributions this year
      </span>
      <span className="text-border">·</span>
      <span className="flex items-center gap-1">
        <span className="text-foreground/70">{certifications}</span> certifications
      </span>
      <span className="text-border">·</span>
      <span className="flex items-center gap-1">
        <span className="text-foreground/70">{projects}</span> projects
      </span>
    </div>
  );
}

export function Hero() {
  const scrollY = useParallax();
  const portraitRef = useRef<HTMLDivElement>(null);

  // Spring-damped portrait parallax — page-scroll driven, not scroll listener.
  const { scrollYProgress } = useScroll({
    target: portraitRef,
    offset: ["start end", "end start"],
  });
  const portraitRaw = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const portraitY = useSpring(portraitRaw, { stiffness: 90, damping: 22, mass: 0.6 });

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-20 dot-grid">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(43_56%_54%/0.07),transparent_60%)]"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      />
      <div
        className="hero-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ transform: `translate(-50%, -50%) translateY(${scrollY * -0.15}px)` }}
      />
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 w-full">
        {/* Eyebrow + hairline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-primary/80">
            Pintu&nbsp;Kumar&nbsp;— Studio
          </span>
          <span className="hairline-gold flex-1 max-w-[220px]" />
        </motion.div>

        {/* Editorial headline */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-serif text-[clamp(2.6rem,8vw,7rem)] leading-[0.95] tracking-[-0.03em] max-w-5xl hang-punct"
        >
          <span className="gold-leaf">Full stack engineering,</span>
          <br />
          <span className="italic text-foreground/95">built with </span>
          <span className="italic gradient-text">precision</span>
          <span className="text-foreground/95">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="mt-5 max-w-2xl font-sans text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          Full Stack Developer based in India — building scalable web apps,
          robust APIs, and performant frontends with React and Node.js.
        </motion.p>

        {/* Two-column: terminal + portrait */}
        <div className="mt-10 md:mt-14 flex flex-col md:flex-row items-start gap-10 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="flex-1 w-full order-2 md:order-1"
          >
            <div className="terminal-window terminal-window-hover relative">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-muted-foreground/80 font-mono ml-3">pintu@portfolio:~</span>
              </div>
              <div className="p-5 space-y-3 min-h-[180px]">
                {HERO_COMMANDS.map((c, i) => (
                  <TerminalLine key={i} command={c.cmd} output={c.output} delay={i * 2000 + 700} isLast={i === HERO_COMMANDS.length - 1} />
                ))}
              </div>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 3.6 } } }}
              className="flex gap-3 mt-6 flex-wrap"
            >
              <motion.a variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                href={PROFILE.linkedin} target="_blank" rel="noreferrer"
                onClick={() => track("social_click", { network: "linkedin", surface: "hero" })}
                className="chip-hairline">
                <Linkedin size={12} /> linkedin
              </motion.a>
              <motion.a variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                href={PROFILE.github} target="_blank" rel="noreferrer"
                onClick={() => track("social_click", { network: "github", surface: "hero" })}
                className="chip-hairline">
                <Github size={12} /> github
              </motion.a>
              <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
                <Button asChild variant="luxury" size="sm" className="h-8 px-4">
                  <a
                    href="/PintuKumarCV.pdf"
                    download
                    onClick={() => track("resume_download", { surface: "hero" })}
                  >
                    <Download size={12} /> resume.pdf
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            <SocialProofBar />
          </motion.div>

          <motion.div
            ref={portraitRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex-shrink-0 order-1 md:order-2 mx-auto md:mx-0"
            style={{ y: portraitY, willChange: "transform" }}
          >
            <div className="relative">
              <div className="editorial-frame w-44 h-44 md:w-56 md:h-56">
                <img
                  src={PROFILE.photo}
                  alt={PROFILE.name}
                  width={224}
                  height={224}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover rounded-[3px]"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 font-mono text-[10px] text-muted-foreground bg-card border border-border rounded px-2 py-1 tracking-wider">
                status: <span className="text-terminal-green">● active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
