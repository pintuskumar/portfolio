"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap-init";

interface TextRevealProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  scrub?: boolean;
}

export default function TextReveal({
  children,
  className = "",
  as: Tag = "p",
  delay = 0,
  stagger = 0.02,
  scrub = false,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Split text into words wrapped in spans
    const words = children.split(" ");
    el.textContent = "";
    words.forEach((word, i) => {
      if (i > 0) {
        const spacer = document.createElement("span");
        spacer.className = "inline-block";
        spacer.textContent = "\u00A0";
        el.appendChild(spacer);
      }
      const outer = document.createElement("span");
      outer.className = "inline-block overflow-hidden";
      const inner = document.createElement("span");
      inner.className = "inline-block text-reveal-word";
      inner.style.transform = "translateY(100%)";
      inner.style.opacity = "0";
      inner.textContent = word;
      outer.appendChild(inner);
      el.appendChild(outer);
    });

    const wordEls = el.querySelectorAll(".text-reveal-word");

    if (scrub) {
      gsap.to(wordEls, {
        y: 0,
        opacity: 1,
        stagger,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 20%",
          scrub: 1,
        },
      });
    } else {
      gsap.to(wordEls, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [children, delay, stagger, scrub]);

  return <Tag ref={containerRef as React.RefObject<never>} className={className}>{children}</Tag>;
}
