/**
 * Runtime startup check.
 *
 * Detects two failure modes that have bitten this project before:
 *   1. React is missing / not initialised (e.g. a vendor chunk loads before
 *      react-vendor, so `React.createContext` is undefined).
 *   2. The very first render throws a `createContext` / `useLayoutEffect`
 *      style error (classic symptom of multiple React copies or a bad chunk
 *      split).
 *
 * When either happens we render a clear, branded fallback into #root with
 * reproduction steps, instead of leaving the user with a blank page.
 */

import * as React from "react";

type CrashReason = "react-missing" | "createContext-crash" | "render-crash";

const REPRO_STEPS: Record<CrashReason, string[]> = {
  "react-missing": [
    "Hard refresh the page (Cmd/Ctrl + Shift + R) to bust the CDN cache.",
    "Open DevTools → Network and confirm `react-vendor-*.js` loaded with status 200.",
    "If you just deployed, an old chunk may be cached — wait ~1 min and retry.",
    "If it persists, the Vite `manualChunks` split may have moved a React-dependent package out of `react-vendor`.",
  ],
  "createContext-crash": [
    "This usually means a library that calls `React.createContext` loaded before React itself.",
    "Check `vite.config.ts` → `manualChunks`: any package using React Context (react-i18next, react-helmet, react-router, etc.) must live in the `react-vendor` chunk.",
    "Hard refresh (Cmd/Ctrl + Shift + R) after redeploying.",
  ],
  "render-crash": [
    "The first React render threw. Open DevTools → Console for the original stack trace.",
    "Run `errorTracker.dump()` in the console to see captured errors.",
    "Hard refresh to rule out a stale chunk.",
  ],
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderStartupError(reason: CrashReason, error?: unknown) {
  const root = document.getElementById("root");
  if (!root) return;

  const message =
    error instanceof Error ? error.message : error ? String(error) : "Unknown error";
  const stack = error instanceof Error && error.stack ? error.stack : "";

  const steps = REPRO_STEPS[reason]
    .map((s) => `<li style="margin:6px 0;">${escapeHtml(s)}</li>`)
    .join("");

  root.innerHTML = `
    <div style="
      min-height:100vh;
      display:flex;align-items:center;justify-content:center;
      background:#0a0a0a;color:#e5e5e5;
      font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
      padding:24px;
    ">
      <div style="max-width:720px;width:100%;border:1px solid #2a2a2a;border-radius:12px;padding:28px;background:#111;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444;"></span>
          <strong style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#ef4444;">
            Startup error · ${escapeHtml(reason)}
          </strong>
        </div>
        <h1 style="font-size:20px;margin:0 0 8px;color:#fafafa;">The app failed to start</h1>
        <p style="margin:0 0 16px;color:#a3a3a3;font-size:13px;line-height:1.6;">
          ${escapeHtml(message)}
        </p>
        <div style="font-size:12px;color:#888;margin-bottom:6px;">Reproduction steps:</div>
        <ol style="margin:0 0 18px 18px;padding:0;font-size:13px;color:#d4d4d4;line-height:1.5;">
          ${steps}
        </ol>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="pk-reload" style="
            background:#22c55e;color:#0a0a0a;border:0;border-radius:6px;
            padding:8px 14px;font-weight:600;cursor:pointer;font-family:inherit;font-size:13px;
          ">Hard reload</button>
          <button id="pk-copy" style="
            background:transparent;color:#e5e5e5;border:1px solid #333;border-radius:6px;
            padding:8px 14px;cursor:pointer;font-family:inherit;font-size:13px;
          ">Copy diagnostics</button>
        </div>
        ${
          stack
            ? `<details style="margin-top:18px;"><summary style="cursor:pointer;color:#888;font-size:12px;">Stack trace</summary>
                <pre style="white-space:pre-wrap;word-break:break-word;font-size:11px;color:#a3a3a3;margin:8px 0 0;">${escapeHtml(
                  stack
                )}</pre></details>`
            : ""
        }
      </div>
    </div>
  `;

  document.getElementById("pk-reload")?.addEventListener("click", () => {
    // Cache-busting reload
    window.location.href = window.location.pathname + "?_=" + Date.now();
  });
  document.getElementById("pk-copy")?.addEventListener("click", () => {
    const diag = `reason: ${reason}\nmessage: ${message}\nurl: ${window.location.href}\nua: ${navigator.userAgent}\n\n${stack}`;
    navigator.clipboard?.writeText(diag);
  });
}

/**
 * Verify React is actually initialised. Returns true if OK, false if we
 * rendered the fallback ourselves.
 */
export function verifyReactReady(): boolean {
  try {
    if (!React || typeof React.createContext !== "function" || typeof React.useState !== "function") {
      renderStartupError("react-missing");
      return false;
    }
    // Smoke test: actually call createContext.
    React.createContext(null);
    return true;
  } catch (err) {
    renderStartupError("createContext-crash", err);
    return false;
  }
}

/**
 * Listen for the createContext-class errors that escape during the first
 * render and swap in the fallback UI.
 */
export function installCreateContextGuard() {
  const handler = (event: ErrorEvent) => {
    const msg = event.message || (event.error instanceof Error ? event.error.message : "");
    if (/createContext|Cannot read properties of undefined \(reading '(createContext|useLayoutEffect|useState)'\)/i.test(msg)) {
      renderStartupError("createContext-crash", event.error ?? msg);
    }
  };
  window.addEventListener("error", handler);
}

export function safeRender(mount: () => void) {
  try {
    mount();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const reason: CrashReason = /createContext/i.test(msg)
      ? "createContext-crash"
      : "render-crash";
    renderStartupError(reason, err);
  }
}
