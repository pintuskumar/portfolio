import { useState, useEffect, useRef } from "react";

// Luxury easing: cubic-bezier(0.22, 1, 0.36, 1) ~= easeOutExpo-ish
// Approximated as easeOutQuint for parity with CSS curve feel.
const easeOutLuxe = (t: number) => 1 - Math.pow(1 - t, 5);

/**
 * Number counter that animates once on first reveal with a refined ease-out.
 * Uses requestAnimationFrame for frame-perfect timing.
 */
export function useCountUp(target: number, visible: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!visible || hasRun.current) return;
    hasRun.current = true;

    if (typeof window === "undefined") {
      setCount(target);
      return;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutLuxe(t);
      setCount(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, target, duration]);

  return count;
}
