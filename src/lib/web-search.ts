export async function searchWeb(query: string): Promise<string> {
  // Try Tavily first
  const tavilyKey = process.env.TAVILY_API_KEY;
  if (tavilyKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, max_results: 3, search_depth: "basic" }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const results = data.results as Array<{ title: string; content: string }>;
        if (results?.length) {
          return results.map((r) => `${r.title}: ${r.content}`).join("\n");
        }
      }
    } catch {
      // Fall through to Serper
    }
  }

  // Fall back to Serper
  const serperKey = process.env.SERPER_API_KEY;
  if (serperKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": serperKey,
        },
        body: JSON.stringify({ q: query, num: 3 }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const organic = data.organic as Array<{ title: string; snippet: string }>;
        if (organic?.length) {
          return organic.map((r) => `${r.title}: ${r.snippet}`).join("\n");
        }
      }
    } catch {
      // Fall through to empty string
    }
  }

  return "";
}
