/**
 * Re-index the chat knowledge base.
 *
 * Usage:
 *   KB_ADMIN_TOKEN=<your-token> bun scripts/reindex-kb.ts
 *
 * Reads src/data/resume.md + serializes src/data/portfolio.ts into Markdown,
 * then POSTs both to the kb-reindex edge function. Run this whenever you
 * edit the resume or project data.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  PROFILE,
  EDUCATION,
  EXPERIENCE,
  SKILLS,
  PROJECTS,
  ACHIEVEMENTS,
  LEARNING_ITEMS,
} from "../src/data/portfolio";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "https://venkngosghcucxggkuzd.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbmtuZ29zZ2hjdWN4Z2drdXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTEyMzksImV4cCI6MjA5MDAyNzIzOX0.tphVgYmthkQU1Ag9fw8uxIweqoMwnxEATckwuMfU8EA";

const adminToken = process.env.KB_ADMIN_TOKEN;
if (!adminToken) {
  console.error("Missing KB_ADMIN_TOKEN env var. Get the value from Lovable Cloud → Secrets.");
  process.exit(1);
}

const resumeMd = readFileSync(resolve("src/data/resume.md"), "utf8");

function portfolioToMarkdown(): string {
  const lines: string[] = [];
  lines.push("# Pintu Kumar — Portfolio data (structured)");
  lines.push("");
  lines.push("## Profile snapshot");
  lines.push(`- **Name:** ${PROFILE.name}`);
  lines.push(`- **Location:** ${PROFILE.location}`);
  lines.push(`- **LinkedIn:** ${PROFILE.linkedin}`);
  lines.push(`- **GitHub:** ${PROFILE.github}`);
  lines.push(`- **About:** ${PROFILE.about}`);
  lines.push(`- **Projects shipped:** ${PROFILE.projects}`);
  lines.push("");

  lines.push("## Education");
  for (const e of EDUCATION) lines.push(`- **${e.degree}** — ${e.school} (${e.year})`);
  lines.push("");

  lines.push("## Experience");
  for (const e of EXPERIENCE) {
    lines.push(`### ${e.position} — ${e.company} (${e.duration})`);
    lines.push(e.summary);
    lines.push("");
  }

  lines.push("## Skills");
  for (const s of SKILLS) {
    lines.push(
      `- **${s.name}** (${s.category}, ~${s.level}% proficiency) — used in: ${s.relatedProjects.join(", ")}`,
    );
  }
  lines.push("");

  lines.push("## Projects");
  for (const p of PROJECTS) {
    lines.push(`### ${p.title} (${p.category})`);
    lines.push(`- **Role:** ${p.role} · **Duration:** ${p.duration}`);
    lines.push(`- **Stack:** ${p.tags.join(", ")}`);
    lines.push(`- **Summary:** ${p.longDescription}`);
    lines.push(`- **Problem:** ${p.problem}`);
    lines.push(`- **Approach:** ${p.approach}`);
    if (p.techDecisions?.length) {
      lines.push(`- **Tech decisions:**`);
      for (const td of p.techDecisions) lines.push(`  - ${td.tech}: ${td.reason}`);
    }
    if (p.outcomes?.length) {
      lines.push(`- **Outcomes:**`);
      for (const o of p.outcomes) lines.push(`  - ${o}`);
    }
    if (p.metrics?.length) {
      lines.push(`- **Metrics:** ${p.metrics.map((m) => `${m.label}: ${m.value}`).join(" · ")}`);
    }
    lines.push("");
  }

  lines.push("## Achievements");
  for (const a of ACHIEVEMENTS) lines.push(`- **${a.title}** — ${a.issuer} (${a.year})`);
  lines.push("");

  lines.push("## Currently learning");
  lines.push(LEARNING_ITEMS.join(", "));
  lines.push("");

  return lines.join("\n");
}

const portfolioMd = portfolioToMarkdown();

const url = `${SUPABASE_URL}/functions/v1/kb-reindex`;
console.log(`POST ${url}`);
console.log(`  resume.md: ${resumeMd.length} chars`);
console.log(`  portfolio.md: ${portfolioMd.length} chars`);

const resp = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "x-admin-token": adminToken,
  },
  body: JSON.stringify({
    sources: [
      { source: "resume", markdown: resumeMd },
      { source: "portfolio", markdown: portfolioMd },
    ],
  }),
});

const text = await resp.text();
if (!resp.ok) {
  console.error(`Failed (${resp.status}):`, text);
  process.exit(1);
}
console.log("OK:", text);
