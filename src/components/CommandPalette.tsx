"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Home, User, Code2, Briefcase, FolderOpen, GraduationCap,
  Mail, Github, Linkedin, ExternalLink, FileDown, X,
} from "lucide-react";
import { projects } from "../data/portfolio-data";
import { skills } from "../data/portfolio-data";

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  keywords?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items: CommandItem[] = useMemo(() => [
    // Navigation
    { id: "nav-home", label: "Home", category: "Navigation", icon: Home, action: () => scrollTo("home"), keywords: "hero top start" },
    { id: "nav-about", label: "About", category: "Navigation", icon: User, action: () => scrollTo("about"), keywords: "bio info" },
    { id: "nav-skills", label: "Skills", category: "Navigation", icon: Code2, action: () => scrollTo("skills"), keywords: "tech stack" },
    { id: "nav-experience", label: "Experience", category: "Navigation", icon: Briefcase, action: () => scrollTo("experience"), keywords: "work career jobs" },
    { id: "nav-projects", label: "Projects", category: "Navigation", icon: FolderOpen, action: () => scrollTo("projects"), keywords: "portfolio work" },
    { id: "nav-education", label: "Education", category: "Navigation", icon: GraduationCap, action: () => scrollTo("education"), keywords: "degree university" },
    { id: "nav-contact", label: "Contact", category: "Navigation", icon: Mail, action: () => scrollTo("contact"), keywords: "email message" },

    // Projects
    ...projects.map((p) => ({
      id: `project-${p.id}`,
      label: p.title,
      category: "Projects",
      icon: FolderOpen,
      action: () => p.liveUrl ? window.open(p.liveUrl, "_blank") : scrollTo("projects"),
      keywords: p.technologies.join(" "),
    })),

    // Skills
    ...skills.slice(0, 8).map((s) => ({
      id: `skill-${s.name}`,
      label: `${s.name} — ${s.level}%`,
      category: "Skills",
      icon: Code2,
      action: () => scrollTo("skills"),
      keywords: s.category,
    })),

    // Links
    { id: "link-github", label: "GitHub Profile", category: "Links", icon: Github, action: () => window.open("https://github.com/pintu544", "_blank"), keywords: "code repo" },
    { id: "link-linkedin", label: "LinkedIn Profile", category: "Links", icon: Linkedin, action: () => window.open("https://linkedin.com/in/pintukumar12", "_blank"), keywords: "connect professional" },
    { id: "link-email", label: "Send Email", category: "Links", icon: Mail, action: () => window.open("mailto:pksharmagh4@gmail.com"), keywords: "contact message" },
    { id: "link-resume", label: "Download Resume", category: "Links", icon: FileDown, action: () => window.open("/PintuKumarCV.pdf"), keywords: "cv pdf download" },
  ], []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.keywords?.toLowerCase().includes(q)
    );
  }, [query, items]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const arr = map.get(item.category) || [];
      arr.push(item);
      map.set(item.category, arr);
    });
    return map;
  }, [filtered]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  function execute(item: CommandItem) {
    setIsOpen(false);
    setQuery("");
    item.action();
  }

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleNav = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) execute(filtered[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [isOpen, selectedIndex, filtered]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector("[data-selected='true']");
    if (selected) selected.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setQuery(""); }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[99999] w-full max-w-lg mx-4"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-gray-500" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search sections, projects, skills, links..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                  style={{ cursor: "text" }}
                />
                <kbd className="hidden sm:flex items-center gap-0.5 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-gray-500">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[320px] overflow-y-auto p-2"
                data-lenis-prevent
              >
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-500">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Array.from(grouped.entries()).map(([category, categoryItems]) => (
                    <div key={category}>
                      <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                        {category}
                      </div>
                      {categoryItems.map((item) => {
                        flatIndex++;
                        const isSelected = flatIndex === selectedIndex;
                        const Icon = item.icon;
                        const idx = flatIndex;
                        return (
                          <button
                            key={item.id}
                            data-selected={isSelected}
                            onClick={() => execute(item)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-indigo-500/15 text-white"
                                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                            }`}
                          >
                            <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-indigo-400" : "text-gray-600"}`} />
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.category === "Links" && (
                              <ExternalLink className="h-3 w-3 shrink-0 text-gray-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer hints */}
              <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[10px] text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded bg-white/10 px-1 font-mono">↑↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded bg-white/10 px-1 font-mono">↵</kbd> select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white/10 px-1 font-mono">⌘K</kbd> toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
