import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/data/portfolio";

export function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const handler = () => {
      const sections = NAV_LINKS.map(l => document.querySelector(l.href) as HTMLElement).filter(Boolean);
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].getBoundingClientRect().top <= 200) { setActive(NAV_LINKS[i].href); return; }
      }
      setActive("");
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}
