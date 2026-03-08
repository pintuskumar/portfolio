"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Clock, Eye } from "lucide-react";

interface Metrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

function getGrade(metric: string, value: number): { label: string; color: string } {
  const thresholds: Record<string, [number, number]> = {
    lcp: [2500, 4000],
    fid: [100, 300],
    cls: [0.1, 0.25],
    ttfb: [800, 1800],
  };

  const [good, poor] = thresholds[metric] || [0, 0];
  if (value <= good) return { label: "Good", color: "text-emerald-400" };
  if (value <= poor) return { label: "Needs Improvement", color: "text-yellow-400" };
  return { label: "Poor", color: "text-red-400" };
}

function formatValue(metric: string, value: number): string {
  if (metric === "cls") return value.toFixed(3);
  return `${Math.round(value)}ms`;
}

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) return;

    // LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) setMetrics((m) => ({ ...m, lcp: last.startTime }));
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    // FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0] as PerformanceEventTiming;
        if (entry) setMetrics((m) => ({ ...m, fid: entry.processingStart - entry.startTime }));
      });
      fidObserver.observe({ type: "first-input", buffered: true });
    } catch {}

    // CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            setMetrics((m) => ({ ...m, cls: clsValue }));
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {}

    // TTFB
    try {
      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (navEntry) {
        setMetrics((m) => ({ ...m, ttfb: navEntry.responseStart - navEntry.requestStart }));
      }
    } catch {}
  }, []);

  const metricItems = [
    { key: "lcp", label: "LCP", desc: "Largest Contentful Paint", icon: Eye, value: metrics.lcp },
    { key: "fid", label: "FID", desc: "First Input Delay", icon: Zap, value: metrics.fid },
    { key: "cls", label: "CLS", desc: "Cumulative Layout Shift", icon: Activity, value: metrics.cls },
    { key: "ttfb", label: "TTFB", desc: "Time to First Byte", icon: Clock, value: metrics.ttfb },
  ];

  const hasAny = metricItems.some((m) => m.value !== null);
  if (!hasAny) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metricItems.map((item) => {
        const Icon = item.icon;
        const grade = item.value !== null ? getGrade(item.key, item.value) : null;

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white/5 border border-white/10 p-3 text-center"
          >
            <Icon className="h-4 w-4 text-gray-500 mx-auto mb-1" />
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.label}</p>
            <p className="text-lg font-bold text-white mt-1">
              {item.value !== null ? formatValue(item.key, item.value) : "..."}
            </p>
            {grade && (
              <p className={`text-[10px] mt-0.5 ${grade.color}`}>{grade.label}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
