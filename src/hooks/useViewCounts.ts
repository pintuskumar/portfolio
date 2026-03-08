"use client";
import { useEffect, useState } from "react";

export function useViewCounts(slugs: string[]) {
  const [views, setViews] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all(
      slugs.map((slug) =>
        fetch(`/api/views/${slug}`, { method: "POST" })
          .then((res) => res.json())
          .then((data) => ({ slug, views: data.views as number }))
          .catch(() => ({ slug, views: 0 }))
      )
    ).then((results) => {
      const map: Record<string, number> = {};
      results.forEach((r) => { map[r.slug] = r.views; });
      setViews(map);
    });
  }, [slugs.join(",")]);

  return views;
}
