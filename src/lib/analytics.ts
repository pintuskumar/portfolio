/**
 * Privacy-friendly analytics.
 *
 * - No cookies, no third-party requests, no PII.
 * - Events are buffered in localStorage so you can inspect them anytime
 *   from the DevTools console:
 *
 *     analytics.dump()       // pretty-print recent events
 *     analytics.summary()    // counts grouped by event name
 *     analytics.clear()      // wipe local buffer
 *
 * - If `window.plausible` or `window.umami` is ever loaded (e.g. a script
 *   tag added later), events are forwarded automatically. Until then,
 *   tracking is fully local and zero-network.
 */

const STORAGE_KEY = "pk_analytics_events_v1";
const MAX_EVENTS = 500;

export type AnalyticsEvent = {
  name: string;
  ts: number;
  path: string;
  props?: Record<string, string | number | boolean | undefined>;
};

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
    umami?: { track: (event: string, props?: Record<string, unknown>) => void };
    analytics?: typeof analytics;
  }
}

function readBuffer(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function writeBuffer(events: AnalyticsEvent[]) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // storage full or disabled — silently ignore
  }
}

export function track(
  name: string,
  props?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;

  const event: AnalyticsEvent = {
    name,
    ts: Date.now(),
    path: window.location.pathname + window.location.hash,
    props,
  };

  // 1. Local buffer (always)
  const buf = readBuffer();
  buf.push(event);
  writeBuffer(buf);

  // 2. Forward to Plausible / Umami if present (never required)
  try {
    if (typeof window.plausible === "function") {
      window.plausible(name, props ? { props } : undefined);
    } else if (window.umami?.track) {
      window.umami.track(name, props);
    }
  } catch {
    // never let analytics break the UI
  }
}

export const analytics = {
  track,
  events(): AnalyticsEvent[] {
    return readBuffer();
  },
  summary(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const e of readBuffer()) out[e.name] = (out[e.name] ?? 0) + 1;
    return out;
  },
  dump(): void {
    // eslint-disable-next-line no-console
    console.table(readBuffer().slice(-50).map((e) => ({
      time: new Date(e.ts).toLocaleString(),
      name: e.name,
      path: e.path,
      ...(e.props ?? {}),
    })));
  },
  clear(): void {
    writeBuffer([]);
  },
};

// Expose to console for ad-hoc inspection — read-only utility, no PII.
if (typeof window !== "undefined") {
  window.analytics = analytics;
}
