"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Monitor, Server, Database, Cloud, Globe, Shield, Layers,
  ArrowRight, X, Maximize2, Smartphone,
} from "lucide-react";
import { projects } from "../data/portfolio-data";

// Architecture nodes for each project
interface ArchNode {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: "frontend" | "backend" | "database" | "service" | "client";
}

interface ArchConnection {
  from: string;
  to: string;
  label?: string;
}

interface ProjectArch {
  projectId: string;
  nodes: ArchNode[];
  connections: ArchConnection[];
}

const architectures: ProjectArch[] = [
  {
    projectId: "realtime-notes",
    nodes: [
      { id: "client", label: "Browser", icon: Monitor, color: "from-blue-500 to-cyan-500", category: "client" },
      { id: "next", label: "Next.js", icon: Globe, color: "from-slate-600 to-slate-400", category: "frontend" },
      { id: "mui", label: "Material UI", icon: Layers, color: "from-blue-600 to-blue-400", category: "frontend" },
      { id: "socket-client", label: "Socket.io Client", icon: Globe, color: "from-green-500 to-emerald-400", category: "frontend" },
      { id: "node", label: "Node.js + Express", icon: Server, color: "from-green-600 to-green-400", category: "backend" },
      { id: "socket-server", label: "Socket.io Server", icon: Cloud, color: "from-green-500 to-emerald-400", category: "backend" },
      { id: "jwt", label: "JWT Auth", icon: Shield, color: "from-yellow-500 to-orange-400", category: "service" },
      { id: "mongo", label: "MongoDB", icon: Database, color: "from-emerald-600 to-emerald-400", category: "database" },
    ],
    connections: [
      { from: "client", to: "next", label: "HTTP" },
      { from: "next", to: "mui" },
      { from: "next", to: "socket-client", label: "WebSocket" },
      { from: "socket-client", to: "socket-server", label: "Real-time" },
      { from: "next", to: "node", label: "REST API" },
      { from: "node", to: "jwt", label: "Verify" },
      { from: "node", to: "mongo", label: "CRUD" },
    ],
  },
  {
    projectId: "blog-platform",
    nodes: [
      { id: "client", label: "Browser", icon: Monitor, color: "from-blue-500 to-cyan-500", category: "client" },
      { id: "react", label: "React SPA", icon: Globe, color: "from-cyan-500 to-blue-400", category: "frontend" },
      { id: "node", label: "Node.js + Express", icon: Server, color: "from-green-600 to-green-400", category: "backend" },
      { id: "jwt", label: "JWT + bcrypt", icon: Shield, color: "from-yellow-500 to-orange-400", category: "service" },
      { id: "mongo", label: "MongoDB", icon: Database, color: "from-emerald-600 to-emerald-400", category: "database" },
    ],
    connections: [
      { from: "client", to: "react", label: "HTTP" },
      { from: "react", to: "node", label: "REST API" },
      { from: "node", to: "jwt", label: "Auth" },
      { from: "node", to: "mongo", label: "CRUD" },
    ],
  },
  {
    projectId: "ai-fusion",
    nodes: [
      { id: "client", label: "Browser", icon: Monitor, color: "from-blue-500 to-cyan-500", category: "client" },
      { id: "react", label: "React + Tailwind", icon: Globe, color: "from-cyan-500 to-blue-400", category: "frontend" },
      { id: "express", label: "Express API Gateway", icon: Server, color: "from-green-600 to-green-400", category: "backend" },
      { id: "ai1", label: "GPT Model", icon: Cloud, color: "from-violet-500 to-purple-400", category: "service" },
      { id: "ai2", label: "Claude Model", icon: Cloud, color: "from-orange-500 to-amber-400", category: "service" },
      { id: "mongo", label: "MongoDB", icon: Database, color: "from-emerald-600 to-emerald-400", category: "database" },
    ],
    connections: [
      { from: "client", to: "react", label: "HTTP" },
      { from: "react", to: "express", label: "REST API" },
      { from: "express", to: "ai1", label: "API Call" },
      { from: "express", to: "ai2", label: "API Call" },
      { from: "express", to: "mongo", label: "History" },
    ],
  },
  {
    projectId: "portfolio-tracker",
    nodes: [
      { id: "client", label: "Browser", icon: Monitor, color: "from-blue-500 to-cyan-500", category: "client" },
      { id: "react", label: "React + TypeScript", icon: Globe, color: "from-blue-600 to-cyan-400", category: "frontend" },
      { id: "recharts", label: "Recharts + TanStack", icon: Layers, color: "from-pink-500 to-rose-400", category: "frontend" },
      { id: "yahoo", label: "Yahoo Finance API", icon: Cloud, color: "from-purple-600 to-violet-400", category: "service" },
    ],
    connections: [
      { from: "client", to: "react", label: "HTTP" },
      { from: "react", to: "recharts" },
      { from: "react", to: "yahoo", label: "Market Data" },
    ],
  },
  {
    projectId: "stayfinder",
    nodes: [
      { id: "mobile", label: "Mobile / Desktop", icon: Smartphone, color: "from-blue-500 to-cyan-500", category: "client" },
      { id: "react", label: "React + Vite", icon: Globe, color: "from-cyan-500 to-blue-400", category: "frontend" },
      { id: "tailwind", label: "Tailwind CSS", icon: Layers, color: "from-teal-500 to-cyan-400", category: "frontend" },
    ],
    connections: [
      { from: "mobile", to: "react", label: "HTTP" },
      { from: "react", to: "tailwind" },
    ],
  },
];

