import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Star, ExternalLink, Github, Filter, ArrowUpRight, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "./Section";
import { PROJECTS, fadeUp } from "@/data/portfolio";
import { track } from "@/lib/analytics";

function ProjectDetailModal({ project, open, onClose }: { project: typeof PROJECTS[0] | null; open: boolean; onClose: () => void }) {
  if (!project) return null;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg bg-card border-border p-0 overflow-hidden">
        <div className="terminal-header">
          <div className="terminal-dot terminal-dot-red" />
          <div className="terminal-dot terminal-dot-yellow" />
          <div className="terminal-dot terminal-dot-green" />
          <span className="text-xs text-muted-foreground font-mono ml-2">README.md — {project.title}</span>
        </div>
        <div className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg text-foreground flex items-center gap-2">
              <Code size={16} className="text-primary" /> {project.title}
              {project.featured && (
                <span className="ml-2 flex items-center gap-1 font-mono text-[10px] text-accent border border-accent/30 bg-accent/10 rounded-full px-2 py-0.5">
                  <Star size={10} /> featured
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground leading-relaxed">{project.longDescription}</p>
          <div className="flex gap-1.5 flex-wrap">
            {project.tags.map((t) => (
              <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">{t}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 pt-3 border-t border-border items-center">
            <Button asChild variant="luxury" size="sm" className="h-8 px-4">
              <Link
                to={`/projects/${project.slug}`}
                onClick={() => { track("case_study_open", { project: project.slug, surface: "modal" }); onClose(); }}
              >
                <BookOpen size={12} /> read case study
              </Link>
            </Button>
            <a href={project.github} target="_blank" rel="noreferrer"
              onClick={() => track("project_link_click", { project: project.slug, target: "source", surface: "modal" })}
              className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Github size={12} /> source
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer"
                onClick={() => track("project_link_click", { project: project.slug, target: "live", surface: "modal" })}
                className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink size={12} /> live demo
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const categoryGlowColors: Record<string, string> = {
  Web: "hover:shadow-[0_0_25px_hsl(var(--terminal-cyan)/0.15)]",
  Python: "hover:shadow-[0_0_25px_hsl(var(--terminal-yellow)/0.15)]",
  Data: "hover:shadow-[0_0_25px_hsl(var(--terminal-purple)/0.15)]",
};

const categoryBorderColors: Record<string, string> = {
  Web: "hover:border-terminal-cyan/40",
  Python: "hover:border-terminal-yellow/40",
  Data: "hover:border-terminal-purple/40",
};

export function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const projectCategories = ["All", ...Array.from(new Set(PROJECTS.map(p => p.category)))];

  const categoryGradients: Record<string, string> = {
    Web: "from-terminal-cyan/5 to-terminal-blue/5",
    Python: "from-terminal-yellow/5 to-terminal-green/5",
    Data: "from-terminal-purple/5 to-terminal-red/5",
  };
  const categoryHeaderGradients: Record<string, string> = {
    Web: "from-terminal-cyan/20 to-terminal-blue/10",
    Python: "from-terminal-yellow/20 to-terminal-green/10",
    Data: "from-terminal-purple/20 to-terminal-red/10",
  };

  const filteredProjects = activeFilter === "All" ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <Section id="projects">
      <div className="max-w-5xl mx-auto">
        <span className="section-label">Selected Work</span>
        <SectionHeading
          number="05"
          eyebrow="projects"
          title="selected work"
          accent="selected"
          meta="ls -la ~/work"
        />


        <motion.div variants={fadeUp} custom={1} className="flex flex-wrap gap-2 mb-8">
          {projectCategories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className={`font-mono text-[11px] px-3 py-1.5 rounded border transition-all duration-200 ripple-btn ${
                activeFilter === cat ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}>
              {cat === "All" ? <><Filter size={10} className="inline mr-1" />all</> : cat.toLowerCase()}
            </button>
          ))}
        </motion.div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.map((p, i) => {
              const isLeadStory = p.featured && activeFilter === "All";
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.7, delay: Math.min(i * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
                  className={`${isLeadStory ? "sm:col-span-2 lg:col-span-3" : ""} cursor-pointer group`}
                  onClick={() => { track("project_card_open", { project: p.slug }); setSelectedProject(p); }}
                >
                  <article
                    className={`h-full border border-border/80 rounded-lg bg-card flex flex-col overflow-hidden transition-[border-color,box-shadow] duration-700 ease-out hover:border-primary/40 hover:shadow-[0_0_60px_hsl(var(--primary)/0.08),0_20px_60px_-20px_hsl(0_0%_0%/0.6)] ${isLeadStory ? "md:flex-row" : ""}`}
                  >
                    <div className={`relative ken-burns ${isLeadStory ? "md:w-2/5 min-h-[220px]" : "h-28"} bg-gradient-to-br from-secondary to-muted`}>
                      <div className="absolute inset-0 dot-grid opacity-40" />
                      <div className="absolute bottom-3 left-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        {p.category}
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <ArrowUpRight size={18} className="text-primary" />
                      </div>
                      {isLeadStory && (
                        <div className="absolute top-3 left-4 font-serif italic text-xs text-primary/80">
                          Lead story
                        </div>
                      )}
                    </div>

                    <div className={`hairline-gold ${isLeadStory ? "hidden md:block md:w-px md:h-auto" : ""}`}
                      style={isLeadStory ? { background: "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.5), transparent)" } : undefined} />

                    <div className={`flex flex-col flex-1 p-6 ${isLeadStory ? "md:p-8 justify-center" : ""}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Code size={13} className="text-primary/70" />
                        <h3 className={`font-serif font-normal text-foreground leading-tight inline-block gold-underline ${isLeadStory ? "text-3xl md:text-4xl" : "text-xl"}`}>
                          {p.title}
                        </h3>
                        {p.featured && !isLeadStory && (
                          <span className="ml-auto flex items-center gap-1 font-mono text-[9px] tracking-[0.18em] uppercase text-primary/70">
                            <Star size={9} /> featured
                          </span>
                        )}
                      </div>

                      {isLeadStory && (
                        <p className="font-serif italic text-primary/80 text-lg md:text-xl leading-snug mb-4 max-w-xl">
                          “{p.outcomes?.[0] ?? p.description}”
                        </p>
                      )}

                      <p className={`text-muted-foreground leading-relaxed mb-5 ${isLeadStory ? "text-base max-w-2xl" : "text-sm flex-1"}`}>
                        {p.description}
                      </p>

                      {isLeadStory && p.metrics?.[0] && (
                        <div className="mb-5 flex items-baseline gap-3">
                          <span className="font-serif text-4xl md:text-5xl gradient-text leading-none tabular">
                            {p.metrics[0].value}
                          </span>
                          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
                            {p.metrics[0].label}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-1.5 flex-wrap mb-5">
                        {p.tags.map((t) => (
                          <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-border/80 text-muted-foreground tracking-wide">{t}</span>
                        ))}
                      </div>

                      <div className="flex gap-5 pt-4 border-t border-border/60 items-center flex-wrap">
                        <Link
                          to={`/projects/${p.slug}`}
                          onClick={(e) => { e.stopPropagation(); track("case_study_open", { project: p.slug, surface: "card" }); }}
                          onMouseEnter={() => { import("@/pages/ProjectCaseStudy").catch(() => {}); }}
                          className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-primary hover:text-primary-glow transition-colors duration-500"
                        >
                          <BookOpen size={12} /> case study
                        </Link>
                        <a href={p.github} target="_blank" rel="noreferrer"
                          onClick={(e) => { e.stopPropagation(); track("project_link_click", { project: p.slug, target: "source", surface: "card" }); }}
                          className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-500">
                          <Github size={12} /> source
                        </a>
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noreferrer"
                            onClick={(e) => { e.stopPropagation(); track("project_link_click", { project: p.slug, target: "live", surface: "card" }); }}
                            className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-muted-foreground hover:text-primary transition-colors duration-500">
                            <ExternalLink size={12} /> live
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <ProjectDetailModal project={selectedProject} open={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </Section>
  );
}
