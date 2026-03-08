import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../../lib/redis";

const ACTIVE_KEY = "visitors:active";
const TTL_SECONDS = 60; // Consider inactive after 60s

function getVisitorId(req: NextRequest): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = req.headers.get("user-agent") || "";
  // Simple hash to create a visitor ID from IP + UA
  let hash = 0;
  const str = ip + ua;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return `v_${Math.abs(hash).toString(36)}`;
}

export async function POST(req: NextRequest) {
  try {
    const visitorId = getVisitorId(req);
    const now = Date.now();
    const action = req.nextUrl.searchParams.get("action");

    if (action === "leave") {
      await redis.zrem(ACTIVE_KEY, visitorId);
    } else {
      // Add/update visitor with current timestamp as score
      await redis.zadd(ACTIVE_KEY, { score: now, member: visitorId });
    }

    // Remove stale visitors (older than TTL)
    await redis.zremrangebyscore(ACTIVE_KEY, 0, now - TTL_SECONDS * 1000);

    const active = await redis.zcard(ACTIVE_KEY);
    return NextResponse.json({ active });
  } catch {
    return NextResponse.json({ active: 0 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const action = req.nextUrl.searchParams.get("action");

    if (action === "leave") {
      const visitorId = getVisitorId(req);
      await redis.zrem(ACTIVE_KEY, visitorId);
    }

    const now = Date.now();
    // Clean up stale entries
    await redis.zremrangebyscore(ACTIVE_KEY, 0, now - TTL_SECONDS * 1000);

    const active = await redis.zcard(ACTIVE_KEY);
    return NextResponse.json({ active });
  } catch {
    return NextResponse.json({ active: 0 });
  }
}
