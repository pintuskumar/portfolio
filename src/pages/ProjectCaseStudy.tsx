import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Github, ExternalLink, Star, Code, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PROJECTS, PROFILE } from "@/data/portfolio";
import ScreenshotGallery from "@/components/sections/ScreenshotGallery";
import MetricsStrip from "@/components/sections/MetricsStrip";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/components/SEO";
import { track } from "@/lib/analytics";

export default function ProjectCaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  const project = idx === -1 ? null : PROJECTS[idx];

  useEffect(() => {
    if (project) track("page_view", { page: "case_study", project: project.slug });
  }, [project]);

  if (!project) return <Navigate to="/" replace />;

  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const projectUrl = `${SITE_URL}/projects/${project.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.longDescription,
      url: projectUrl,
      image: project.screenshots?.[0]?.src,
      author: {
        "@type": "Person",
        name: PROFILE.name,
        url: SITE_URL || "/",
      },
      keywords: project.tags.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL || "/" },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/#projects` },
        { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${project.title} — ${project.role}`}
        description={project.longDescription}
        canonical={projectUrl}
        image={project.screenshots?.[0]?.src}
        type="article"
        jsonLd={jsonLd}
      />
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">~</Link>
          <span className="mx-1">/</span>
          <Link to="/#projects" className="hover:text-primary transition-colors">projects</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">{project.slug}</span>
        </nav>

        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary mb-10 transition-colors"
        >
          <ArrowLeft size={14} /> {t("projects.backToProjects")}
        </Link>

        {/* Hero — editorial */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 pb-10 border-b border-border/60"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="section-heading-eyebrow">
              <Code size={12} />
              <span>{project.category}</span>
            </span>
            {project.featured && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-accent border border-accent/30 bg-accent/10 rounded-full px-2 py-0.5">
                <Star size={10} /> featured
              </span>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold mb-6 text-balance leading-[1.02] tracking-tight">
            <span className="gradient-text">{project.title}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-prose text-pretty">
            {project.longDescription}
          </p>

          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-xs mb-8 pt-6 border-t border-border/60">
            <div>
              <dt className="text-muted-foreground/70 uppercase tracking-[0.18em] text-[10px] mb-1.5">{t("projects.role")}</dt>
              <dd className="text-foreground">{project.role}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground/70 uppercase tracking-[0.18em] text-[10px] mb-1.5">{t("projects.duration")}</dt>
              <dd className="text-foreground">{project.duration}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-muted-foreground/70 uppercase tracking-[0.18em] text-[10px] mb-1.5">stack</dt>
              <dd className="flex gap-1.5 flex-wrap">
                {project.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border/60"
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div className="flex gap-3 flex-wrap">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("project_link_click", { project: project.slug, target: "source", surface: "case_study" })}
              className="inline-flex items-center gap-2 font-mono text-xs h-10 px-4 rounded-md border border-border/80 hover:border-primary/40 hover:text-primary transition-all active:scale-[0.98]"
            >
              <Github size={14} /> {t("projects.source")}
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("project_link_click", { project: project.slug, target: "live", surface: "case_study" })}
                className="btn-luxury inline-flex items-center gap-2 font-mono text-xs h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <ExternalLink size={14} /> {t("projects.live")}
              </a>
            )}
          </div>
        </motion.header>

        {/* Outcome metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <MetricsStrip metrics={project.metrics} />
        )}

        {/* Problem */}
        <Section heading={t("projects.problem")} prompt="problem.md">
          <p className="text-base text-muted-foreground leading-relaxed max-w-prose text-pretty">{project.problem}</p>
        </Section>

        {/* Approach */}
        <Section heading={t("projects.approach")} prompt="approach.md">
          <p className="text-base text-muted-foreground leading-relaxed max-w-prose text-pretty">{project.approach}</p>
        </Section>

        {/* Tech decisions — as definition list */}
        <Section heading={t("projects.techDecisions")} prompt="stack.json">
          <dl className="surface-card divide-y divide-border/60 rounded-xl border border-border/60 overflow-hidden bg-card/40">
            {project.techDecisions.map((d) => (
              <div key={d.tech} className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-4 px-5 py-4">
                <dt className="font-mono text-xs text-primary self-start pt-0.5">{d.tech}</dt>
                <dd className="text-sm text-muted-foreground leading-relaxed text-pretty">{d.reason}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Screenshots */}
        {project.screenshots && project.screenshots.length > 0 && (
          <Section heading={t("projects.screenshots")} prompt="screenshots/">
            <ScreenshotGallery items={project.screenshots} />
          </Section>
        )}

        {/* Outcomes */}
        <Section heading={t("projects.outcomes")} prompt="outcomes.log">
          <ul className="space-y-3 border-l-2 border-terminal-green/30 pl-5">
            {project.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed text-pretty">
                <CheckCircle2 size={18} className="text-terminal-green mt-0.5 flex-shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Next project */}
        <div className="mt-20 pt-8 border-t border-border/60">
          <Link
            to={`/projects/${next.slug}`}
            className="surface-card group flex items-center justify-between gap-4 p-5 rounded-xl border border-border/60 hover:border-primary/40 transition-all"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-1.5">
                {t("projects.nextProject")}
              </div>
              <div className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                {next.title}
              </div>
            </div>
            <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({ heading, prompt, children }: { heading: string; prompt: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="mb-14"
    >
      <div className="section-heading-sticky bg-background/80 backdrop-blur-sm py-2 mb-5">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-tight">{heading}</h2>
          <span className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">{prompt}</span>
        </div>
      </div>
      {children}
    </motion.section>
  );
}
