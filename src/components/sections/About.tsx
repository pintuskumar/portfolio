import { useRef } from "react";
import { motion, useInView as useMotionInView, useScroll, useTransform } from "framer-motion";
import { Section, SectionHeading } from "./Section";
import { PROFILE, EDUCATION, fadeUp } from "@/data/portfolio";
import { useCountUp } from "@/hooks/useCountUp";
import { GitHubHeatmap } from "./GitHubHeatmap";

function ScrollHighlightText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.5"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className="drop-cap text-base md:text-lg leading-[1.75] font-sans text-foreground/85 flex flex-wrap gap-x-1.5 gap-y-0.5">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return <ScrollWord key={i} word={word} progress={scrollYProgress} range={[start, end]} />;
      })}
    </p>
  );
}

function ScrollWord({ word, progress, range }: { word: string; progress: any; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, [
    "hsl(var(--muted-foreground))",
    "hsl(var(--foreground))",
  ]);

  return (
    <motion.span style={{ opacity, color }} className="transition-none">
      {word}
    </motion.span>
  );
}

function StatCard({ label, value, max, icon, delay }: { label: string; value: string | number; max: number; icon: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useMotionInView(ref, { once: true, margin: "-40px" });
  const numericValue = typeof value === "number" ? value : 0;
  const count = useCountUp(numericValue, isInView);
  const percentage = Math.min((numericValue / max) * 100, 100);
  const isString = typeof value === "string";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="relative flex flex-col items-center p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-all group"
    >
      {/* Animated arc ring */}
      <div className="relative w-16 h-16 mb-2">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
          {!isString && (
            <motion.circle
              cx="32" cy="32" r="28" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 28}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={isInView ? { strokeDashoffset: 2 * Math.PI * 28 * (1 - percentage / 100) } : {}}
              transition={{ delay: delay + 0.3, duration: 1.2, ease: "easeOut" }}
              className="drop-shadow-[0_0_6px_hsl(var(--primary)/0.4)]"
            />
          )}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg">{icon}</span>
      </div>
      <span className="font-mono text-xl font-bold text-foreground tabular-nums">{isString ? value : count}{!isString && label === "connections" ? "+" : ""}</span>
      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
    </motion.div>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useMotionInView(ref, { once: true, margin: "-80px" });

  const bioLines = [
    { num: 1, content: <><span className="syn-comment">{"// about_me.py"}</span></> },
    { num: 2, content: <><span className="syn-keyword">class</span> <span className="syn-fn">Developer</span>:</> },
    { num: 3, content: <>&nbsp;&nbsp;<span className="syn-property">name</span> = <span className="syn-string">"{PROFILE.name}"</span></> },
    { num: 4, content: <>&nbsp;&nbsp;<span className="syn-property">location</span> = <span className="syn-string">"{PROFILE.location}"</span></> },
    { num: 5, content: <>&nbsp;&nbsp;<span className="syn-property">focus</span> = [<span className="syn-string">"Frontend"</span>, <span className="syn-string">"Backend"</span>, <span className="syn-string">"Cloud"</span>]</> },
  ];

  return (
    <Section id="about">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <SectionHeading
          number="01"
          eyebrow="about"
          title="who am I"
          accent="who"
          meta="cat ~/about.md"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={fadeUp} custom={1} className="terminal-window terminal-window-hover">
            <div className="terminal-header">
              <div className="terminal-dot terminal-dot-red" />
              <div className="terminal-dot terminal-dot-yellow" />
              <div className="terminal-dot terminal-dot-green" />
              <span className="text-xs text-muted-foreground font-mono ml-2">about_me.py</span>
            </div>
            <div className="p-4 font-mono text-xs leading-6">
              {bioLines.map((line) => (
                <div key={line.num} className="flex">
                  <span className="line-number">{line.num}</span>
                  <span>{line.content}</span>
                </div>
              ))}
            </div>
            {/* Scroll-triggered text highlight */}
            <div className="px-4 pb-4 border-t border-border pt-3">
              <div className="text-[10px] font-mono text-muted-foreground mb-2">$ cat bio.txt</div>
              <ScrollHighlightText text={PROFILE.about} />
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="followers" value={PROFILE.followers} max={1000} icon="👥" delay={0.1} />
              <StatCard label="connections" value={PROFILE.connections} max={500} icon="🔗" delay={0.2} />
              <StatCard label="projects" value={PROFILE.projects} max={10} icon="📦" delay={0.3} />
            </div>

            {/* Education */}
            <motion.div variants={fadeUp} custom={2} className="terminal-window terminal-window-hover">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" />
                <div className="terminal-dot terminal-dot-yellow" />
                <div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-muted-foreground font-mono ml-2">education.log</span>
              </div>
              <div className="p-4 font-mono text-xs">
                <div className="text-muted-foreground mb-3">$ git log --oneline education</div>
                {EDUCATION.map((ed) => (
                  <div key={ed.hash} className="flex items-start gap-2 mb-2">
                    <span className="text-accent">{ed.hash}</span>
                    <div>
                      <span className="text-foreground">{ed.degree}</span><br />
                      <span className="text-muted-foreground">{ed.school} · {ed.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <GitHubHeatmap />
      </div>
    </Section>
  );
}
