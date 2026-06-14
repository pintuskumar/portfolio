// Admin-only edge function: re-index the chat knowledge base.
// Receives Markdown sources, chunks them, embeds each chunk via Lovable AI,
// and replaces the contents of public.kb_chunks.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-token",
};

const EMBEDDING_MODEL = "openai/text-embedding-3-small";
const MAX_CHUNK = 600;
const OVERLAP = 80;
const SOFT_SPLIT = 800;

type SourceDoc = { source: string; markdown: string };

function chunkBySection(doc: SourceDoc) {
  // Split a Markdown doc by H2 headings, then sub-chunk long sections.
  const out: { source: string; heading: string | null; content: string }[] = [];
  const lines = doc.markdown.split("\n");
  let currentHeading: string | null = null;
  let buf: string[] = [];

  const flush = () => {
    const text = buf.join("\n").trim();
    if (!text) return;
    if (text.length <= SOFT_SPLIT) {
      out.push({ source: doc.source, heading: currentHeading, content: text });
    } else {
      // Slide a window with overlap so we don't cut mid-thought.
      for (let i = 0; i < text.length; i += MAX_CHUNK - OVERLAP) {
        const piece = text.slice(i, i + MAX_CHUNK).trim();
        if (piece) out.push({ source: doc.source, heading: currentHeading, content: piece });
      }
    }
    buf = [];
  };

  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      flush();
      currentHeading = m[1].trim();
      continue;
    }
    buf.push(line);
  }
  flush();
  return out;
}

async function embedBatch(inputs: string[], apiKey: string): Promise<number[][]> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: inputs }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Embeddings error ${resp.status}: ${t}`);
  }
  const json = await resp.json();
  return json.data.map((d: { embedding: number[] }) => d.embedding);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const adminToken = Deno.env.get("KB_ADMIN_TOKEN");
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!adminToken || !apiKey || !supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.headers.get("x-admin-token") !== adminToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as { sources?: SourceDoc[] };
    if (!body.sources?.length) {
      return new Response(JSON.stringify({ error: "sources[] required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const t0 = Date.now();
    const chunks = body.sources.flatMap(chunkBySection);
    if (!chunks.length) {
      return new Response(JSON.stringify({ error: "No chunks produced" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Embed in batches of 50.
    const embeddings: number[][] = [];
    for (let i = 0; i < chunks.length; i += 50) {
      const slice = chunks.slice(i, i + 50);
      const vecs = await embedBatch(slice.map((c) => c.content), apiKey);
      embeddings.push(...vecs);
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Replace all rows.
    const { error: delErr } = await supabase
      .from("kb_chunks")
      .delete()
      .gte("created_at", "1970-01-01");
    if (delErr) throw new Error(`Delete failed: ${delErr.message}`);

    const rows = chunks.map((c, i) => ({
      source: c.source,
      heading: c.heading,
      content: c.content,
      embedding: embeddings[i] as unknown as string, // pgvector accepts JSON array literal
      token_estimate: Math.ceil(c.content.length / 4),
    }));

    // Insert in batches to avoid payload limits.
    for (let i = 0; i < rows.length; i += 100) {
      const { error: insErr } = await supabase
        .from("kb_chunks")
        .insert(rows.slice(i, i + 100));
      if (insErr) throw new Error(`Insert failed: ${insErr.message}`);
    }

    return new Response(
      JSON.stringify({ ok: true, chunks: chunks.length, ms: Date.now() - t0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("kb-reindex error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
