/**
 * Runtime error tracking — privacy-friendly, local only.
 *
 * Captures:
 *   - console.error / console.warn
 *   - uncaught exceptions (window.onerror)
 *   - unhandled promise rejections
 *
 * Events are funnelled into the existing analytics buffer so you can inspect
 * them alongside click / web-vital data:
 *
 *   analytics.dump()            // all recent events
 *   errorTracker.dump()         // only error events
 *   errorTracker.last(5)        // last N errors
 */

import { track } from "./analytics";

const ERROR_STORAGE_KEY = "pk_error_events_v1";
const MAX_ERRORS = 200;
const DEDUP_WINDOW_MS = 5_000; // ignore identical messages within 5 s

type ErrorEvent = {
  type: "console_error" | "console_warn" | "uncaught" | "unhandledrejection";
  message: string;
  ts: number;
  path: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
};

function readErrors(): ErrorEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ERROR_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ErrorEvent[]) : [];
  } catch {
    return [];
  }
}

function writeErrors(errors: ErrorEvent[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(errors.slice(-MAX_ERRORS)));
  } catch {
    // storage full — silently drop
  }
}

let lastMsg = "";
let lastTs = 0;

function isDuplicate(message: string) {
  const now = Date.now();
  if (message === lastMsg && now - lastTs < DEDUP_WINDOW_MS) return true;
  lastMsg = message;
  lastTs = now;
  return false;
}

function capture(err: ErrorEvent) {
  if (isDuplicate(err.message)) return;

  const buf = readErrors();
  buf.push(err);
  writeErrors(buf);

  // Also push into the main analytics buffer so everything is in one place
  track("error", {
    error_type: err.type,
    message: err.message.slice(0, 200),
    path: err.path,
    has_stack: !!err.stack,
  });
}

function makeErrorEvent(type: ErrorEvent["type"], message: string, extra?: Partial<ErrorEvent>): ErrorEvent {
  return {
    type,
    message,
    ts: Date.now(),
    path: typeof window !== "undefined" ? window.location.pathname + window.location.hash : "",
    ...extra,
  };
}

let initialised = false;

export function initErrorTracking() {
  if (typeof window === "undefined" || initialised) return;
  initialised = true;

  // ── 1. Wrap console.error ──
  const originalError = console.error;
  console.error = function errorProxy(...args: unknown[]) {
    originalError.apply(console, args);
    const msg = args.map((a) => (typeof a === "string" ? a : String(a))).join(" ");
    capture(makeErrorEvent("console_error", msg.slice(0, 500)));
  };

  // ── 2. Wrap console.warn ──
  const originalWarn = console.warn;
  console.warn = function warnProxy(...args: unknown[]) {
    originalWarn.apply(console, args);
    const msg = args.map((a) => (typeof a === "string" ? a : String(a))).join(" ");
    capture(makeErrorEvent("console_warn", msg.slice(0, 500)));
  };

  // ── 3. Uncaught exceptions ──
  window.addEventListener("error", (event) => {
    capture(
      makeErrorEvent("uncaught", event.message || String(event.error), {
        stack: event.error?.stack?.slice(0, 1_000),
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    );
  });

  // ── 4. Unhandled promise rejections ──
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const msg = reason instanceof Error ? reason.message : String(reason);
    capture(
      makeErrorEvent("unhandledrejection", msg.slice(0, 500), {
        stack: reason instanceof Error ? reason.stack?.slice(0, 1_000) : undefined,
      })
    );
  });
}

export const errorTracker = {
  init: initErrorTracking,
  events(): ErrorEvent[] {
    return readErrors();
  },
  last(n = 10): ErrorEvent[] {
    return readErrors().slice(-n);
  },
  dump(): void {
    // eslint-disable-next-line no-console
    console.table(
      readErrors()
        .slice(-30)
        .map((e) => ({
          time: new Date(e.ts).toLocaleString(),
          type: e.type,
          message: e.message.slice(0, 120),
          path: e.path,
        }))
    );
  },
  clear(): void {
    writeErrors([]);
  },
};

if (typeof window !== "undefined") {
  (window as unknown as Record<string, unknown>).errorTracker = errorTracker;
}
