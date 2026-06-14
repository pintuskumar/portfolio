import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { ACHIEVEMENTS, fadeUp } from "@/data/portfolio";

export function Achievements() {
  return (
    <Section id="achievements">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          number="04"
          eyebrow="achievements"
          title="milestones unlocked"
          accent="unlocked"
          meta="cat ~/.achievements"
        />

        <motion.div variants={fadeUp} custom={1} className="terminal-window terminal-window-hover">
          <div className="terminal-header">
            <div className="terminal-dot terminal-dot-red" />
            <div className="terminal-dot terminal-dot-yellow" />
            <div className="terminal-dot terminal-dot-green" />
            <span className="text-xs text-muted-foreground font-mono ml-2">~/.achievements</span>
          </div>
          <div className="p-4 font-mono text-xs">
            <div className="text-muted-foreground mb-3">$ ls -la ~/.achievements/</div>
            <div className="grid gap-2">
              {ACHIEVEMENTS.map((ach, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="achievement-card flex items-center gap-3 p-3 rounded border border-border bg-secondary/30 hover:border-primary/30 hover:bg-primary/5 transition-all group relative overflow-hidden">
                  <div className="relative">
                    <ach.icon size={16} className="text-accent flex-shrink-0 group-hover:text-primary transition-all duration-300 group-hover:scale-125" />
                    <div className="achievement-shimmer absolute inset-0 -inset-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground font-medium truncate">{ach.title}</div>
                    <div className="text-muted-foreground text-[10px]">{ach.issuer} · {ach.year}</div>
                  </div>
                  {/* Verified badge on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <BadgeCheck size={12} className="text-terminal-green" />
                    <span className="text-[9px] text-terminal-green font-semibold">Verified</span>
                  </div>
                  <span className="text-muted-foreground/40 text-[10px] flex-shrink-0 group-hover:hidden">{ach.file}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 text-muted-foreground/50">
              <span className="text-terminal-green">❯</span> <span className="animate-blink text-terminal-green">█</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
