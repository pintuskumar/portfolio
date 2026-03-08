import { NextRequest } from "next/server";
import OpenAI from "openai";
import { skills, experiences, projects, education, verifiedCertificateLinks } from "../../../data/portfolio-data";
import { rateLimit } from "../../../lib/rate-limit";

const openai = new OpenAI({
  apiKey: process.env.FASTROUTER_API_KEY,
  baseURL: process.env.FASTROUTER_API_URL?.replace("/chat/completions", ""),
});

const systemPrompt = `You are an AI assistant on Pintu Kumar's portfolio website. Answer questions about Pintu based ONLY on the following data. Be friendly, concise, and professional. If asked something not covered by this data, politely say you can only answer questions about Pintu's portfolio.

## About
Pintu Kumar is a Full Stack Software Developer with 3+ years of experience specializing in React, Node.js, TypeScript, and cloud technologies. He has worked across healthcare, logistics, e-commerce, and security domains. Email: pksharmagh4@gmail.com. Location: India.

## Skills
${skills.map((s) => `- ${s.name} (${s.category}): ${s.level}%`).join("\n")}

## Experience
${experiences.map((e) => `### ${e.company} - ${e.role} (${e.duration})
${e.description}
Achievements: ${e.achievements.join("; ")}
Tech: ${e.technologies.join(", ")}`).join("\n\n")}

## Projects
${projects.map((p) => `### ${p.title}
${p.description}
Tech: ${p.technologies.join(", ")}
${p.liveUrl ? `Live: ${p.liveUrl}` : ""}
${p.githubUrl ? `GitHub: ${p.githubUrl}` : ""}`).join("\n\n")}

## Education
${education.map((e) => `${e.degree} in ${e.field} from ${e.school} (${e.duration})
${e.achievements?.join("; ") || ""}`).join("\n")}

## Certifications
${verifiedCertificateLinks.map((c) => `- ${c.name} by ${c.provider}`).join("\n")}

Keep responses brief (2-4 sentences) unless the user asks for details.`;

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 20 messages per hour per IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const { success } = await rateLimit(`chat:${ip}`, 20, 3600);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.FASTROUTER_MODEL || "openai/gpt-5.2",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream: true,
      max_tokens: 500,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