const categoryPositions: Record<string, { row: number }> = {
  client: { row: 0 },
  frontend: { row: 1 },
  backend: { row: 2 },
  service: { row: 2 },
  database: { row: 3 },
};

const categoryLabels: Record<string, string> = {
  client: "Client",
  frontend: "Frontend",
  backend: "Backend",
  service: "Services",
  database: "Data Layer",
};

function ArchDiagram({ arch }: { arch: ProjectArch }) {
  // Group nodes by row
  const rows = new Map<number, ArchNode[]>();
  arch.nodes.forEach((node) => {
    const row = categoryPositions[node.category]?.row ?? 1;
    const arr = rows.get(row) || [];
    arr.push(node);
    rows.set(row, arr);
  });

  const sortedRows = Array.from(rows.entries()).sort((a, b) => a[0] - b[0]);

  return (
    <div className="space-y-6 sm:space-y-8 py-4">
      {sortedRows.map(([rowIndex, rowNodes], ri) => {
        // Get category label for this row
        const category = rowNodes[0]?.category;
        const label = categoryLabels[category] || "";

        return (
          <div key={rowIndex}>
            {/* Row label */}
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2 ml-1">
              {label}
            </p>

            {/* Nodes */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {rowNodes.map((node, ni) => {
                const Icon = node.icon;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: ri * 0.15 + ni * 0.08,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className="relative group"
                  >
                    <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-gray-900/80 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-lg`}>
                      {/* Gradient top bar */}
                      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${node.color}`} />

                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${node.color} bg-opacity-20`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-200 whitespace-nowrap">
                          {node.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Connection arrows between rows */}
            {ri < sortedRows.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: ri * 0.15 + 0.3 }}
                className="flex justify-center py-2"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-4 bg-gradient-to-b from-white/20 to-white/5" />
                  <ArrowRight className="h-3 w-3 text-gray-600 rotate-90" />
                  {/* Connection labels */}
                  <div className="flex gap-2">
                    {arch.connections
                      .filter((c) => {
                        const fromNode = arch.nodes.find((n) => n.id === c.from);
                        const toNode = arch.nodes.find((n) => n.id === c.to);
                        if (!fromNode || !toNode) return false;
                        const fromRow = categoryPositions[fromNode.category]?.row ?? 0;
                        const toRow = categoryPositions[toNode.category]?.row ?? 0;
                        return fromRow === rowIndex && toRow === sortedRows[ri + 1]?.[0];
                      })
                      .filter((c) => c.label)
                      .map((c, ci) => (
                        <span
                          key={ci}
                          className="text-[9px] text-gray-600 bg-gray-900/50 px-1.5 py-0.5 rounded-full border border-white/5"
                        >
                          {c.label}
                        </span>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectArchitecture() {
  const [selectedProject, setSelectedProject] = useState<string>(architectures[0].projectId);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const currentArch = architectures.find((a) => a.projectId === selectedProject);
  const currentProject = projects.find((p) => p.id === selectedProject);

  return (
    <section
      ref={ref}
      id="architecture"
      className="relative bg-gray-950 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-indigo-500/3 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-96 w-96 rounded-full bg-purple-500/3 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-400">
            Under the Hood
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Project{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Visual breakdown of how each project is built
          </p>
        </motion.div>

        {/* Project selector tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {architectures.map((arch) => {
            const project = projects.find((p) => p.id === arch.projectId);
            if (!project) return null;
            const isActive = selectedProject === arch.projectId;

            return (
              <button
                key={arch.projectId}
                onClick={() => setSelectedProject(arch.projectId)}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/10"
                    : "bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300"
                }`}
              >
                {project.title.length > 20
                  ? project.title.split(" ").slice(0, 2).join(" ")
                  : project.title}
              </button>
            );
          })}
        </motion.div>

        {/* Architecture diagram */}
        <AnimatePresence mode="wait">
          {currentArch && currentProject && (
            <motion.div
              key={selectedProject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden"
            >
              {/* Diagram header */}
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {currentProject.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {currentArch.nodes.length} components &middot;{" "}
                    {currentArch.connections.length} connections
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Tech badges */}
                  <div className="hidden sm:flex gap-1.5">
                    {currentProject.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-gray-400 ring-1 ring-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {currentProject.technologies.length > 3 && (
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-gray-500 ring-1 ring-white/10">
                        +{currentProject.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    aria-label={expanded ? "Collapse" : "Expand"}
                  >
                    {expanded ? <X className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Diagram body */}
              <div className={`px-5 sm:px-8 transition-all duration-300 ${expanded ? "py-8" : "py-4"}`}>
                <ArchDiagram arch={currentArch} />
              </div>

              {/* Legend */}
              <div className="border-t border-white/5 px-5 py-3 flex flex-wrap items-center gap-4 text-[10px] text-gray-600">
                <span className="uppercase tracking-wider font-medium">Legend:</span>
                {[
                  { label: "Client", color: "bg-blue-500" },
                  { label: "Frontend", color: "bg-cyan-500" },
                  { label: "Backend", color: "bg-green-500" },
                  { label: "Services", color: "bg-purple-500" },
                  { label: "Database", color: "bg-emerald-500" },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${item.color}`} />
                    {item.label}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
