import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Section, SectionHeading } from "./Section";
import { TESTIMONIALS, fadeUp } from "@/data/portfolio";

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || isPaused) return;
    const id = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(id);
  }, [emblaApi, isPaused]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollPrev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); scrollNext(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [scrollPrev, scrollNext]);

  return (
    <Section id="testimonials">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          number="07"
          eyebrow="testimonials"
          title="kind words"
          accent="kind"
          meta="cat reviews.log"
        />

        <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -ml-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 pl-4">
                  <div className={`border rounded-lg p-5 bg-card h-full flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.06)] border-l-[3px] group bg-gradient-to-br from-card to-card hover:from-card hover:to-primary/[0.02] ${
                    selectedIndex === i
                      ? "border-primary/40 border-l-primary/60 shadow-[0_0_20px_hsl(var(--primary)/0.08)]"
                      : "border-border border-l-primary/20 hover:border-primary/30 hover:border-l-primary/50"
                  }`}>
                    <span className="quote-mark leading-none transition-transform duration-300 group-hover:scale-110 inline-block origin-left">"</span>
                    <p className="text-sm text-foreground/80 leading-relaxed -mt-4 mb-4 italic flex-1">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      {/* Gradient ring avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="avatar-gradient-ring w-10 h-10 rounded-full p-[2px]">
                          <div className="w-full h-full rounded-full bg-card flex items-center justify-center font-mono text-xs font-bold text-primary">
                            {t.avatar}
                          </div>
                        </div>
                        {selectedIndex === i && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0.3)", "0 0 0 6px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground font-mono">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={scrollPrev} className="p-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors" aria-label="Previous testimonial">
              <ArrowLeft size={14} />
            </button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => emblaApi?.scrollTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${selectedIndex === i ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"}`}
                  aria-label={`Go to testimonial ${i + 1}`} />
              ))}
            </div>
            <button onClick={scrollNext} className="p-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors" aria-label="Next testimonial">
              <ArrowRight size={14} />
            </button>
          </div>

          <p className="hidden md:block text-center mt-3 font-mono text-[10px] text-muted-foreground/40">
            ← → to navigate
          </p>
        </div>
      </div>
    </Section>
  );
}
