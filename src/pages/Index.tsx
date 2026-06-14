import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { pageLoad, NAV_LINKS, PROFILE } from "@/data/portfolio";
import { useTheme } from "@/hooks/useTheme";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { useActiveSection } from "@/hooks/useActiveSection";
import SEO from "@/components/SEO";
import { SITE_URL } from "@/components/SEO";
import { track } from "@/lib/analytics";

import { ScrollProgressBar } from "@/components/sections/ScrollProgressBar";
import { Navbar } from "@/components/sections/Navbar";
import { AvailableBanner } from "@/components/sections/AvailableBanner";
import { Hero } from "@/components/sections/Hero";
import { SectionDivider } from "@/components/sections/Section";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { LearningTicker } from "@/components/sections/LearningTicker";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { LoadingScreen } from "@/components/LoadingScreen";
import WordmarkIntro from "@/components/WordmarkIntro";

import PullQuote from "@/components/sections/PullQuote";

// Lazy-loaded below-the-fold sections
const Blog = lazy(() => import("@/components/sections/Blog").then(m => ({ default: m.Blog })));
const Projects = lazy(() => import("@/components/sections/Projects").then(m => ({ default: m.Projects })));
const Testimonials = lazy(() => import("@/components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));
const Footer = lazy(() => import("@/components/sections/Footer").then(m => ({ default: m.Footer })));
const BackToTop = lazy(() => import("@/components/sections/BackToTop").then(m => ({ default: m.BackToTop })));
const ChatWidget = lazy(() => import("@/components/ChatWidget"));
// MatrixRain only mounts on Konami code — keep it out of the main bundle.
const MatrixRain = lazy(() => import("@/components/sections/MatrixRain").then(m => ({ default: m.MatrixRain })));

const SECTION_IDS = NAV_LINKS.map(l => l.href);

function SectionDotNav({ active }: { active: string }) {
  const handleNavigate = (id: string) => {
    const el = document.querySelector(id) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
    // Fade-and-lift arrival on target section
    el.classList.remove("section-arrive");
    // Force reflow so the animation can replay
    void el.offsetWidth;
    el.classList.add("section-arrive");
    const cleanup = () => {
      el.classList.remove("section-arrive");
      el.removeEventListener("animationend", cleanup);
      // Focus management: move focus to the section's first heading
      const heading = el.querySelector("h1, h2, h3") as HTMLElement | null;
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    };
    el.addEventListener("animationend", cleanup);
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2">
      {SECTION_IDS.map((id) => (
        <button
          key={id}
          onClick={() => handleNavigate(id)}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${id.replace("#", "")}`}
        >
          <span className="absolute right-5 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-muted-foreground bg-card border border-border rounded px-2 py-0.5 whitespace-nowrap pointer-events-none">
            {id.replace("#", "")}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === id
                ? "w-3 h-3 bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
          />
        </button>
      ))}
    </div>
  );
}


function useDynamicTitle(active: string) {
  useEffect(() => {
    const base = "Pintu Kumar";
    if (!active) {
      document.title = base;
      return;
    }
    const section = active.replace("#", "");
    document.title = `${base} · ${section.charAt(0).toUpperCase() + section.slice(1)}`;
  }, [active]);
}

function LazyFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="font-mono text-xs text-muted-foreground animate-pulse">loading...</div>
    </div>
  );
}

export default function Index() {
  const { theme, toggle } = useTheme();
  const konamiActive = useKonamiCode();
  const active = useActiveSection();
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef<number | null>(null);

  useDynamicTitle(active);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    track("page_view", { page: "home" });
    // Warm up the case-study chunk after idle so navigation feels instant.
    const idle = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 1500));
    idle(() => {
      import("@/pages/ProjectCaseStudy").catch(() => {});
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isTouchDevice || reducedMotion) return;
      const x = e.clientX;
      const y = e.clientY;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setMousePos({ x, y });
      });
    },
    [isTouchDevice, reducedMotion]
  );

  const homeJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: PROFILE.name,
      url: SITE_URL || "/",
      image: PROFILE.photo,
      jobTitle: "Full Stack Developer & Software Engineer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "",
        addressRegion: "",
        addressCountry: "IN",
      },
      sameAs: [PROFILE.linkedin, PROFILE.github],
      description: PROFILE.about,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: PROFILE.name,
      url: SITE_URL || "/",
    },
  ];

  return (
    <>
      <SEO canonical={SITE_URL || "/"} jsonLd={homeJsonLd} type="profile" />
      <LoadingScreen />
      <WordmarkIntro />
      <a href="#about" className="skip-to-content">Skip to main content</a>

      <motion.div
        className="min-h-screen bg-background relative"
        initial="hidden"
        animate="visible"
        variants={pageLoad}
        onMouseMove={handleMouseMove}
      >
        {!isTouchDevice && (
          <div
            className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary) / 0.04), transparent 40%)`,
            }}
          />
        )}

        <div className="page-vignette" />
        <div className="noise-overlay" />
        <ScrollProgressBar />
        {konamiActive && (
          <Suspense fallback={null}>
            <MatrixRain active={konamiActive} />
          </Suspense>
        )}
        <SectionDotNav active={active} />

        <Navbar theme={theme} toggleTheme={toggle} />
        <AvailableBanner />
        <Hero />
        <SectionDivider label="about" />
        <About />
        <PullQuote />
        <SectionDivider label="skills" />
        <Skills />
        <LearningTicker />
        <SectionDivider label="experience" />
        <Experience />
        <SectionDivider label="achievements" />
        <Achievements />

        <Suspense fallback={<LazyFallback />}>
          <SectionDivider label="blog" />
          <Blog />
          <SectionDivider label="projects" />
          <Projects />
          <SectionDivider label="testimonials" />
          <Testimonials />
          <SectionDivider label="contact" />
          <Contact />
          <BackToTop />
          <ChatWidget />
          <Footer />
        </Suspense>
      </motion.div>
    </>
  );
}
