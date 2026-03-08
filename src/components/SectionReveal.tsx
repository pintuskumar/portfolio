"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap-init";

interface SectionRevealProps {
  children: React.ReactNode;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
}

export default function SectionReveal({
  children,
  direction = "up",
  delay = 0,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initial: gsap.TweenVars = { opacity: 0 };
    const final: gsap.TweenVars = {
      opacity: 1,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    };

    switch (direction) {
      case "up":
        initial.y = 60;
        final.y = 0;
        break;
      case "left":
        initial.x = -60;
        final.x = 0;
        break;
      case "right":
        initial.x = 60;
        final.x = 0;
        break;
      case "scale":
        initial.scale = 0.9;
        final.scale = 1;
        break;
    }

    gsap.fromTo(el, initial, final);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [direction, delay]);

  return <div ref={ref}>{children}</div>;
}
