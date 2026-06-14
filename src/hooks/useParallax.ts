import { useState, useEffect } from "react";

export function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;
    let last = -1;
    const compute = () => {
      raf = 0;
      const y = window.scrollY;
      // bail if change < 1px to avoid wasted re-renders
      if (Math.abs(y - last) < 1) return;
      last = y;
      setOffset(y);
    };
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return offset;
}
