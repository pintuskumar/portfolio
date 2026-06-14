import { useRef } from "react";
import { motion, useInView as useMotionInView } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

interface Metric {
  label: string;
  value: string;
}

interface MetricsStripProps {
  metrics: Metric[];
}

// Parse "60%" → { prefix: "", num: 60, suffix: "%" }, "$5K" → { "$", 5, "K" }, "3x" → { "", 3, "x" }
function parseMetric(value: string): { prefix: string; num: number | null; suffix: string } {
  const match = value.match(/^(\D*?)([\d.,]+)(.*)$/);
  if (!match) return { prefix: value, num: null, suffix: "" };
  const num = parseFloat(match[2].replace(/,/g, ""));
  if (Number.isNaN(num)) return { prefix: value, num: null, suffix: "" };
  return { prefix: match[1] ?? "", num, suffix: match[3] ?? "" };
}

function MetricValue({ value, visible }: { value: string; visible: boolean }) {
  const { prefix, num, suffix } = parseMetric(value);
  const isInt = num !== null && Number.isInteger(num);
  const target = num ?? 0;
  // Scale duration with magnitude, capped — luxury > speed.
  const duration = num === null ? 0 : Math.min(1600, 700 + target * 8);
  const count = useCountUp(isInt ? target : Math.round(target * 10), visible, duration);
  if (num === null) return <>{value}</>;
  const display = isInt ? count : (count / 10).toFixed(1);
  return (
    <>
      {prefix}
      {display}
      {suffix}
    </>
  );
}

export default function MetricsStrip({ metrics }: MetricsStripProps) {
  const ref = useRef<HTMLDListElement>(null);
  const isInView = useMotionInView(ref, { once: true, margin: "-40px" });

  if (!metrics?.length) return null;

  return (
    <motion.dl
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-xl overflow-hidden border border-border/60 bg-border/60 mb-10"
      aria-label="Project outcomes"
    >
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.08 }}
          className="bg-card/60 px-5 py-5 flex flex-col gap-1.5 hover:bg-card transition-colors"
        >
          <dd className="font-mono text-2xl md:text-3xl font-bold text-primary tracking-tight tabular-nums">
            <MetricValue value={m.value} visible={isInView} />
          </dd>
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
            {m.label}
          </dt>
        </motion.div>
      ))}
    </motion.dl>
  );
}
