"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

let initialized = false;

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (initialized) return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;

    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      persistence: "localStorage+cookie",
    });

    initialized = true;

    // Track section visibility
    let observer: IntersectionObserver;
    const timeoutId = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              posthog.capture("section_viewed", {
                section: entry.target.id,
              });
            }
          });
        },
        { threshold: 0.5 }
      );
      document.querySelectorAll("section[id]").forEach((el) => observer.observe(el));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, []);

  return <>{children}</>;
}
