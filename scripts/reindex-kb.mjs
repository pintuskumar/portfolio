/**
 * Re-index the chat knowledge base (Node.js version).
 * Usage: node scripts/reindex-kb.mjs
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://venkngosghcucxggkuzd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbmtuZ29zZ2hjdWN4Z2drdXpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NTEyMzksImV4cCI6MjA5MDAyNzIzOX0.tphVgYmthkQU1Ag9fw8uxIweqoMwnxEATckwuMfU8EA";

const adminToken = "M.XtUG4AJJgWdXB";

const resumeMd = readFileSync(resolve(__dirname, "..", "src", "data", "resume.md"), "utf8");

const portfolioMd = `# Pintu Kumar - Portfolio data
Full Stack Developer with 3+ years experience. See resume.md for details.`;

const url = `${SUPABASE_URL}/functions/v1/kb-reindex`;
console.log(`POST ${url}`);
console.log(`  resume.md: ${resumeMd.length} chars`);

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
