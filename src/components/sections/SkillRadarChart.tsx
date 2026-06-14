import { motion } from "framer-motion";
import { SKILLS } from "@/data/portfolio";

export function SkillRadarChart({ skills, animate }: { skills: typeof SKILLS; animate: boolean }) {
  const size = 280;
  const center = size / 2;
  const radius = 110;
  const levels = 4;

  const getPoint = (index: number, level: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (radius * level) / 100;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const levelValue = ((i + 1) / levels) * 100;
    return skills.map((_, j) => { const p = getPoint(j, levelValue, skills.length); return `${p.x},${p.y}`; }).join(" ");
  });

  const dataPoints = skills.map((s, i) => getPoint(i, s.level, skills.length));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {gridPolygons.map((points, i) => (
        <polygon key={i} points={points} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.6} />
      ))}
      {skills.map((_, i) => {
        const p = getPoint(i, 100, skills.length);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="hsl(var(--border))" strokeWidth="0.5" opacity={0.4} />;
      })}
      <motion.polygon
        points={animate ? dataPolygon : skills.map(() => `${center},${center}`).join(" ")}
        initial={{ points: skills.map(() => `${center},${center}`).join(" ") }}
        animate={animate ? { points: dataPolygon } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        fill="hsl(var(--primary) / 0.15)"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
      />
      {skills.map((s, i) => {
        const p = getPoint(i, s.level, skills.length);
        const labelP = getPoint(i, 115, skills.length);
        return (
          <g key={s.name}>
            <motion.circle
              cx={animate ? p.x : center} cy={animate ? p.y : center}
              initial={{ cx: center, cy: center }}
              animate={animate ? { cx: p.x, cy: p.y } : {}}
              transition={{ duration: 1.2, ease: "easeOut" }}
              r="3" fill="hsl(var(--primary))"
            />
            <text x={labelP.x} y={labelP.y} textAnchor="middle" dominantBaseline="middle"
              className="fill-muted-foreground" style={{ fontSize: "8px", fontFamily: "'JetBrains Mono', monospace" }}>
              {s.name.length > 10 ? s.name.slice(0, 8) + "…" : s.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
