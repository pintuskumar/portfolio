/**
 * Lightweight Web Vitals tracking — no dependencies.
 *
 * Captures real-user performance metrics using native browser APIs and
 * forwards them to the privacy-friendly analytics buffer:
 *
 *   - LCP  (Largest Contentful Paint)
 *   - CLS  (Cumulative Layout Shift)
 *   - INP  (Interaction to Next Paint, approximated via event timing)
 *   - FCP  (First Contentful Paint)
 *   - TTFB (Time to First Byte)
 *
 * Each metric is reported once when the page is hidden / unloaded so we
 * capture the final value (LCP/CLS evolve until the user leaves).
 *
 * Inspect from DevTools console:
 *   analytics.summary()                 // counts by event name
 *   analytics.events().filter(e => e.name === "web_vital")
 */

import { track } from "./analytics";

type MetricName = "LCP" | "CLS" | "INP" | "FCP" | "TTFB";

type Rating = "good" | "needs-improvement" | "poor";

// Standard Web Vitals thresholds (web.dev)
const THRESHOLDS: Record<MetricName, [number, number]> = {
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  FCP: [1800, 3000],
  TTFB: [800, 1800],
};

function rate(name: MetricName, value: number): Rating {
  const [good, poor] = THRESHOLDS[name];
  if (value <= good) return "good";
  if (value <= poor) return "needs-improvement";
  return "poor";
}

function report(name: MetricName, value: number) {
  // Round sensibly: CLS keeps 3 decimals, others are ms integers.
  const rounded = name === "CLS" ? Math.round(value * 1000) / 1000 : Math.round(value);
  track("web_vital", {
    metric: name,
    value: rounded,
    rating: rate(name, value),
  });
}

function safeObserve(
  type: string,
  cb: (entries: PerformanceEntryList) => void,
  opts: PerformanceObserverInit = { type, buffered: true } as PerformanceObserverInit
): PerformanceObserver | null {
  if (typeof PerformanceObserver === "undefined") return null;
  try {
    const po = new PerformanceObserver((list) => cb(list.getEntries()));
    po.observe(opts);
    return po;
  } catch {
    return null;
  }
}

export function initWebVitals() {
  if (typeof window === "undefined" || typeof performance === "undefined") return;

  // ---- TTFB (immediate, from navigation timing) ----
  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav && nav.responseStart > 0) {
      report("TTFB", nav.responseStart - nav.startTime);
    }
  } catch {
    /* noop */
  }

  // ---- FCP ----
  let fcpReported = false;
  safeObserve("paint", (entries) => {
    for (const e of entries) {
      if (e.name === "first-contentful-paint" && !fcpReported) {
        fcpReported = true;
        report("FCP", e.startTime);
      }
    }
  });

  // ---- LCP (keep updating until page is hidden) ----
  let lcpValue = 0;
  const lcpObserver = safeObserve("largest-contentful-paint", (entries) => {
    const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
    if (last) lcpValue = last.startTime;
  });

  // ---- CLS (sum of session windows, per spec) ----
  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];
  let sessionValue = 0;
  let sessionEntries: PerformanceEntry[] = [];
  const clsObserver = safeObserve("layout-shift", (entries) => {
    for (const entry of entries as Array<
      PerformanceEntry & { value: number; hadRecentInput: boolean }
    >) {
      if (entry.hadRecentInput) continue;
      const first = sessionEntries[0] as (PerformanceEntry & { startTime: number }) | undefined;
      const last = sessionEntries[sessionEntries.length - 1] as
        | (PerformanceEntry & { startTime: number })
        | undefined;
      if (
        sessionValue &&
        first &&
        last &&
        entry.startTime - last.startTime < 1000 &&
        entry.startTime - first.startTime < 5000
      ) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }
      if (sessionValue > clsValue) {
        clsValue = sessionValue;
        clsEntries = sessionEntries.slice();
      }
    }
  });

  // ---- INP approximation (worst event duration) ----
  let inpValue = 0;
  const inpObserver = safeObserve("event", (entries) => {
    for (const e of entries as Array<PerformanceEntry & { duration: number }>) {
      if (e.duration > inpValue) inpValue = e.duration;
    }
  }, { type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit);

  // ---- Flush on hide/unload ----
  let flushed = false;
  const flush = () => {
    if (flushed) return;
    flushed = true;

    try { lcpObserver?.takeRecords(); } catch { /* noop */ }
    try { clsObserver?.takeRecords(); } catch { /* noop */ }
    try { inpObserver?.takeRecords(); } catch { /* noop */ }

    if (lcpValue > 0) report("LCP", lcpValue);
    report("CLS", clsValue);
    if (inpValue > 0) report("INP", inpValue);

    // Avoid retaining entry refs
    clsEntries = [];
    sessionEntries = [];
  };

  // visibilitychange is the most reliable signal across mobile + desktop
  addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "hidden") flush();
    },
    { capture: true }
  );
  // Safari fallback
  addEventListener("pagehide", flush, { capture: true });
}
