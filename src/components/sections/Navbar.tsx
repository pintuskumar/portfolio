import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Linkedin, Github, Download, Search, Sun, Moon, Menu, User, Code, Briefcase, FolderOpen, Mail, Languages } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { track } from "@/lib/analytics";

const PALETTE_ITEMS = [
  ...NAV_LINKS.map(l => ({ type: "nav" as const, label: `cd ~/${l.label}`, href: l.href, key: l.key })),
  { type: "action" as const, label: "download resume.pdf", href: "/PintuKumarCV.pdf", key: "r" },
  { type: "link" as const, label: "open linkedin", href: PROFILE.linkedin, key: "l" },
  { type: "link" as const, label: "open github", href: PROFILE.github, key: "g" },
];

const BOTTOM_NAV_ITEMS = [
  { href: "#about", icon: User, label: "about" },
  { href: "#skills", icon: Code, label: "skills" },
  { href: "#experience", icon: Briefcase, label: "experience" },
  { href: "#projects", icon: FolderOpen, label: "projects" },
  { href: "#contact", icon: Mail, label: "contact" },
];

export function Navbar({ theme, toggleTheme }: { theme: "dark" | "light"; toggleTheme: () => void }) {
  const { i18n, t } = useTranslation();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const active = useActiveSection();
  const navRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const closeCmd = useCallback(() => setCmdOpen(false), []);
  const cmdTrapRef = useFocusTrap<HTMLDivElement>(cmdOpen, closeCmd);


  const toggleLang = () => {
    const next = i18n.language?.startsWith("hi") ? "en" : "hi";
    i18n.changeLanguage(next);
  };
  const langLabel = i18n.language?.startsWith("hi") ? "हि" : "EN";

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector(`a[href="${active}"]`) as HTMLElement | null;
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setUnderlineStyle({ left: elRect.left - navRect.left, width: elRect.width, opacity: 1 });
    } else {
      setUnderlineStyle(s => ({ ...s, opacity: 0 }));
    }
  }, [active]);

  useEffect(() => {
    if (cmdOpen) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [cmdOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); setCmdOpen(true); }
      if (e.key === "Escape") setCmdOpen(false);
      const numKey = parseInt(e.key);
      if (numKey >= 1 && numKey <= NAV_LINKS.length && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const target = document.querySelector(NAV_LINKS[numKey - 1].href);
        target?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return PALETTE_ITEMS;
    const q = search.toLowerCase();
    return PALETTE_ITEMS.filter(i => i.label.toLowerCase().includes(q));
  }, [search]);

  const handlePaletteClick = (item: typeof PALETTE_ITEMS[0]) => {
    setCmdOpen(false);
    track("palette_action", { item: item.label, kind: item.type });
    if (item.type === "nav") {
      document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
    } else if (item.type === "action") {
      track("resume_download", { surface: "palette" });
      const a = document.createElement("a");
      a.href = item.href; a.download = ""; a.click();
    } else {
      track("social_click", { network: item.label.includes("linkedin") ? "linkedin" : "github", surface: "palette" });
      window.open(item.href, "_blank");
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/80 backdrop-blur-2xl border-b border-primary/10 shadow-[0_4px_30px_hsl(var(--primary)/0.05)]"
            : "bg-transparent border-b border-border/30"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <a href="#" className="font-mono text-lg font-bold text-primary">
            <span className="text-terminal-green">~/</span>pk
          </a>
          <div className="hidden md:flex items-center gap-1 relative" ref={navRef}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href}
                className={`font-serif italic text-sm px-3 py-1.5 rounded transition-all duration-200 lowercase ${
                  active === l.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}>
                {t(`nav.${l.label}`, l.label)}
              </a>
            ))}
            <motion.div
              className="absolute bottom-0 h-[2px] bg-primary rounded-full"
              animate={underlineStyle}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleLang} className="flex items-center gap-1 px-2 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors font-mono text-[11px]" aria-label={t("nav.language")} title={t("nav.language")}>
              <Languages size={12} /><span>{langLabel}</span>
            </button>
            <button onClick={toggleTheme} className="p-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors" aria-label={t("nav.toggleTheme")}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button onClick={() => setCmdOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors font-mono" aria-label="Open navigation palette">
              <Search size={12} /><span>{t("nav.navigate")}</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded bg-secondary text-[10px] border border-border">/</kbd>
            </button>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleLang} className="px-2 py-1.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors font-mono text-[11px]" aria-label={t("nav.language")}>
              {langLabel}
            </button>
            <button onClick={toggleTheme} className="p-2 rounded border border-border text-muted-foreground hover:text-foreground transition-colors" aria-label={t("nav.toggleTheme")}>
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="text-foreground p-1" aria-label="Open menu"><Menu size={20} /></button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="font-mono text-primary text-left">
                    <span className="text-terminal-green">~/</span>navigation
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  {NAV_LINKS.map((l) => (
                    <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-3 rounded text-sm font-mono transition-colors ${
                        active === l.href ? "text-primary bg-primary/10" : "text-foreground hover:bg-primary/5 hover:text-primary"
                      }`}>
                      <span><span className="text-terminal-green mr-2">❯</span>{l.label}</span>
                      <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">{l.key}</kbd>
                    </a>
                  ))}
                </div>
                <div className="border-t border-border mt-4 pt-4 space-y-3 px-3">
                  <a href={PROFILE.linkedin} target="_blank" rel="noreferrer"
                    onClick={() => track("social_click", { network: "linkedin", surface: "mobile_menu" })}
                    className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"><Linkedin size={14} /> LinkedIn</a>
                  <a href={PROFILE.github} target="_blank" rel="noreferrer"
                    onClick={() => track("social_click", { network: "github", surface: "mobile_menu" })}
                    className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"><Github size={14} /> GitHub</a>
                  <a href="/PintuKumarCV.pdf" download
                    onClick={() => track("resume_download", { surface: "mobile_menu" })}
                    className="flex items-center gap-2 font-mono text-xs text-accent hover:text-accent/80 transition-colors"><Download size={14} /> Resume</a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.nav>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-card/95 backdrop-blur-xl border-t border-border/50 px-2 py-1.5 flex items-center justify-around">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-primary" : ""} />
                <span className="font-mono text-[9px]">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-0 w-8 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {cmdOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]"
            onClick={() => setCmdOpen(false)}>
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }} className="w-full max-w-md mx-4 terminal-window" onClick={(e) => e.stopPropagation()}
              ref={cmdTrapRef} role="dialog" aria-modal="true" aria-label="Command palette">
              <div className="terminal-header">
                <div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" />
                <span className="text-xs text-muted-foreground font-mono ml-2">navigation</span>
              </div>
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border mb-1">
                  <Search size={12} className="text-muted-foreground" />
                  <input
                    ref={searchRef}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => { if (e.key === "Escape") setCmdOpen(false); }}
                    placeholder="Search commands..."
                    className="flex-1 bg-transparent text-sm font-mono text-foreground outline-none placeholder:text-muted-foreground/50"
                  />
                </div>
                {filtered.length === 0 && (
                  <p className="px-3 py-4 text-sm font-mono text-muted-foreground text-center">No results found</p>
                )}
                {filtered.map((item) => (
                  <button key={item.label} onClick={() => handlePaletteClick(item)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-mono text-foreground hover:bg-primary/10 hover:text-primary transition-colors text-left">
                    <span><span className="text-terminal-green mr-2">❯</span>{item.label}</span>
                    <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">{item.key}</kbd>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
