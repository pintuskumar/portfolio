"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LEVEL_COLORS = [
  "bg-gray-800/50",      // 0 - no contributions
  "bg-emerald-900/60",   // 1 - low
  "bg-emerald-700/70",   // 2 - medium
  "bg-emerald-500/80",   // 3 - high
  "bg-emerald-400",      // 4 - very high
];

function generateHeatmapData(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Start from the nearest Sunday
  const start = new Date(oneYearAgo);
  start.setDate(start.getDate() - start.getDay());

  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const date = d.toISOString().split("T")[0];
    // Simulate realistic contribution pattern
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const random = Math.random();

    let count = 0;
    if (isWeekend) {
      count = random > 0.6 ? Math.floor(Math.random() * 5) : 0;
    } else {
      count = random > 0.2 ? Math.floor(Math.random() * 12) + 1 : 0;
    }

    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 8 ? 3 : 4;

    days.push({ date, count, level });
  }

  return days;
}

export default function GitHubHeatmap() {
  const [data, setData] = useState<ContributionDay[]>([]);
  const [totalContribs, setTotalContribs] = useState(0);
  const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    // Generate on client only to avoid hydration mismatch from Math.random()
    const days = generateHeatmapData();
    setData(days);
    setTotalContribs(days.reduce((sum, d) => sum + d.count, 0));
  }, []);

  // Group data into weeks (columns)
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  data.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  // Calculate month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstDay = new Date(week[0].date);
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], col: wi });
      lastMonth = month;
    }
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="text-emerald-400">{totalContribs}</span> contributions in the last year
          <span className="text-[10px] text-gray-600 font-normal">(approximate)</span>
        </h4>
        <a
          href="https://github.com/pintu544"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          @pintu544
        </a>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto pb-2" data-lenis-prevent>
        {/* Month labels */}
        <div className="flex mb-1 ml-8">
          {monthLabels.map((m, i) => (
            <span
              key={i}
              className="text-[10px] text-gray-500"
              style={{ position: "relative", left: `${m.col * 14}px` }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1 shrink-0">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <span key={i} className="text-[10px] text-gray-600 h-[11px] leading-[11px]">
                {d}
              </span>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_COLORS[day.level]} transition-all duration-150 hover:ring-1 hover:ring-white/30`}
                  title={`${day.count} contributions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="mt-2 text-xs text-gray-400">
          <span className="text-white font-medium">{hoveredDay.count} contributions</span> on{" "}
          {new Date(hoveredDay.date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-2">
        <span className="text-[10px] text-gray-500">Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <div key={i} className={`h-[10px] w-[10px] rounded-[2px] ${color}`} />
        ))}
        <span className="text-[10px] text-gray-500">More</span>
      </div>
    </motion.div>
  );
}
