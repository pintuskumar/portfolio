import { useState, useEffect } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const compute = () => {
      raf = 0;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const next = docHeight > 0 ? Math.round((scrollTop / docHeight) * 1000) / 10 : 0;
      if (next !== last) {
        last = next;
        setProgress(next);
      }
    };
    const handler = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener("scroll", handler, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return progress;
}
