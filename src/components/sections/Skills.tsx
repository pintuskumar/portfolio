import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView as useMotionInView } from "framer-motion";
import { Filter } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { SKILLS, fadeUp, stagger } from "@/data/portfolio";
import { SkillRadarChart } from "./SkillRadarChart";

export function Skills() {
  const ref = useRef(null);
  const isInView = useMotionInView(ref, { once: true, margin: "-80px" });
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const categories = ["All", ...Array.from(new Set(SKILLS.map(s => s.category)))];
  const categoryColors: Record<string, string> = {
    Language: "text-terminal-cyan", Framework: "text-terminal-purple",
    Database: "text-terminal-yellow", Tools: "text-terminal-green",
    Frontend: "text-terminal-blue", Backend: "text-terminal-cyan", Data: "text-terminal-red",
    DevOps: "text-terminal-yellow",
  };
  const categoryBgColors: Record<string, string> = {
    Language: "bg-terminal-cyan/10 border-terminal-cyan/30",
    Framework: "bg-terminal-purple/10 border-terminal-purple/30",
    Database: "bg-terminal-yellow/10 border-terminal-yellow/30",
    Tools: "bg-terminal-green/10 border-terminal-green/30",
    Frontend: "bg-terminal-blue/10 border-terminal-blue/30",
    Backend: "bg-terminal-cyan/10 border-terminal-cyan/30",
    Data: "bg-terminal-red/10 border-terminal-red/30",
    DevOps: "bg-terminal-yellow/10 border-terminal-yellow/30",
  };

  const filteredSkills = activeFilter === "All" ? SKILLS : SKILLS.filter(s => s.category === activeFilter);
  const maxLevel = Math.max(...SKILLS.map(s => s.level));

  return (
    <Section id="skills">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <SectionHeading
          number="02"
          eyebrow="skills"
          title="the toolkit"
          accent="toolkit"
          meta="stack --list"
        />

        <motion.div variants={fadeUp} custom={1} className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className={`font-mono text-[11px] px-3 py-1.5 rounded border transition-all duration-200 ${
                activeFilter === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}>
              {cat === "All" ? (
                <><Filter size={10} className="inline mr-1" />all <span className="ml-1 px-1.5 py-0 rounded-full bg-muted text-[9px] text-muted-foreground">{SKILLS.length}</span></>
              ) : (
                <>● {cat.toLowerCase()} <span className="ml-1 px-1.5 py-0 rounded-full bg-muted text-[9px] text-muted-foreground">{SKILLS.filter(s => s.category === cat).length}</span></>
              )}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-[1fr_280px] gap-8 items-start">
          <motion.div layout variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, i) => (
                <motion.div key={skill.name} layout
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => setExpandedSkill(expandedSkill === skill.name ? null : skill.name)}
                  className={`relative border rounded-lg p-4 text-center cursor-pointer transition-all duration-300
                    ${categoryBgColors[skill.category] || "bg-secondary border-border"}
                    ${hoveredSkill === skill.name ? "scale-105 shadow-lg" : ""}
                    ${hoveredSkill && hoveredSkill !== skill.name ? "opacity-40" : "opacity-100"}
                  `}>
                  {skill.level === maxLevel && (
                    <div className="absolute top-2 right-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green"></span>
                      </span>
                    </div>
                  )}
                  <skill.icon size={20} className={`mx-auto mb-2 ${categoryColors[skill.category] || "text-foreground"}`} />
                  <p className="font-mono text-xs font-medium text-foreground mb-1">{skill.name}</p>
                  <div className="relative w-full h-1.5 rounded-full bg-background/50 overflow-hidden group">
                    <motion.div className="h-full rounded-full skill-progress-shimmer"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    />
                    {/* Hover tooltip */}
                    {hoveredSkill === skill.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-foreground text-background text-[9px] font-mono whitespace-nowrap z-10"
                      >
                        {skill.level}%
                      </motion.div>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground mt-1">{isInView ? skill.level : 0}%</p>
                  <AnimatePresence>
                    {expandedSkill === skill.name && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2 pt-2 border-t border-border/50">
                        <p className="font-mono text-[9px] text-muted-foreground mb-1">Used in:</p>
                        {skill.relatedProjects.map(p => (
                          <span key={p} className="inline-block font-mono text-[9px] text-primary bg-primary/5 rounded px-1.5 py-0.5 mr-1 mb-1">{p}</span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="hidden md:block terminal-window terminal-window-hover sticky top-24">
            <div className="terminal-header">
              <div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" />
              <span className="text-xs text-muted-foreground font-mono ml-2">radar.svg</span>
            </div>
            <div className="p-4">
              <SkillRadarChart skills={SKILLS} animate={isInView} />
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
