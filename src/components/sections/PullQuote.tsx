import { motion } from "framer-motion";

export function PullQuote() {
  return (
    <section className="px-4 md:px-6 py-20 md:py-28" aria-label="Pull quote">
      <div className="max-w-3xl mx-auto text-center relative">
        <span
          aria-hidden
          className="block font-serif text-[8rem] md:text-[11rem] leading-none text-primary/30 select-none -mb-12 md:-mb-20"
          style={{ fontStyle: "italic" }}
        >
          “
        </span>
        <motion.blockquote
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-2xl md:text-4xl leading-[1.25] text-foreground/90 text-balance"
          style={{ hangingPunctuation: "first" } as React.CSSProperties}
        >
          Software is engineering. Clean APIs, resilient systems,
          and great user experiences are the craft I pursue daily.
        </motion.blockquote>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <span className="hairline-gold w-12" />
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-primary/80">— P.K.</span>
          <span className="hairline-gold w-12" />
        </motion.div>
      </div>
    </section>
  );
}

export default PullQuote;
