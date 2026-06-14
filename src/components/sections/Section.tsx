import { useRef, useState, useEffect } from "react";
import { motion, useInView as useMotionInView } from "framer-motion";

function TypedPrompt({ text, isInView }: { text: string; isInView: boolean }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isInView) return;
    setDisplayed("");
    let i = 0;
    let last = performance.now();
    const stepMs = 40;
    let raf = 0;
    const tick = (now: number) => {
      if (now - last >= stepMs) {
        last = now;
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, text]);

  return (
    <span className="text-muted-foreground font-mono text-sm">
      {displayed}
      {displayed.length < text.length && <span className="animate-blink text-primary">▌</span>}
    </span>
  );
}

/**
 * IntersectionObserver-driven reveal. Replaces motion.section to drop
 * framer-motion overhead × N sections. CSS handles the animation.
 */
export function Section({ children, id, className = "" }: { children: React.ReactNode; id?: string; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in-view");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`reveal-on-scroll py-20 md:py-28 px-4 md:px-6 scroll-mt-20 ${className}`}
    >
      {children}
    </section>
  );
}

/**
 * Unified section heading block:
 *   eyebrow (small caps) · number · rule
 *   title with optional accent keyword (gradient)
 *   meta (prompt-style subtitle)
 */
export function SectionHeading({
  number,
  eyebrow,
  title,
  accent,
  meta,
  className = "",
}: {
  number: string;
  eyebrow: string;
  title: string;
  accent?: string;
  meta?: string;
  className?: string;
}) {
  // split title so only `accent` gets gradient treatment
  const parts = accent && title.includes(accent) ? title.split(accent) : null;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
      }}
      className={`mb-12 md:mb-16 relative ${className}`}
    >
      {/* Sticky beat: eyebrow + rule briefly pin to the top as the section enters */}
      <div className="section-heading-sticky">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="flex items-center gap-3 mb-4 py-2 backdrop-blur-[2px]"
        >
          <span className="section-heading-eyebrow">
            <span className="text-muted-foreground/60">{number}</span>
            <span>/</span>
            <span>{eyebrow}</span>
          </span>
          <motion.span
            className="section-heading-rule origin-left"
            variants={{
              hidden: { scaleX: 0, opacity: 0 },
              visible: { scaleX: 1, opacity: 1, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.1 } },
            }}
            style={{ transformOrigin: "left" }}
          />
        </motion.div>
      </div>
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 18, letterSpacing: "0.02em" },
          visible: {
            opacity: 1,
            y: 0,
            letterSpacing: "-0.005em",
            transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="font-serif text-4xl md:text-5xl font-normal text-balance leading-[1.05]"
      >
        {parts ? (
          <>
            {parts[0]}
            <span className="gradient-text">{accent}</span>
            {parts[1]}
          </>
        ) : (
          <span className="gradient-text">{title}</span>
        )}
      </motion.h2>
      {meta && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="mt-2 font-mono text-xs text-muted-foreground"
        >
          <span className="text-terminal-green">❯</span> {meta}
        </motion.p>
      )}
    </motion.div>
  );
}

export function SectionDivider({ label }: { label: string }) {
  const ref = useRef(null);
  const isInView = useMotionInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="section-divider max-w-5xl mx-auto px-4">
      <motion.span
        className="section-divider-line"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: "right" }}
      />
      <span className="whitespace-nowrap">// ─── {label} ───</span>
      <motion.span
        className="section-divider-line"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

export { TypedPrompt };
