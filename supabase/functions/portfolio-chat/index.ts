// Portfolio AI Chat Edge Function (RAG-backed).
// Embeds the latest user message, retrieves top-K chunks from kb_chunks,
// then streams a completion grounded in that context.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EMBEDDING_MODEL = "openai/text-embedding-3-small";
const CHAT_MODEL = "google/gemini-3-flash-preview";
const TOP_K = 6;

const SYSTEM_PROMPT = `You are Pintu Kumar's AI portfolio assistant, talking to recruiters and visitors.

Rules:
- Answer ONLY using the CONTEXT block below. Do not invent skills, projects, dates, employers, or contact details.
- If the answer isn't in the context, say so briefly and suggest the contact form on the site.
- Be concise (2–5 sentences for simple questions; use bullets for lists).
- Use markdown for structure. Refer to Pintu as "he" / "Pintu".
- Recruiter-friendly tone: confident, factual, no fluff.`;

async function embed(text: string, apiKey: string): Promise<number[]> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text }),
  });
  if (!resp.ok) throw new Error(`Embedding failed: ${resp.status} ${await resp.text()}`);
  const json = await resp.json();
  return json.data[0].embedding as number[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
      throw new Error("Server misconfigured");
    }

    // 1. Retrieve relevant context using the last user message.
    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === "user");
    let contextBlock = "";
    if (lastUser?.content) {
      try {
        const queryEmbedding = await embed(String(lastUser.content).slice(0, 2000), LOVABLE_API_KEY);
        const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
        const { data: hits, error } = await supabase.rpc("match_kb_chunks", {
          query_embedding: queryEmbedding as unknown as string,
          match_count: TOP_K,
        });
        if (error) {
          console.error("match_kb_chunks error:", error);
        } else if (hits?.length) {
          contextBlock = hits
            .map(
              (h: { source: string; heading: string | null; content: string }) =>
                `### ${h.heading ?? "(no heading)"} — source: ${h.source}\n${h.content}`,
            )
            .join("\n\n---\n\n");
        }
      } catch (e) {
        console.error("Retrieval failed, continuing without context:", e);
      }
    }

    const systemWithContext = contextBlock
      ? `${SYSTEM_PROMPT}\n\n## CONTEXT\n${contextBlock}`
      : `${SYSTEM_PROMPT}\n\n## CONTEXT\n(No knowledge base content available. Tell the user the chat isn't initialized yet and suggest the contact form.)`;

    // 2. Stream the completion.
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [{ role: "system", content: systemWithContext }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
