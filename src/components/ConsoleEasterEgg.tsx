"use client";

import { useEffect } from "react";

const ASCII_ART = `
%c╔══════════════════════════════════════════╗
║                                          ║
║   🚀  Hey there, fellow developer!  🚀   ║
║                                          ║
║   I'm Pintu Kumar                        ║
║   Full Stack Software Developer           ║
║                                          ║
║   Curious about the code?                ║
║   Check it out on GitHub:                ║
║   github.com/pintu544                    ║
║                                          ║
║   Let's connect:                         ║
║   📧 pksharmagh4@gmail.com               ║
║   💼 linkedin.com/in/pintukumar12        ║
║                                          ║
╚══════════════════════════════════════════╝
`;

export default function ConsoleEasterEgg() {
  useEffect(() => {
    // Main greeting
    console.log(
      ASCII_ART,
      "color: #818cf8; font-family: monospace; font-size: 12px; line-height: 1.4;"
    );

    // Tech stack
    console.log(
      "%c🛠️ Built with: Next.js 16 • React 19 • TypeScript • Tailwind CSS • Framer Motion • GSAP • Three.js • Lenis",
      "color: #a78bfa; font-size: 11px; font-weight: bold;"
    );

    // Fun message
    console.log(
      "%c💡 Pro tip: Press '?' on the page for keyboard shortcuts!",
      "color: #34d399; font-size: 11px;"
    );

    // Hiring message
    console.log(
      "%c📋 Looking to hire? I'm available! → pksharmagh4@gmail.com",
      "color: #f472b6; font-size: 11px; font-weight: bold;"
    );
  }, []);

  return null;
}
