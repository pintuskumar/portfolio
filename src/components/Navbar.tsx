"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true);
        setIsOpen(false);
      } else {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) {
      // Lenis handles smooth scrolling via the click listener in SmoothScroll
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-gray-950/80 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection("#home")}
              className="relative z-10 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl font-bold tracking-tight text-white md:text-2xl">
                Pintu
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {" "}
                  Kumar
                </span>
              </span>
            </motion.button>

            {/* Desktop navigation */}
            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <button
                    onClick={() => scrollToSection(href)}
                    aria-current={activeSection === href ? "page" : undefined}
                    className="group relative cursor-pointer px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
                  >
                    {label}
                    {/* Active indicator */}
                    {activeSection === href && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    {/* Hover glow */}
                    <span className="absolute inset-0 -z-10 rounded-lg bg-white/0 transition-colors duration-200 group-hover:bg-white/5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
            {/* Cmd+K search trigger */}
            <button
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
              }}
              className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-white/20 hover:text-gray-300 cursor-pointer"
            >
              <Search className="h-3 w-3" />
              <span>Search</span>
              <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] font-mono">⌘K</kbd>
            </button>

            <ThemeToggle />

            {/* Mobile menu button */}
            <motion.button
              className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/10 hover:text-white md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle navigation menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[calc(100vw-4rem)] sm:w-72 flex-col bg-gray-950/95 backdrop-blur-2xl border-l border-white/10 md:hidden"
            >
              {/* Spacer for navbar height */}
              <div className="h-16" />

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <ul className="space-y-1">
                  {navLinks.map(({ label, href }, index) => (
                    <motion.li
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                    >
                      <button
                        onClick={() => scrollToSection(href)}
                        aria-current={activeSection === href ? "page" : undefined}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left text-base font-medium transition-all duration-200 ${
                          activeSection === href
                            ? "bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-white border border-white/10"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {activeSection === href && (
                          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" />
                        )}
                        {label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Bottom decoration */}
              <div className="border-t border-white/5 px-6 py-4">
                <p className="text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} Pintu Kumar
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
