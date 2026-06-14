import { motion } from "framer-motion";
import { fadeUp } from "@/data/portfolio";

// Module-level: generate exactly once per page load, not per mount.
const HEATMAP_DATA = (() => {
  const data: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 182; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 0.3 : 0.7;
    const count = Math.random() < base ? Math.floor(Math.random() * 8) : 0;
    data.push({ date: d.toISOString().split("T")[0], count });
  }
  return data;
})();

const HEATMAP_WEEKS = (() => {
  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];
  const firstDay = new Date(HEATMAP_DATA[0].date).getDay();
  for (let i = 0; i < firstDay; i++) currentWeek.push({ date: "", count: -1 });
  for (const d of HEATMAP_DATA) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);
  return weeks;
})();

const TOTAL_CONTRIBUTIONS = HEATMAP_DATA.filter((d) => d.count > 0).length;

function getColor(count: number): string {
  if (count === 0) return "hsl(var(--border))";
  if (count <= 2) return "hsl(var(--primary) / 0.25)";
  if (count <= 4) return "hsl(var(--primary) / 0.5)";
  if (count <= 6) return "hsl(var(--primary) / 0.75)";
  return "hsl(var(--primary))";
}

export function GitHubHeatmap() {
  const cellSize = 10;
  const gap = 2;
  const svgWidth = HEATMAP_WEEKS.length * (cellSize + gap);
  const svgHeight = 7 * (cellSize + gap);

  return (
    <motion.div variants={fadeUp} custom={3} className="mt-6 terminal-window terminal-window-hover">
      <div className="terminal-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-xs text-muted-foreground font-mono ml-2">contributions.svg</span>
      </div>
      <div className="p-4 overflow-x-auto">
        <div className="font-mono text-[10px] text-muted-foreground mb-2">
          {TOTAL_CONTRIBUTIONS} contributions in the last 6 months
        </div>
        <svg width={svgWidth} height={svgHeight} className="block">
          {HEATMAP_WEEKS.map((week, wi) =>
            week.map((day, di) => {
              if (day.count < 0) return null;
              return (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * (cellSize + gap)}
                  y={di * (cellSize + gap)}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={getColor(day.count)}
                  className="transition-colors duration-200 hover:stroke-primary hover:stroke-1"
                >
                  <title>{day.date}: {day.count} contributions</title>
                </rect>
              );
            })
          )}
        </svg>
        <div className="flex items-center gap-1 mt-2 font-mono text-[9px] text-muted-foreground">
          <span>Less</span>
          {[0, 2, 4, 6, 8].map((c) => (
            <div key={c} className="w-[10px] h-[10px] rounded-sm" style={{ background: getColor(c) }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </motion.div>
  );
}
