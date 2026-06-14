import { useState } from "react";
import { Linkedin, Github, Download } from "lucide-react";
import { motion } from "framer-motion";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";
import { track } from "@/lib/analytics";

const FOOTER_COMMANDS = [
  { cmd: "uptime", output: `Portfolio running since 2024 · ${Math.floor((Date.now() - new Date("2024-01-01").getTime()) / 86400000)}d uptime` },
  { cmd: "whoami", output: PROFILE.name },
  { cmd: "pwd", output: "~/portfolio" },
];

export function Footer() {
  const [hoveredCmd, setHoveredCmd] = useState<number | null>(null);

  return (
    <>
      {/* SVG Wave Divider */}
      <div className="relative w-full overflow-hidden h-16 -mb-1">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
          <motion.path
            d="M0,32 C360,64 720,0 1080,32 C1260,48 1380,16 1440,32 L1440,64 L0,64 Z"
            fill="hsl(var(--border))"
            fillOpacity="0.3"
            initial={{ d: "M0,32 C360,64 720,0 1080,32 C1260,48 1380,16 1440,32 L1440,64 L0,64 Z" }}
            animate={{
              d: [
                "M0,32 C360,64 720,0 1080,32 C1260,48 1380,16 1440,32 L1440,64 L0,64 Z",
                "M0,40 C360,10 720,50 1080,20 C1260,35 1380,45 1440,30 L1440,64 L0,64 Z",
                "M0,32 C360,64 720,0 1080,32 C1260,48 1380,16 1440,32 L1440,64 L0,64 Z",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,40 C480,10 960,50 1440,30 L1440,64 L0,64 Z"
            fill="hsl(var(--border))"
            fillOpacity="0.15"
            initial={{ d: "M0,40 C480,10 960,50 1440,30 L1440,64 L0,64 Z" }}
            animate={{
              d: [
                "M0,40 C480,10 960,50 1440,30 L1440,64 L0,64 Z",
                "M0,28 C480,55 960,15 1440,42 L1440,64 L0,64 Z",
                "M0,40 C480,10 960,50 1440,30 L1440,64 L0,64 Z",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="border-t border-border py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="font-mono text-lg font-bold text-primary mb-2"><span className="text-terminal-green">~/</span>pk</div>
              <p className="font-mono text-xs text-muted-foreground">Full Stack Developer · Software Engineer</p>
            </div>
            <div>
              <p className="font-mono text-xs text-foreground mb-3 font-semibold">Quick Links</p>
              <div className="flex flex-col gap-1.5">
                {NAV_LINKS.map(l => (
                  <a key={l.href} href={l.href} className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
                    <span className="text-terminal-green mr-1">❯</span> {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs text-foreground mb-3 font-semibold">Connect</p>
              <div className="flex flex-col gap-1.5">
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer"
                  onClick={() => track("social_click", { network: "linkedin", surface: "footer" })}
                  className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"><Linkedin size={12} /> LinkedIn</a>
                <a href={PROFILE.github} target="_blank" rel="noreferrer"
                  onClick={() => track("social_click", { network: "github", surface: "footer" })}
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"><Github size={12} /> GitHub</a>
                <a href="/PintuKumarCV.pdf" download
                  onClick={() => track("resume_download", { surface: "footer" })}
                  className="font-mono text-xs text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"><Download size={12} /> Resume</a>
              </div>
            </div>
          </div>
          <div className="hairline-gold my-6" />
          <div className="font-serif italic text-sm md:text-base text-muted-foreground/80 text-center leading-relaxed text-balance">
            Set in <span className="text-foreground/90">DM Serif Display</span> &amp; <span className="text-foreground/90">Fira Sans</span>.
            Composed in India, {new Date().getFullYear()}.
            <br />
            <span className="font-mono not-italic text-[10px] tracking-[0.22em] uppercase text-muted-foreground/60">
              © {new Date().getFullYear()} {PROFILE.name} — handcrafted, no templates.
            </span>
          </div>
          <div className="flex items-center justify-center gap-5 mt-5 font-mono text-[10px] text-muted-foreground/70">
            {FOOTER_COMMANDS.map((fc, i) => (
              <div key={i} className="relative"
                onMouseEnter={() => setHoveredCmd(i)}
                onMouseLeave={() => setHoveredCmd(null)}>
                <span className="cursor-default hover:text-primary transition-colors duration-500">
                  <span className="text-primary/60">$</span> {fc.cmd}
                </span>
                {hoveredCmd === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded bg-card border border-primary/30 whitespace-nowrap text-[10px] text-foreground shadow-lg z-10"
                  >
                    {fc.output}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-primary/30 rotate-45 -mt-1" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

      </motion.footer>
    </>
  );
}
