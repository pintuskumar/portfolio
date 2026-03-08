"use client";

import { useEffect, useState } from "react";

export function useViewCount(slug: string) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => setViews(null));
  }, [slug]);

  return views;
}
