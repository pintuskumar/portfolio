import { useCallback, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export type Screenshot = {
  src: string;
  alt: string;
  caption?: string;
};

interface Props {
  items: Screenshot[];
}

export default function ScreenshotGallery({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(() => {
    setOpenIdx((i) => (i === null ? i : (i - 1 + items.length) % items.length));
  }, [items.length]);
  const next = useCallback(() => {
    setOpenIdx((i) => (i === null ? i : (i + 1) % items.length));
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIdx, prev, next]);

  // Preload neighbors
  useEffect(() => {
    if (openIdx === null) return;
    const neighbors = [
      items[(openIdx + 1) % items.length],
      items[(openIdx - 1 + items.length) % items.length],
    ];
    neighbors.forEach((n) => {
      const img = new Image();
      img.src = n.src;
    });
  }, [openIdx, items]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  if (!items?.length) return null;

  const current = openIdx !== null ? items[openIdx] : null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.button
            key={item.src + i}
            type="button"
            onClick={() => setOpenIdx(i)}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-lg border border-border bg-secondary/30 text-left transition-colors hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none"
            aria-label={`Open screenshot: ${item.alt}`}
          >
            <div className="aspect-video overflow-hidden bg-muted">
              <img
                src={`${item.src.split("?")[0]}?w=600&q=70&auto=format&fit=crop`}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                width={600}
                height={338}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
              <ZoomIn size={28} className="text-primary" />
            </div>
            <div className="flex items-center gap-2 border-t border-border bg-background/60 px-3 py-2 font-mono text-[11px] text-muted-foreground">
              <span className="text-terminal-green">❯</span>
              <span className="truncate">
                screenshot_{String(i + 1).padStart(2, "0")}.png
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent
          className="max-w-[95vw] w-full sm:max-w-[90vw] p-0 bg-background/95 backdrop-blur-md border-border"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <DialogTitle className="sr-only">
            {current?.alt ?? "Screenshot"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {current?.caption ?? "Project screenshot preview"}
          </DialogDescription>

          {current && (
            <div className="relative flex flex-col items-center p-4 sm:p-6">
              <div className="absolute top-3 left-4 font-mono text-xs text-muted-foreground z-10">
                {String((openIdx ?? 0) + 1).padStart(2, "0")} /{" "}
                {String(items.length).padStart(2, "0")}
              </div>

              <div className="flex w-full items-center justify-center">
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-h-[75vh] max-w-full rounded-md object-contain"
                />
              </div>

              {current.caption && (
                <p className="mt-4 max-w-2xl text-center font-mono text-xs text-muted-foreground">
                  {current.caption}
                </p>
              )}

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous screenshot"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2 text-foreground transition-colors hover:border-primary/50 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next screenshot"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-2 text-foreground transition-colors hover:border-primary/50 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
