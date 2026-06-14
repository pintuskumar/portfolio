import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { GitBranch } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { EXPERIENCE, BRANCH_COLORS, fadeUp } from "@/data/portfolio";
import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Experience() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="experience">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          number="03"
          eyebrow="experience"
          title="the journey"
          accent="journey"
          meta="git log --graph"
        />

        <div className="relative pl-10" ref={timelineRef}>
          <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-border/30" />
          <motion.div
            className="absolute left-[19px] top-0 w-[2px] origin-top"
            style={{
              height: lineHeight,
              background: "linear-gradient(to bottom, hsl(var(--primary) / 0.6), hsl(var(--terminal-purple) / 0.3), hsl(var(--primary) / 0.1))",
            }}
          />
          <div className="space-y-6">
            <TooltipProvider delayDuration={300}>
              {EXPERIENCE.map((exp, i) => {
                const branchColor = BRANCH_COLORS[exp.branch] || BRANCH_COLORS.main;
                return (
                  <motion.div key={i} variants={fadeUp} custom={i} className="relative cursor-pointer"
                    onClick={() => setExpanded(expanded === i ? null : i)}>
                    <div className="absolute -left-10 top-3 flex items-center justify-center">
                      <motion.div className="w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center z-10"
                        whileInView={{ scale: [0.5, 1.2, 1] }} viewport={{ once: true }} transition={{ delay: i * 0.15 + 0.3, duration: 0.5, ease: "easeOut" }}>
                        <motion.div
                          className="w-2 h-2 rounded-full bg-primary"
                          whileInView={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 0 8px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0)"] }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.15 + 0.5, duration: 0.8 }}
                        />
                      </motion.div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="font-mono text-xs space-y-1 p-4 rounded border border-border bg-card hover:border-primary/30 transition-colors">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-accent">{exp.hash}</span>
                            <span className={`branch-badge ${branchColor.text} ${branchColor.bg} ${branchColor.border}`}>
                              <GitBranch size={10} /> {exp.branch}
                            </span>
                            <span className="text-muted-foreground">{exp.duration}</span>
                          </div>
                          <div className="text-foreground text-sm font-semibold">{exp.position}</div>
                          <div className="text-muted-foreground">{exp.company}</div>
                          <AnimatePresence>
                            {expanded === i && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                <div className="mt-3 pt-3 border-t border-border">
                                  <div className="text-terminal-green mb-1">+ diff --git</div>
                                  <div className="text-muted-foreground leading-relaxed">{exp.summary}</div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="text-muted-foreground/50 text-[10px] mt-1">
                            {expanded === i ? "click to collapse" : "click to show diff"}
                          </div>
                        </div>
                      </TooltipTrigger>
                      {expanded !== i && (
                        <TooltipContent side="right" className="max-w-xs font-mono text-xs hidden md:block">
                          <p className="text-muted-foreground">{exp.summary}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </motion.div>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </Section>
  );
}
