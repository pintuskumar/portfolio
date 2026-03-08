"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ChevronDown, Target, Lightbulb, Wrench, TrendingUp,
  AlertTriangle, CheckCircle, Layers, Users, Clock,
  Zap, Shield, Globe, Database, MessageSquare, ArrowRight,
} from "lucide-react";

interface CaseStudySection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  heroStat: { value: string; label: string };
  tags: string[];
  role: string;
  duration: string;
  teamSize: string;
  sections: CaseStudySection[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "realtime-notes",
    title: "Realtime-Notes Application",
    subtitle: "A full-stack collaborative notes platform with real-time sync and enterprise-grade security",
    heroStat: { value: "< 50ms", label: "Real-time sync latency" },
    tags: ["Next.js", "Socket.io", "Node.js", "MongoDB", "JWT"],
    role: "Full Stack Developer",
    duration: "3 months",
    teamSize: "Solo project",
    sections: [
      {
        id: "problem",
        title: "The Problem",
        icon: AlertTriangle,
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Existing note-taking apps lacked real-time collaboration or required expensive subscriptions.
              Users needed a solution that combined the simplicity of basic note apps with instant sync
              across devices — without compromising on security.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Clock, label: "Sync delays of 5-30 seconds in competing apps" },
                { icon: Shield, label: "No end-to-end authentication in free alternatives" },
                { icon: Users, label: "No searchable dashboard for quick note retrieval" },
              ].map((pain, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-red-500/5 border border-red-500/10 p-3">
                  <pain.icon className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400">{pain.label}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "approach",
        title: "Approach & Process",
        icon: Lightbulb,
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              I followed a build-measure-learn cycle, starting with core CRUD operations, then layering
              real-time capabilities, and finally hardening security.
            </p>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-cyan-500/50" />
              {[
                { phase: "Phase 1", title: "Foundation", desc: "Set up Next.js with Material UI, Express.js REST API, MongoDB schema design for notes with tags, categories, and timestamps" },
                { phase: "Phase 2", title: "Real-time Layer", desc: "Integrated Socket.io for bidirectional communication. Implemented room-based architecture so each user's notes sync independently" },
                { phase: "Phase 3", title: "Security", desc: "Added JWT authentication with bcrypt password hashing, Helmet.js security headers, input validation, and rate limiting on all endpoints" },
                { phase: "Phase 4", title: "UX Polish", desc: "Built searchable dashboard with instant filtering, user profile management, and optimistic UI updates for zero-lag feel" },
              ].map((step, i) => (
                <div key={i} className="relative pl-10 pb-5 last:pb-0">
                  <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full bg-indigo-500 ring-2 ring-gray-950" />
                  <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">{step.phase}</p>
                  <p className="text-sm font-medium text-white mt-0.5">{step.title}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "solution",
        title: "Technical Solution",
        icon: Wrench,
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              The architecture separates concerns between a Next.js frontend (SSR + client-side interactivity),
              an Express API layer for CRUD and auth, and a Socket.io server for real-time events.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Globe, title: "Frontend", desc: "Next.js with Material UI components, React-Query for cache management and background refetching" },
                { icon: Database, title: "Backend", desc: "Node.js + Express RESTful API with controller/service/model separation, Mongoose ODM" },
                { icon: Zap, title: "Real-time", desc: "Socket.io with room-based architecture, auto-reconnect, and event deduplication" },
                { icon: Shield, title: "Security", desc: "JWT with refresh tokens, bcrypt (12 rounds), Helmet.js, express-validator, CORS whitelist" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "challenges",
        title: "Challenges & Solutions",
        icon: Target,
        content: (
          <div className="space-y-3">
            {[
              {
                challenge: "Socket.io connections dropping on mobile networks",
                solution: "Implemented exponential backoff reconnection with state reconciliation — on reconnect, the client fetches a diff of missed updates rather than full reload",
              },
              {
                challenge: "Race conditions when editing the same note from multiple tabs",
                solution: "Added last-write-wins with timestamps and optimistic locking. Each update carries a version number; conflicting writes prompt the user to merge",
              },
              {
                challenge: "JWT token expiry causing silent auth failures",
                solution: "Built an Axios interceptor that automatically refreshes tokens on 401 responses and retries the original request transparently",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300 font-medium">{item.challenge}</p>
                </div>
                <div className="flex items-start gap-2 ml-0.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400 leading-relaxed">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "results",
        title: "Results & Impact",
        icon: TrendingUp,
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "< 50ms", label: "Sync latency", color: "text-emerald-400" },
                { value: "100%", label: "Auth coverage", color: "text-blue-400" },
                { value: "0", label: "XSS vulnerabilities", color: "text-purple-400" },
                { value: "95+", label: "Lighthouse score", color: "text-amber-400" },
              ].map((metric, i) => (
                <div key={i} className="text-center rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                "Real-time sync with sub-50ms latency — 100x faster than competing free apps",
                "Fully authenticated with JWT + bcrypt — zero exposed endpoints",
                "Searchable dashboard lets users find notes in under 2 seconds",
                "Deployed and live with CI/CD pipeline on Netlify (frontend) and Render (backend)",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "ai-fusion",
    title: "AI Chat Fusion Platform",
    subtitle: "A unified interface to interact with multiple AI models simultaneously",
    heroStat: { value: "Multi-AI", label: "Unified chat interface" },
    tags: ["React", "Express", "MongoDB", "Tailwind", "Node.js"],
    role: "Full Stack Developer",
    duration: "2 months",
    teamSize: "Solo project",
    sections: [
      {
        id: "problem",
        title: "The Problem",
        icon: AlertTriangle,
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Users who wanted to compare AI responses had to switch between multiple tabs, copy-paste
              prompts, and manually track conversations. There was no single interface to query multiple
              AI models and compare their outputs side-by-side.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: MessageSquare, label: "Context switching between 3-5 AI tabs per query" },
                { icon: Clock, label: "Copy-pasting same prompt wastes 30+ seconds each time" },
                { icon: Database, label: "No unified history — conversations scattered across platforms" },
              ].map((pain, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-red-500/5 border border-red-500/10 p-3">
                  <pain.icon className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400">{pain.label}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "approach",
        title: "Approach & Process",
        icon: Lightbulb,
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Designed an API gateway pattern where a single Express server fans out requests to multiple
              AI providers, aggregates responses, and streams them back to a React frontend.
            </p>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-purple-500/50 to-pink-500/50" />
              {[
                { phase: "Research", title: "API Analysis", desc: "Studied OpenAI, Claude, and open-source model APIs to find common request/response patterns for a unified abstraction" },
                { phase: "Design", title: "Gateway Architecture", desc: "Built an Express middleware layer that normalizes different AI API formats into a single interface with streaming support" },
                { phase: "Build", title: "Parallel Execution", desc: "Implemented Promise.allSettled to query multiple models simultaneously, with independent streaming per model" },
                { phase: "Polish", title: "UX & History", desc: "Added syntax highlighting, code block detection, conversation history with MongoDB persistence, and mode switching" },
              ].map((step, i) => (
                <div key={i} className="relative pl-10 pb-5 last:pb-0">
                  <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full bg-violet-500 ring-2 ring-gray-950" />
                  <p className="text-[10px] text-violet-400 uppercase tracking-wider font-semibold">{step.phase}</p>
                  <p className="text-sm font-medium text-white mt-0.5">{step.title}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "solution",
        title: "Technical Solution",
        icon: Wrench,
        content: (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              The platform uses a gateway pattern: one prompt in, multiple AI responses out, all in a
              single conversation thread with persistent history.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Layers, title: "Multi-Model Gateway", desc: "Express server with adapter pattern — each AI provider has a normalized interface, making it trivial to add new models" },
                { icon: Zap, title: "Streaming Responses", desc: "Server-Sent Events stream each model's response token-by-token, so users see answers appear in real-time" },
                { icon: Globe, title: "React Frontend", desc: "Split-pane UI with Tailwind CSS, syntax highlighting for code blocks, markdown rendering, and conversation threading" },
                { icon: Database, title: "Persistent History", desc: "MongoDB stores full conversation threads with model metadata, enabling cross-session search and replay" },
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="h-4 w-4 text-violet-400" />
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "challenges",
        title: "Challenges & Solutions",
        icon: Target,
        content: (
          <div className="space-y-3">
            {[
              {
                challenge: "Different AI APIs have wildly different response formats and streaming protocols",
                solution: "Created an adapter interface — each provider implements normalize() and stream() methods, producing a unified ChatResponse type regardless of source",
              },
              {
                challenge: "Streaming multiple responses simultaneously caused UI jank",
                solution: "Implemented requestAnimationFrame-batched DOM updates and virtualized the chat container for conversations with 100+ messages",
              },
              {
                challenge: "API rate limits varied per provider, causing partial failures",
                solution: "Used Promise.allSettled instead of Promise.all, so one model's failure doesn't block others. Failed responses show a retry button",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300 font-medium">{item.challenge}</p>
                </div>
                <div className="flex items-start gap-2 ml-0.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400 leading-relaxed">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "results",
        title: "Results & Impact",
        icon: TrendingUp,
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "3+", label: "AI models unified", color: "text-violet-400" },
                { value: "1x", label: "Prompt, multi-response", color: "text-blue-400" },
                { value: "< 200ms", label: "Time to first token", color: "text-emerald-400" },
                { value: "100%", label: "Chat history retained", color: "text-amber-400" },
              ].map((metric, i) => (
                <div key={i} className="text-center rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {[
                "Eliminated context-switching — users compare AI responses in a single view",
                "Streaming architecture delivers first tokens in under 200ms per model",
                "Adapter pattern makes adding a new AI model a ~30-line change",
                "Full conversation history with search across all models and sessions",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },
];

function AccordionItem({
  section,
  isOpen,
  onToggle,
}: {
  section: CaseStudySection;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = section.icon;

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isOpen ? "bg-indigo-500/20 ring-1 ring-indigo-500/30" : "bg-white/5"
          }`}>
            <Icon className={`h-4 w-4 ${isOpen ? "text-indigo-400" : "text-gray-500"}`} />
          </div>
          <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-white" : "text-gray-400"}`}>
            {section.title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`h-4 w-4 ${isOpen ? "text-indigo-400" : "text-gray-600"}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              {section.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["problem"]));

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (openSections.size === study.sections.length) {
      setOpenSections(new Set());
    } else {
      setOpenSections(new Set(study.sections.map((s) => s.id)));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
    >
      {/* Case study header */}
      <div className="relative overflow-hidden px-6 py-8 sm:px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />

        <div className="relative">
          {/* Hero stat */}
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 mb-5"
          >
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">{study.heroStat.value}</span>
            <span className="text-xs text-emerald-400/70">{study.heroStat.label}</span>
          </motion.div>

          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {study.title}
          </h3>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-5">
            {study.subtitle}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400 ring-1 ring-white/10">
              <Users className="h-3 w-3" />
              {study.role}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400 ring-1 ring-white/10">
              <Clock className="h-3 w-3" />
              {study.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400 ring-1 ring-white/10">
              <Layers className="h-3 w-3" />
              {study.teamSize}
            </span>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-300 ring-1 ring-indigo-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expand/Collapse toggle */}
      <div className="flex items-center justify-between border-t border-b border-white/5 px-5 py-2">
        <span className="text-[10px] text-gray-600 uppercase tracking-wider">
          {openSections.size} of {study.sections.length} sections open
        </span>
        <button
          onClick={expandAll}
          className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
        >
          {openSections.size === study.sections.length ? "Collapse All" : "Expand All"}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Accordion sections */}
      <div>
        {study.sections.map((section) => (
          <AccordionItem
            key={section.id}
            section={section}
            isOpen={openSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function CaseStudies() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="case-studies"
      className="relative bg-gray-950 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 right-0 h-96 w-96 translate-x-1/2 rounded-full bg-indigo-500/3 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/3 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
            Deep Dive
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Case{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Studies
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            A detailed look at how I approach and solve complex engineering problems
          </p>
        </motion.div>

        {/* Case study cards */}
        <div className="space-y-10">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
